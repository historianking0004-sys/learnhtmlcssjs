const mongoose = require('mongoose');

console.log("MONGO_URI:", process.env.MONGO_URI ? "Mil Gayi ✅" : "NAHI MILI ❌");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Atlas Connected ✅"))
.catch((err) => console.log("MongoDB Error:", err));

const userSchema = mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    results: [{
    lesson: String, // e.g. "Lesson 1"
    score: Number, // 0-100
    status: String, // Pass / Fail
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model("user", userSchema);