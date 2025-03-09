const cards = document.querySelectorAll('.card');
let FlippedCard = false;
let lock = false;
let firstCard, secondCard;
let attempts = 0;
let matches = 0;
const totalPairs = 8;
let timerStarted = false;
let timer;
let time = 0;

// Create and style the attempt and timer box
const infoBox = document.createElement('div');
infoBox.classList.add('info-box');
infoBox.innerHTML = `<p>Attempts: <span id="attempts-count">0</span></p>
                     <p>Time: <span id="timer-count">0</span> sec</p>`;
document.body.appendChild(infoBox);

const attemptsCount = document.getElementById('attempts-count');
const timerCount = document.getElementById('timer-count');

// Create a popup for game over message
const popup = document.createElement('div');
popup.classList.add('popup');
popup.innerHTML = `<div class='popup-content'>
                      <h2>Game Over!</h2>
                      <p>Total Attempts: <span id='popup-attempts'></span></p>
                      <p>Total Time: <span id='popup-time'></span> sec</p>
                      <button onclick='closePopup()'>OK</button>
                   </div>`;
document.body.appendChild(popup);
popup.style.display = 'none';

function startTimer() {
    timer = setInterval(() => {
        time++;
        timerCount.textContent = time;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function flip() {
    if (lock) return;
    if (this === firstCard) return;
    
    if (!timerStarted) {
        timerStarted = true;
        startTimer();
    }
    
    this.classList.add('flip');
    //prv click na karta
    if (!FlippedCard) {
        FlippedCard = true;
        firstCard = this;
        return;
    }
    //Vtor click na karta
    secondCard = this;
    attempts++;
    attemptsCount.textContent = attempts;
    Check();
}

function Check() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? Match() : UnFlip();
}

function Match() {
    firstCard.removeEventListener('click', flip);
    secondCard.removeEventListener('click', flip);
    matches++;  
    if (matches === totalPairs) {
        stopTimer();
        setTimeout(() => showPopup(), 500);
    }
    reset();
}

function UnFlip() {
    lock = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        reset();
    }, 600);
}

function reset() {
    [FlippedCard, lock] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function showPopup() {
    document.getElementById('popup-attempts').textContent = attempts;
    document.getElementById('popup-time').textContent = time;
    popup.style.display = 'flex';
}

function closePopup() {
    popup.style.display = 'none';
}

(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
})();

cards.forEach(card => card.addEventListener('click', flip));

// CSS styles for positioning the boxes and popup
const style = document.createElement('style');
style.innerHTML = `
    .info-box {
    position: fixed;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 30px 120px 30px 120px;
    border-radius: 20px 0px 0px 20px;
    font-size: 25px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    line-height: 4;
    }

    .popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .popup-content {
        background: white;
        padding: 70px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        width: 750px;
        font-size: 26px;
    }

    .popup-content h2 {
        margin-bottom: 25px;
        font-size: 55px;
        font-weight: bold;
        color: rgb(224, 224, 64);
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000
    }

    .popup-content button {
        margin-top: 40px;
        padding: 20px 100px;
        background: rgb(224, 224, 64);
        color: black;
        border: 1px solid black;
        border-radius: 5px;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
    }
`;
document.head.appendChild(style);
