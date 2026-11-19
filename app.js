require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const path = require('path');
const userModel = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

app.use(helmet({
  contentSecurityPolicy: false, // EJS inline scripts ke liye off
  crossOriginEmbedderPolicy: false
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set("view engine", 'ejs');

// ===== RATE LIMITS =====
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: "Too many login attempts. Try after 15 minutes." });
const signupLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: "Too many signup attempts. Try later." });
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many messages. Try later." });
const saveLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

// ===== HELPERS =====
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function isValidString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}
function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // live site = https
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7
  };
}

// ===== AUTH MIDDLEWARE =====
function isLoggedIn(req, res, next) {
  let token = req.cookies.token;
  if (!token) return res.redirect("/login");
  try {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/login");
  }
}

function optionalAuth(req, res, next) {
  let token = req.cookies.token;
  if (!token) { req.user = null; return next(); }
  try {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
  } catch (err) {
    req.user = null;
  }
  next();
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

const TOTAL_LESSONS = 50;

// ===== HOME =====
app.get('/', async function (req, res) {
  let certifiedStudents = [];
  let certifiedCount = 0;
  try {
    const allUsers = await userModel.find().select('username results').lean();
    const allCertified = allUsers
      .map(u => {
        const results = u.results || [];
        const finalExam = results.find(r => r.lesson && r.lesson.includes('Lesson 50'));
        if (!finalExam || finalExam.status !== 'Pass') return null;
        const passed = results.filter(r => r.status === 'Pass').length;
        const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
        return { username: u.username, certScore: finalExam.score, passed, totalScore, date: finalExam.date };
      })
      .filter(x => x !== null)
      .sort((a, b) => b.certScore - a.certScore);
    certifiedCount = allCertified.length;
    certifiedStudents = allCertified.slice(0, 6);
  } catch (e) { certifiedStudents = []; certifiedCount = 0; }

  let token = req.cookies.token;
  if (!token) {
    return res.render('index', { user: null, completedLessons: 0, userTotalScore: 0, avgScore: 0, certifiedStudents, certifiedCount });
  }
  try {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userModel.findOne({ _id: data.id });
    if (!user) return res.render('index', { user: null, completedLessons: 0, userTotalScore: 0, avgScore: 0, certifiedStudents, certifiedCount });
    const results = user.results || [];
    const completedLessons = results.filter(r => r.status === 'Pass').length;
    const userTotalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
    const avgScore = results.length ? Math.round(userTotalScore / results.length) : 0;
    return res.render('index', { user, completedLessons, userTotalScore, avgScore, certifiedStudents, certifiedCount });
  } catch (err) {
    return res.render('index', { user: null, completedLessons: 0, userTotalScore: 0, avgScore: 0, certifiedStudents, certifiedCount });
  }
});

app.get("/index/:username", isLoggedIn, async (req, res) => {
  if (req.params.username !== req.user.username) {
    return res.redirect(`/index/${req.user.username}`);
  }
  let user = await userModel.findOne({ username: req.params.username }).select('-password');
  if (!user) return res.send("User not found");
  res.render("index", { user });
});

app.get('/login', function (req, res) { res.render('login'); });
app.get('/signup', function (req, res) { res.render('signup'); });
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});
app.get('/ads.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'public', 'ads.txt'));
});
app.get('/privacy-policy', (req, res) => { res.render('privacy-policy'); });
app.get('/terms', (req, res) => { res.render('terms'); });

// ===== PUBLIC PAGES =====
app.get('/playground', optionalAuth, async function (req, res) {
  let user = null;
  if (req.user) user = await userModel.findById(req.user.id).select('-password');
  res.render('playground', { user });
});
app.get('/about', (req, res) => { res.render('about', { user: req.session.user || null }); });
app.get('/faq', (req, res) => { res.render('faq', { user: req.session.user || null }); });
app.get('/contact', (req, res) => { res.render('contact', { success: false, error: null }); });

// ===== ALL 49 LESSONS =====
for (let i = 1; i <= 49; i++) {
  app.get(`/lesson${i}`, optionalAuth, async function (req, res) {
    let user = null;
    if (req.user) {
      try { user = await userModel.findById(req.user.id).select('-password'); } catch (e) { user = null; }
    }
    res.render(`lesson${i}`, { user });
  });
}

