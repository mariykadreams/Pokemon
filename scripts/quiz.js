const QUIZ_DURATION = 60;
const QUESTIONS_PER_ROUND = 4;

let quizState = {
    isRunning: false,
    timeRemaining: QUIZ_DURATION,
    score: 0,
    currentQuestion: 0,
    userAnswered: false,
    timerInterval: null,
    currentUsername: null
};

const quizQuestions = [
    { pokemon: 'Pikachu', silhouette: '../images/quiz/pikachu_who_0.png', image: '../images/quiz/pikachu_who_1.png', options: ['Pikachu', 'Raichu', 'Bulbasaur', 'Charmander'] },
    { pokemon: 'Bulbasaur', silhouette: '../images/quiz/bulbasaur_who_0.jpg', image: '../images/quiz/bulbasaur_who_1.jpg', options: ['Squirtle', 'Bulbasaur', 'Ivysaur', 'Oddish'] },
    { pokemon: 'Charmander', silhouette: '../images/quiz/charmander_who_0.jpg', image: '../images/quiz/charmander_who_1.jpg', options: ['Charmander', 'Charmeleon', 'Vulpix', 'Growlithe'] },
    { pokemon: 'Psyduck', silhouette: '../images/quiz/psyduck_who_0.jpg', image: '../images/quiz/psyduck_who_1.jpg', options: ['Psyduck', 'Wartortle', 'Psyduck', 'Poliwag'] }
];

function startQuiz() {
    quizState.isRunning = true;
    quizState.timeRemaining = QUIZ_DURATION;
    quizState.score = 0;
    quizState.currentQuestion = 0;
    quizState.userAnswered = false;
    quizState.currentUsername = localStorage.getItem('loggedInUser');

    document.getElementById('game-menu').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('timer-and-score').classList.add('active');
    
    startTimer();
    loadQuestion();
}

function startTimer() {
    quizState.timerInterval = setInterval(() => {
        quizState.timeRemaining--;
        updateTimerDisplay();

        if (quizState.timeRemaining <= 0) {
            endQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerDiv = document.getElementById('timer');
    timerDiv.textContent = `Time: ${quizState.timeRemaining}s`;
    
    if (quizState.timeRemaining <= 10) {
        timerDiv.style.color = 'red';
    }
}

function loadQuestion() {
    if (quizState.currentQuestion >= QUESTIONS_PER_ROUND || quizState.timeRemaining <= 0) {
        endQuiz();
        return;
    }

    const question = quizQuestions[quizState.currentQuestion % quizQuestions.length];
    const image = document.getElementById('pokemon-image');
    const optionsDiv = document.querySelector('.options');
    
    image.src = question.silhouette;
    quizState.userAnswered = false;

    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

    optionsDiv.innerHTML = shuffledOptions
        .map(option => `<button onclick="checkAnswer('${option}', '${question.pokemon}')">${option}</button>`)
        .join('');

    document.getElementById('result').textContent = '';
    document.getElementById('next-question-button').style.display = 'none';
    document.getElementById('question-counter').textContent = `Question ${quizState.currentQuestion + 1}/${QUESTIONS_PER_ROUND}`;
}

function checkAnswer(selected, correct) {
    if (quizState.userAnswered) return;
    
    quizState.userAnswered = true;
    const resultDiv = document.getElementById('result');
    const image = document.getElementById('pokemon-image');
    const nextBtn = document.getElementById('next-question-button');

    image.src = quizQuestions[quizState.currentQuestion % quizQuestions.length].image;

    if (selected === correct) {
        resultDiv.textContent = 'Correct! 🎉';
        resultDiv.style.color = 'green';
        quizState.score += 10;
        
        if (quizState.currentUsername) {
            quizState.score += 5;
        }
    } else {
        resultDiv.textContent = `Wrong! It was ${correct}.`;
        resultDiv.style.color = 'red';
    }

    document.getElementById('score').textContent = `Score: ${quizState.score}`;
    nextBtn.style.display = 'block';
}

function nextQuestion() {
    quizState.currentQuestion++;
    loadQuestion();
}

function endQuiz() {
    clearInterval(quizState.timerInterval);
    quizState.isRunning = false;

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('game-menu').style.display = 'block';
    document.getElementById('timer-and-score').classList.remove('active');

    const finalMessage = document.getElementById('final-score-message');
    const bonusText = quizState.currentUsername ? ' (includes login bonus!)' : '';
    finalMessage.textContent = `Quiz Complete! Your Score: ${quizState.score}${bonusText}`;
    
    document.getElementById('game-ended').style.display = 'block';
    document.getElementById('game-links').style.display = 'none';
}

function backToMenu() {
    document.getElementById('game-ended').style.display = 'none';
    document.getElementById('game-links').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-quiz-button');
    const backBtn = document.getElementById('back-to-menu-button');
    const nextBtn = document.getElementById('next-question-button');

    if (startBtn) startBtn.addEventListener('click', startQuiz);
    if (backBtn) backBtn.addEventListener('click', backToMenu);
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
});