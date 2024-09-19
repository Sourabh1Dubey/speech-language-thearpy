const words = ["CAP","TAP","WIN","WING","CAR","TAR","LIGHT","WHITE"];
const gridSize = 10;
let grid = [];
let foundWords = [];
let selectedCells = [];

function initGrid() {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    foundWords = [];
    words.forEach(word => placeWord(word));
    fillEmptyCells();
    renderGrid();
    renderWordList();
    document.getElementById('result').textContent = '';
}

function placeWord(word) {
    const direction = Math.floor(Math.random() * 2); // 0 = horizontal, 1 = vertical
    let placed = false;

    while (!placed) {
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);
        
        if (direction === 0 && startCol + word.length <= gridSize) { // Horizontal
            if (grid[startRow].slice(startCol, startCol + word.length).every(cell => cell === '')) {
                for (let i = 0; i < word.length; i++) {
                    grid[startRow][startCol + i] = word[i];
                }
                placed = true;
            }
        } else if (direction === 1 && startRow + word.length <= gridSize) { // Vertical
            if (grid.slice(startRow, startRow + word.length).every(row => row[startCol] === '')) {
                for (let i = 0; i < word.length; i++) {
                    grid[startRow + i][startCol] = word[i];
                }
                placed = true;
            }
        }
    }
}

function fillEmptyCells() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            }
        }
    }
}

function renderGrid() {
    const wordSearchDiv = document.getElementById('wordSearch');
    wordSearchDiv.innerHTML = '';

    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.textContent = cell;
            cellDiv.addEventListener('click', () => selectCell(rowIndex, colIndex));
            wordSearchDiv.appendChild(cellDiv);
        });
    });
}

function renderWordList() {
    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '';

    words.forEach(word => {
        const listItem = document.createElement('li');
        listItem.textContent = word;
        wordList.appendChild(listItem);
    });
}

function selectCell(row, col) {
    const cellDivs = document.querySelectorAll('.cell');
    const index = row * gridSize + col;

    if (selectedCells.includes(index)) {
        selectedCells.splice(selectedCells.indexOf(index), 1);
        cellDivs[index].classList.remove('selected');
    } else {
        selectedCells.push(index);
        cellDivs[index].classList.add('selected');
    }
}

function checkForMatch(spokenWord) {
    spokenWord = spokenWord.toUpperCase();
    console.log(`You said: ${spokenWord}`); // Log what was recognized

    if (words.includes(spokenWord) && !foundWords.includes(spokenWord)) {
        foundWords.push(spokenWord);
        document.getElementById('result').textContent = `Found: ${spokenWord}`;
        updateGridForFoundWord(spokenWord);
        if (foundWords.length === words.length) {
            document.getElementById('result').textContent = 'Congratulations! You found all the words!';
        }
    } else {
        document.getElementById('result').textContent = `Word not found. You said: "${spokenWord}". Please try again.`;
    }
}

function updateGridForFoundWord(word) {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row].slice(col, col + word.length).join('') === word) {
                for (let i = 0; i < word.length; i++) {
                    document.querySelectorAll('.cell')[row * gridSize + (col + i)].classList.add('selected');
                }
            }
            if (grid.slice(row, row + word.length).map(r => r[col]).join('') === word) {
                for (let i = 0; i < word.length; i++) {
                    document.querySelectorAll('.cell')[(row + i) * gridSize + col].classList.add('selected');
                }
            }
        }
    }
}

function startSpeechRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.trim();
        checkForMatch(spokenWord);
    };
    recognition.onerror = (event) => {
        console.error('Speech recognition error: ', event.error);
        document.getElementById('result').textContent = 'Error recognizing speech. Please try again.';
    };
    recognition.start();
}

document.getElementById('listenBtn').addEventListener('click', startSpeechRecognition);
document.getElementById('resetBtn').addEventListener('click', initGrid);

// Initialize the game on page load
initGrid();