// ===== LESSON 50 =====
app.get('/lesson50', optionalAuth, async function (req, res) {
  try {
    let user = null;
    if (req.user) {
      user = await userModel.findById(req.user.id);
    }
    if (!user) {
      return res.render('lesson50', {
        user: null,
        canTakeExam: false,
        passedCount: 0,
        missingLessons: 49,
        failedLessons: Array.from({ length: 49 }, (_, i) => i + 1),
        existingCertificate: null
      });
    }
    let results = user.results || [];
    let passedCount = 0;
    let failedLessons = [];
    for (let i = 1; i <= 49; i++) {
      let best = 0;
      results.forEach(r => {
        if (r.lesson === `Lesson ${i}` || r.lesson.startsWith(`Lesson ${i} -`) || r.lesson.startsWith(`Lesson ${i} `)) {
          if (r.score > best) best = r.score;
        }
      });
      if (best >= 80) passedCount++;
      else failedLessons.push(i);
    }
    let canTakeExam = (passedCount >= 49);
    let finalExam = results.find(r => r.lesson && r.lesson.includes('Lesson 50') && r.status === 'Pass');
    let existingCertificate = null;
    if (finalExam) {
      existingCertificate = {
        certificateId: finalExam.certificateId || user.certificateId || 'LHCSJS-____',
        score: finalExam.score,
        date: finalExam.date
      };
    }
    res.render('lesson50', { user, canTakeExam, passedCount, missingLessons: 49 - passedCount, failedLessons, existingCertificate });
  } catch (err) {
    console.log(err);
    res.redirect("/login");
  }
});

// ===== /user ROUTE REMOVED - SECURITY FIX =====
// Pehle ye route saare users + password hashes leak kar raha tha. Isliye delete kiya.

// ===== CONTACT =====
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

app.post('/contact', contactLimiter, async (req, res) => {
  const { name, email, topic, message } = req.body;
  if (!isValidString(name) || !isValidString(email) || !isValidString(message)) {
    return res.render('contact', { success: false, error: 'Please fill all required fields.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.render('contact', { success: false, error: 'Please enter a valid email.' });
  }
  if (message.length > 2000) {
    return res.render('contact', { success: false, error: 'Message too long.' });
  }
  try {
    await transporter.sendMail({
      from: `"LearnHTMLCSSJS Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact: ${escapeHtml(topic || 'General')} - from ${escapeHtml(name)}`,
      html: `<h3>New Message from Website</h3><p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Topic:</b> ${escapeHtml(topic)}</p><p><b>Message:</b><br>${escapeHtml(message)}</p>`
    });
    res.render('contact', { success: true, error: null });
  } catch (err) {
    console.log(err);
    res.render('contact', { success: false, error: 'Message could not be sent. Please email us directly at contact@learnhtmlcssjs.com' });
  }
});

// ===== SAVE TEST RESULT =====
app.post('/save-result', isLoggedIn, saveLimiter, async (req, res) => {
  try {
    const { lesson, score, status } = req.body;

    // VALIDATION - Fake score rokne ke liye
    if (!isValidString(lesson) || typeof score !== 'number' || score < 0 || score > 100 || !Number.isInteger(score)) {
      return res.json({ success: false, message: 'Invalid score' });
    }
    if (status !== 'Pass' && status !== 'Fail') {
      return res.json({ success: false, message: 'Invalid status' });
    }
    // Lesson format check: "Lesson 1" ... "Lesson 50 - ..."
    if (!/^Lesson (?:[1-9]|[1-4][0-9]|50)(\s|-|$)/.test(lesson)) {
      return res.json({ success: false, message: 'Invalid lesson' });
    }
    // Score aur Status match hona chahiye
    if (status === 'Pass' && score < 80) return res.json({ success: false, message: 'Score too low for Pass' });
    if (status === 'Fail' && score >= 80) return res.json({ success: false, message: 'Score too high for Fail' });

    const user = await userModel.findById(req.user.id);
    if (!user) return res.json({ success: false });

    if (lesson && lesson.includes('Lesson 50')) {
      let results = user.results || [];
      let passedCount = 0;
      for (let i = 1; i <= 49; i++) {
        let best = 0;
        results.forEach(r => {
          if (r.lesson === `Lesson ${i}` || r.lesson.startsWith(`Lesson ${i} -`) || r.lesson.startsWith(`Lesson ${i} `)) {
            if (r.score > best) best = r.score;
          }
        });
        if (best >= 80) passedCount++;
      }
      if (passedCount < 49) {
        return res.json({ success: false, message: 'Complete Lesson 1-49 with 80%+ first!', passedCount });
      }
    }

    if (!user.results) user.results = [];
    const existing = user.results.find(r => r.lesson === lesson);

    let certificateId = null;
    if (lesson && lesson.includes('Lesson 50') && status === 'Pass') {
      let shortId = user._id.toString().slice(-6).toUpperCase();
      certificateId = `LHCSJS-${shortId}-${score}`;
      user.certificateId = certificateId;
      user.certificateDate = new Date();
      user.certificateScore = score;
    }

    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        existing.status = status;
        existing.date = new Date();
        if (certificateId) existing.certificateId = certificateId;
      } else if (certificateId && !existing.certificateId) {
        existing.certificateId = certificateId;
      }
    } else {
      let newResult = { lesson, score, status, date: new Date() };
      if (certificateId) newResult.certificateId = certificateId;
      user.results.push(newResult);
    }
    await user.save();
    res.json({ success: true, certificateId });
  } catch (e) {
    console.log(e);
    res.json({ success: false });
  }
});

