document.getElementById("start-quiz-button").addEventListener("click", function() {
    const selectedCategory = document.getElementById("category-select").value;
    startQuiz(selectedCategory);
});

document.getElementById("theme-toggle-button").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

let currentQuestionIndex = 0;
let currentCategoryData = [];
let correctAnswers = 0;

function startQuiz(category) {
    currentCategoryData = shuffleArray(quizData[category]);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex < currentCategoryData.length) {
        const questionData = currentCategoryData[currentQuestionIndex];
        document.getElementById("question-text").innerText = questionData.question;
        
        const optionsContainer = document.getElementById("options-container");
        optionsContainer.innerHTML = "";
        
        questionData.options.forEach(option => {
            const button = document.createElement("button");
            button.classList.add("option-button");
            button.innerText = option;
            button.addEventListener("click", function() {
                checkAnswer(option);
            });
            optionsContainer.appendChild(button);
        });
    } else {
        showResult();
    }
}

function checkAnswer(selectedOption) {
    const questionData = currentCategoryData[currentQuestionIndex];
    if (selectedOption === questionData.answer) {
        correctAnswers++;
    }
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentCategoryData.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById("question-text").style.display = "none";
    document.getElementById("options-container").style.display = "none";
    
    const result = document.getElementById("result");
    result.innerText = `You answered ${correctAnswers} out of ${currentCategoryData.length} questions correctly!`;
    result.style.display = "block";
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}