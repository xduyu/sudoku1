document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('sudoku-grid');
    const messageContainer = document.getElementById('message');
    
    // Полное решение судоку для генерации новых игр
    const completeSudoku = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];

    // Создание сетки 9x9 с случайным скрытием ячеек
    function createRandomGrid(sudoku, emptyCellsCount) {
        const sudokuCopy = JSON.parse(JSON.stringify(sudoku)); // Создаём копию судоку
        let emptyCells = 0;

        // Рандомно удаляем значения для создания пустых клеток
        while (emptyCells < emptyCellsCount) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (sudokuCopy[row][col] !== '') {
                sudokuCopy[row][col] = '';
                emptyCells++;
            }
        }

        createGrid(sudokuCopy);
    }

    // Создание сетки
    function createGrid(sudoku) {
        gridContainer.innerHTML = '';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                
                const input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('maxlength', '1');
                
                if (sudoku[row][col]) {
                    input.value = sudoku[row][col];
                    input.setAttribute('disabled', 'true'); // Заблокировать предустановленные числа
                }

                cell.appendChild(input);
                gridContainer.appendChild(cell);
            }
        }
    }

    // Проверка правильности игры
    function checkSudoku() {
        const cells = document.querySelectorAll('#sudoku-grid input');
        const sudoku = [];
        let isValid = true;

        // Сбор значений из инпутов
        for (let i = 0; i < 9; i++) {
            sudoku[i] = [];
            for (let j = 0; j < 9; j++) {
                const value = cells[i * 9 + j].value;
                sudoku[i][j] = value ? parseInt(value, 10) : '';
            }
        }

        // Проверка строк, столбцов и блоков 3x3
        for (let i = 0; i < 9; i++) {
            if (!checkRow(sudoku, i) || !checkColumn(sudoku, i) || !checkBlock(sudoku, i)) {
                isValid = false;
                break;
            }
        }

        messageContainer.textContent = isValid ? 'Правильно!' : 'Есть ошибки, попробуйте снова!';
    }

    // Проверка строки
    function checkRow(sudoku, row) {
        const set = new Set();
        for (let i = 0; i < 9; i++) {
            const value = sudoku[row][i];
            if (value && set.has(value)) return false;
            if (value) set.add(value);
        }
        return true;
    }

    // Проверка столбца
    function checkColumn(sudoku, col) {
        const set = new Set();
        for (let i = 0; i < 9; i++) {
            const value = sudoku[i][col];
            if (value && set.has(value)) return false;
            if (value) set.add(value);
        }
        return true;
    }

    // Проверка блока 3x3
    function checkBlock(sudoku, index) {
        const set = new Set();
        const rowStart = Math.floor(index / 3) * 3;
        const colStart = (index % 3) * 3;

        for (let i = rowStart; i < rowStart + 3; i++) {
            for (let j = colStart; j < colStart + 3; j++) {
                const value = sudoku[i][j];
                if (value && set.has(value)) return false;
                if (value) set.add(value);
            }
        }
        return true;
    }

    // Сброс игры
    function resetSudoku() {
        createRandomGrid(completeSudoku, 40); // 40 скрытых ячеек
        messageContainer.textContent = '';
    }

    // Начало новой игры с рандомной генерацией
    function newGame() {
        createRandomGrid(completeSudoku, 40); // Генерация игры с 40 скрытыми ячейками
        messageContainer.textContent = '';
    }

    // Инициализация первой игры
    createRandomGrid(completeSudoku, 40); // Первоначальная генерация игры

    // Обработчики событий
    document.getElementById('check').addEventListener('click', checkSudoku);
    document.getElementById('reset').addEventListener('click', resetSudoku);
    document.getElementById('new-game').addEventListener('click', newGame);
});