// ===== RANKING PAGE =====
app.get('/ranking', async (req, res) => {
  let currentUser = null;
  let token = req.cookies.token;
  if (token) {
    try {
      let data = jwt.verify(token, process.env.JWT_SECRET);
      currentUser = await userModel.findById(data.id).select('-password');
    } catch (e) { currentUser = null; }
  }
  const selectedLesson = req.query.lesson || 'All';
  const allUsers = await userModel.find().select('username results').lean();

  let overall = allUsers.map(u => {
    const results = u.results || [];
    const passed = results.filter(r => r.status === 'Pass').length;
    const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
    const avg = results.length ? Math.round(totalScore / results.length) : 0;
    const finalExam = results.find(r => r.lesson && r.lesson.includes('Lesson 50'));
    const hasCertificate = finalExam && finalExam.status === 'Pass';
    const certScore = finalExam ? finalExam.score : 0;
    return { username: u.username, passed, attempted: results.length, totalScore, avg, progress: Math.round((passed / 50) * 100), hasCertificate, certScore };
  });
  overall.sort((a, b) => b.passed - a.passed || b.totalScore - a.totalScore);

  let lessons = [];
  for (let i = 1; i <= 50; i++) lessons.push(`Lesson ${i}`);
  let dbLessons = new Set();
  allUsers.forEach(u => (u.results || []).forEach(r => dbLessons.add(r.lesson)));
  lessons = [...new Set([...lessons, ...dbLessons])].sort((a, b) => {
    let na = parseInt(a.replace(/\D/g, '')) || 0, nb = parseInt(b.replace(/\D/g, '')) || 0;
    return na - nb;
  });

  let lessonWise = [];
  if (selectedLesson !== 'All') {
    lessonWise = allUsers
      .map(u => {
        const found = (u.results || []).find(r => r.lesson === selectedLesson);
        if (!found) return null;
        const finalExam = (u.results || []).find(r => r.lesson && r.lesson.includes('Lesson 50'));
        const hasCertificate = finalExam && finalExam.status === 'Pass';
        return { username: u.username, score: found.score, status: found.status, date: found.date, hasCertificate };
      })
      .filter(x => x !== null)
      .sort((a, b) => b.score - a.score);
  }
  res.render('ranking', { user: currentUser, overall, lessonWise, lessons, selectedLesson });
});

// ===== DASHBOARD =====
app.get('/dashboard', isLoggedIn, async (req, res) => {
  const user = await userModel.findById(req.user.id).select('-password');
  if (!user) return res.redirect('/login');
  const totalLessons = TOTAL_LESSONS;
  const results = user.results || [];
  let passed49 = 0;
  let failedLessons = [];
  for (let i = 1; i <= 49; i++) {
    let best = 0;
    results.forEach(r => {
      if (r.lesson === `Lesson ${i}` || r.lesson.startsWith(`Lesson ${i} -`) || r.lesson.startsWith(`Lesson ${i} `)) {
        if (r.score > best) best = r.score;
      }
    });
    if (best >= 80) passed49++;
    else failedLessons.push(i);
  }
  const passed = results.filter(r => r.status === 'Pass').length;
  const progress = Math.round((passed / 50) * 100);
  const canTakeExam = (passed49 >= 49);
  const certProgress = Math.round((passed49 / 49) * 100);
  let finalExam = results.find(r => r.lesson && r.lesson.includes('Lesson 50'));
  let hasCertificate = finalExam && finalExam.status === 'Pass';
  res.render('dashboard', { user, progress, passed, totalLessons, passed49, failedLessons, canTakeExam, certProgress, hasCertificate, finalExam });
});

