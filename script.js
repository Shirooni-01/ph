const MenuBtn = document.getElementById('menu_btn');
const menu = document.getElementById('menu');

if (MenuBtn) {
    MenuBtn.addEventListener('click', () => {
        menu.classList.toggle('show');
    });
}

// Home page cards
const GraphCard = document.getElementById('graphcard');
if (GraphCard) {
    GraphCard.addEventListener('click', () => {
        window.location.href = 'features/graph.html';
    });
}

const ModelCard = document.getElementById('d3card');
if (ModelCard) {
    ModelCard.addEventListener('click', () => {
        window.location.href = 'features/model.html';
    });
}

const lectureCard = document.getElementById('lecturecard');
if (lectureCard) {
    lectureCard.addEventListener('click', () => {
        window.location.href = 'features/lectures.html';
    });
}

const quizCard = document.getElementById('quizcard');
if (quizCard) {
    quizCard.addEventListener('click', () => {
        window.location.href = 'features/quiz.html';
    });
}

// Back button
const backBtn = document.getElementById('back_btn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
}