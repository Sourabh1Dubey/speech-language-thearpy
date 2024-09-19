const minimalPairs = [
    ['bat', 'pat'],
    ['sip', 'zip'],
    ['cat', 'cut'],
    ['fan', 'van'],
    ['ship', 'sheep']
];

let currentPair = [];

document.getElementById('generateBtn').addEventListener('click', generatePair);
document.getElementById('listenBtn').addEventListener('click', listenWords);
document.getElementById('speakBtn').addEventListener('click', speakAndCheck);

function generatePair() {
    const randomIndex = Math.floor(Math.random() * minimalPairs.length);
    currentPair = minimalPairs[randomIndex];
    document.getElementById('word1').textContent = currentPair[0];
    document.getElementById('word2').textContent = currentPair[1];
    document.getElementById('result').textContent = '';
}

function listenWords() {
    const utterance = new SpeechSynthesisUtterance(currentPair.join(', '));
    window.speechSynthesis.speak(utterance);
}

function speakAndCheck() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
        checkAnswer(spokenWord);
    };
    recognition.start();
}

function checkAnswer(spokenWord) {
    const isCorrect = spokenWord === currentPair[0] || spokenWord === currentPair[1];
    document.getElementById('result').textContent = isCorrect ? "Correct!" : "Try again!";
}