// ===== CERTIFICATE VERIFY =====
app.get('/verify', (req, res) => {
  res.render('verify', { result: null, searched: false, error: null });
});

app.get('/verify/:certificateId', async (req, res) => {
  try {
    let certId = String(req.params.certificateId || '').toUpperCase().trim().slice(0, 30);
    if (!/^[A-Z0-9\-]+$/.test(certId)) {
      return res.render('verify', { result: null, searched: true, error: 'Invalid Certificate ID format.' });
    }
    let user = await userModel.findOne({ certificateId: certId }).select('-password');
    if (!user) {
      user = await userModel.findOne({ "results.certificateId": certId }).select('-password');
    }
    if (!user) {
      return res.render('verify', { result: null, searched: true, error: 'Certificate not found. Please check Certificate ID and try again.' });
    }
    let finalExam = (user.results || []).find(r => r.lesson && r.lesson.includes('Lesson 50'));
    let passed49 = (user.results || []).filter(r => r.status === 'Pass' && !r.lesson.includes('Lesson 50')).length;
    res.render('verify', {
      searched: true,
      error: null,
      result: {
        username: user.username,
        certificateId: user.certificateId || finalExam.certificateId,
        score: finalExam ? finalExam.score : user.certificateScore,
        date: finalExam ? finalExam.date : user.certificateDate,
        passedLessons: passed49,
        totalScore: (user.results || []).reduce((s, r) => s + (r.score || 0), 0)
      }
    });
  } catch (e) {
    console.log(e);
    res.render('verify', { result: null, searched: true, error: 'Something went wrong. Please try again.' });
  }
});

app.post('/verify', async (req, res) => {
  let certId = String(req.body.certificateId || '').toUpperCase().trim();
  if (!certId) return res.render('verify', { result: null, searched: false, error: 'Please enter Certificate ID.' });
  if (!/^[A-Z0-9\-]+$/.test(certId)) return res.render('verify', { result: null, searched: false, error: 'Invalid Certificate ID.' });
  res.redirect('/verify/' + encodeURIComponent(certId));
});

// ===== AUTH =====
app.post("/signup", signupLimiter, async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!isValidString(username) || !isValidString(email) || !isValidString(password)) {
      return res.send("Please fill all fields");
    }
    username = username.toLowerCase().trim();
    email = email.toLowerCase().trim();
    if (username.length < 3 || username.length > 20) return res.send("Username must be 3-20 characters");
    if (!/^[a-z0-9_]+$/.test(username)) return res.send("Username can only contain letters, numbers and _");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.send("Invalid email");
    if (password.length < 6) return res.send("Password must be at least 6 characters");

    let existingUser = await userModel.findOne({ username });
    if (existingUser) return res.send("User already exists");
    let existingEmail = await userModel.findOne({ email });
    if (existingEmail) return res.send("Email already registered");

    let hashPassword = await bcrypt.hash(password, 10);
    await userModel.create({ username, email, password: hashPassword, results: [] });
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.send("Something went wrong. Try again.");
  }
});

app.post("/login", loginLimiter, async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!isValidString(username) || !isValidString(password)) {
      return res.send("Invalid login. Please try again.");
    }
    let user = await userModel.findOne({ username: String(username).toLowerCase().trim() });
    // Generic message - hacker ko pata na chale user hai ya nahi
    if (!user) return res.send("Invalid username or password");
    let isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) return res.send("Invalid username or password");
    let token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("token", token, getCookieOptions());
    res.redirect("/");
  } catch (e) {
    console.log(e);
    res.send("Something went wrong. Try again.");
  }
});

// 404
app.use((req, res) => { res.status(404).send("Page not found - LearnHTMLCSSJS.com"); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT} - 50 Lessons Ready`));