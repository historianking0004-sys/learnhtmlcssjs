const links = document.querySelectorAll('.tab1-content');
const tab2 = document.getElementById('tab2');

links.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const clicked = this.getAttribute('data-para');

    if (clicked === 'a') {
      tab2.innerHTML = `<h2>HTML Lessons</h2>
      <div class='html-lessons-box'>
      <figure onclick="window.location.href='/lesson1'">
      <img class='html' src='/images/html.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 1</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson2'">
      <img class='html' src='/images/html.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 2</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson3'">
      <img class='html' src='/images/html.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 3</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson4'">
      <img class='html' src='/images/html.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 4</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson5'">
      <img class='html' src='/images/html.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 5</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson6'">
      <img class='html' src='/images/html.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 6</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson7'">
      <img class='html' src='/images/html.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 7</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson8'">
      <img class='html' src='/images/html.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 8</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson9'">
      <img class='html' src='/images/html.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 9</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson10'">
      <img class='html' src='/images/html.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 10</figcaption>
      </figure>
      </div>
      `;
    }
    else if (clicked === 'b') {
      tab2.innerHTML = `<h2>CSS Lessons</h2>
      <div class='css-lessons-box'>
      <figure onclick="window.location.href='/lesson11'">
      <img class='html' src='/images/css.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 11</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson12'">
      <img class='html' src='/images/css.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 12</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson13'">
      <img class='html' src='/images/css.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 13</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson14'">
      <img class='html' src='/images/css.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 14</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson15'">
      <img class='html' src='/images/css.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 15</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson16'">
      <img class='html' src='/images/css.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 16</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson17'">
      <img class='html' src='/images/css.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 17</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson18'">
      <img class='html' src='/images/css.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 18</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson19'">
      <img class='html' src='/images/css.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 19</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson20'">
      <img class='html' src='/images/css.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 20</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson41'">
      
      </div>`;
    }
    else if (clicked === 'c') {
      tab2.innerHTML = `<h2>Javascript Lessons</h2>
      <div class='js-lessons-box'>
      <figure onclick="window.location.href='/lesson21'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 21</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson22'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 22</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson23'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 23</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson24'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 24</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson25'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 25</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson26'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 26</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson27'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 27</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson28'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 28</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson29'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 29</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson30'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 30</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson31'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 31</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson32'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 32</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson33'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 33</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson34'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 34</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson35'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 35</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson36'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 36</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson37'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 37</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson38'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 38</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson39'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 39</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson40'">
      <img class='html' src='/images/js.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 40</figcaption>
      </figure>
      </div>`;
    }
      else if (clicked === 'd') {
      tab2.innerHTML = `<h2>Career Lessons</h2>
      <div class='career-lessons-box'>
      <figure onclick="window.location.href='/lesson41'">
      <img class='html' src='/images/all.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 41</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson42'">
      <img class='html' src='/images/all.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 42</figcaption>
      </figure>
       <figure onclick="window.location.href='/lesson43'">
      <img class='html' src='/images/all.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 43</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson44'">
      <img class='html' src='/images/all.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 44</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson45'">
      <img class='html' src='/images/all.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 45</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson46'">
      <img class='html' src='/images/all.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 46</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson47'">
      <img class='html' src='/images/all.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 47</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson48'">
      <img class='html' src='/images/all.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 48</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson49'">
      <img class='html' src='/images/all.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 49</figcaption>
      </figure>
      <figure onclick="window.location.href='/lesson50'">
      <img class='html' src='/images/all.png' height='100' width='100'>
      <figcaption style='text-align:center'>Lesson 50</figcaption>
      </figure>
      </div>`;
    }

  });
});

const earth = document.querySelector('.earth');

let posX = 0; // Earth ki current position
let isDragging = false;
let lastX = 0;

earth.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    earth.setPointerCapture(e.pointerId);
    earth.style.animationPlayState = 'paused'; // Auto rotate band
});

earth.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    
    let move = e.clientX - lastX;
    posX += move * 2; // 2 = speed, zyada karoge to tez ghoomegi
    lastX = e.clientX;
    
    // Earth ko pointer ke saath ghumao
    earth.style.backgroundPosition = posX + 'px 0';
});

earth.addEventListener('pointerup', () => {
    isDragging = false;
    setTimeout(() => {
        earth.style.animationPlayState = 'running';
        earth.style.backgroundPosition = posX + 'px 0';
    }, 1000);
});
earth.addEventListener('mousemove', (e) => {
    if (isDragging) return;
});

