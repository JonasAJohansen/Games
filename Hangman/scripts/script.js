const wordDisplay = document.querySelector(".word-display");
const keyboardDiv = document.querySelector(".keyboard");

const getRandomWord = () => {
    //Selecting a random word
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    console.log(word);
    document.querySelector(".hint-text b").innerText = hint;
    wordDisplay.innerHTML = word.split("").map(() => '<li class="letter"></li>').join("");
}

// Ensuring that the DOM is fully loaded before manipulating it
document.addEventListener('DOMContentLoaded', () => {
    // Keyboard Buttons
    for (let i = 97; i <= 122; i++) {
        const button = document.createElement('button');
        button.innerText = String.fromCharCode(i);
        keyboardDiv.appendChild(button);
    }

    getRandomWord();
});