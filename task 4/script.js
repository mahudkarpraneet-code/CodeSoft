// Data storage
let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let questionCount = 0;

// Initialize
function init() {
    loadQuizList();
}

// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'createPage') {
        resetCreateForm();
    } else if (pageId === 'listPage') {
        loadQuizList();
    }
}

// Create Quiz Functions
function resetCreateForm() {
    document.getElementById('quizTitle').value = '';
    document.getElementById('quizDescription').value = '';
    document.getElementById('questionsContainer').innerHTML = '';
    questionCount = 0;
    addQuestion();
}

function addQuestion() {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    const questionBlock = document.createElement('div');
    questionBlock.className = 'question-block';
    questionBlock.innerHTML = `
        <div class="question-header">
            <span class="question-number">Question ${questionCount}</span>
            <button class="btn btn-small btn-secondary" onclick="removeQuestion(this)">Remove</button>
        </div>
        <div class="form-group">
            <label>Question Text *</label>
            <input type="text" class="question-text" placeholder="Enter your question">
        </div>
        <div class="option-group">
            <label>Answer Options (Select the correct answer) *</label>
            <div class="option-input">
                <input type="radio" name="correct-${questionCount}" value="0">
                <input type="text" class="option-text" placeholder="Option 1">
            </div>
            <div class="option-input">
                <input type="radio" name="correct-${questionCount}" value="1">
                <input type="text" class="option-text" placeholder="Option 2">
            </div>
            <div class="option-input">
                <input type="radio" name="correct-${questionCount}" value="2">
                <input type="text" class="option-text" placeholder="Option 3">
            </div>
            <div class="option-input">
                <input type="radio" name="correct-${questionCount}" value="3">
                <input type="text" class="option-text" placeholder="Option 4">
            </div>
        </div>
    `;
    container.appendChild(questionBlock);
}

function removeQuestion(btn) {
    if (document.querySelectorAll('.question-block').length > 1) {
        btn.closest('.question-block').remove();
        updateQuestionNumbers();
    } else {
        alert('You must have at least one question!');
    }
}

function updateQuestionNumbers() {
    const blocks = document.querySelectorAll('.question-block');
    blocks.forEach((block, index) => {
        block.querySelector('.question-number').textContent = `Question ${index + 1}`;
    });
    questionCount = blocks.length;
}

function saveQuiz() {
    const title = document.getElementById('quizTitle').value.trim();
    const description = document.getElementById('quizDescription').value.trim();

    if (!title) {
        alert('Please enter a quiz title!');
        return;
    }

    const questionBlocks = document.querySelectorAll('.question-block');
    const questions = [];

    for (let block of questionBlocks) {
        const questionText = block.querySelector('.question-text').value.trim();
        const optionTexts = Array.from(block.querySelectorAll('.option-text')).map(input => input.value.trim());
        const correctAnswer = block.querySelector('input[type="radio"]:checked');

        if (!questionText || optionTexts.some(opt => !opt) || !correctAnswer) {
            alert('Please fill in all questions, options, and select correct answers!');
            return;
        }

        questions.push({
            question: questionText,
            options: optionTexts,
            correctAnswer: parseInt(correctAnswer.value)
        });
    }

    const quiz = {
        id: Date.now(),
        title,
        description,
        questions,
        createdAt: new Date().toLocaleDateString()
    };

    quizzes.push(quiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));

    alert('Quiz created successfully! 🎉');
    showPage('listPage');
}

// Quiz List Functions
function loadQuizList() {
    const listContainer = document.getElementById('quizList');
    
    if (quizzes.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 4em; margin-bottom: 20px;">📝</div>
                <h3>No Quizzes Available</h3>
                <p>Create your first quiz to get started!</p>
                <button class="btn" onclick="showPage('createPage')" style="margin-top: 20px;">Create Quiz</button>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = quizzes.map(quiz => `
        <div class="quiz-card" onclick="startQuiz(${quiz.id})">
            <h3>${quiz.title}</h3>
            <p>${quiz.description || 'No description available'}</p>
            <div class="quiz-meta">
                ${quiz.questions.length} questions • Created on ${quiz.createdAt}
            </div>
        </div>
    `).join('');
}

// Take Quiz Functions
function startQuiz(quizId) {
    currentQuiz = quizzes.find(q => q.id === quizId);
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.questions.length).fill(null);
    
    showPage('takePage');
    displayQuestion();
}

function displayQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    const container = document.getElementById('quizContainer');
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    container.innerHTML = `
        <div class="question-display">
            <h3>Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}</h3>
            <h2 style="color: #333; margin: 20px 0;">${question.question}</h2>
            <ul class="options-list">
                ${question.options.map((option, index) => `
                    <li onclick="selectOption(${index})" class="${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}" data-index="${index}">
                        ${option}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // Update button text
    const nextBtn = document.getElementById('nextBtn');
    if (currentQuestionIndex === currentQuiz.questions.length - 1) {
        nextBtn.textContent = 'Finish Quiz';
    } else {
        nextBtn.textContent = 'Next Question';
    }
}

function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;
    
    // Update UI
    document.querySelectorAll('.options-list li').forEach(li => {
        li.classList.remove('selected');
    });
    document.querySelector(`.options-list li[data-index="${index}"]`).classList.add('selected');
}

function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === null) {
        alert('Please select an answer before continuing!');
        return;
    }

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    let correctCount = 0;
    const totalQuestions = currentQuiz.questions.length;

    // Calculate score
    currentQuiz.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            correctCount++;
        }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);

    // Display score
    document.getElementById('scoreDisplay').textContent = `${percentage}%`;
    document.getElementById('resultsMessage').textContent = 
        `You got ${correctCount} out of ${totalQuestions} questions correct!`;

    // Display answer review
    const reviewContainer = document.getElementById('answerReview');
    reviewContainer.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #333;">Answer Review</h3>
        ${currentQuiz.questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.correctAnswer;
            return `
                <div class="answer-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <h4>
                        ${question.question}
                        <span class="answer-status ${isCorrect ? 'correct' : 'incorrect'}">
                            ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                    </h4>
                    <p><strong>Your answer:</strong> ${question.options[userAnswers[index]]}</p>
                    ${!isCorrect ? `<p><strong>Correct answer:</strong> ${question.options[question.correctAnswer]}</p>` : ''}
                </div>
            `;
        }).join('')}
    `;

    showPage('resultsPage');
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);