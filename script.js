function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());        
        }
    }

    const getBoard = () => board;

    let isAvailable = true;
    const getIsAvailable = () => isAvailable;

    const dropToken = (row, column, player) => {
        let message = "";
        if (board[row][column].getValue() === "") {
            board[row][column].addToken(player.token);
            message = `Dropping ${player.name}'s token...`;
            isAvailable = true;
        } else {
            message = `This cell is already dropped a token! Please re-drop.`;
            isAvailable = false;
        }
        return message;
    }

    const render = () => {
        const renderCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    }

    return {getBoard, dropToken, render, getIsAvailable: getIsAvailable};
}

function Cell() {
    let value = "";

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addToken, getValue}
}

function GameController(playerOneName = "P1", playerTwoName = "P2") {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: "O"
        },
        {
            name: playerTwoName,
            token: "X"
        }
    ]

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const printNewRound = () => {
        board.render();
    }

    const rows = 3;
    const columns = 3;

    const checkRows = (board) => {
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < columns; j++) {
                row.push(board[i][j].getValue());    
            }
            if (row.every(element => element === "O") || row.every(element => element === "X")) {
                return true;
            }
        }
        return false;
    }

    const checkColumns = (board) => {
        for (let j = 0; j < columns; j++) {
            let column = [];
            for (let i = 0; i < rows; i++) {
                column.push(board[i][j].getValue());    
            }
            if (column.every(element => element === "O") || column.every(element => element === "X")) {
                return true;
            }
        }
        return false;
    }

    const checkDiagnols = (board) => {
        let diagnol1 = [];
        let diagnol2 = [];
        for (let i = 0; i < rows; i++) {
            diagnol1.push(board[i][i].getValue());  
        }
        for (let i = 0; i < rows; i++) {
            diagnol2.push(board[i][rows - i - 1].getValue());
        }
        if (diagnol1.every(element => element === "O") 
            || diagnol1.every(element => element === "X") 
            || diagnol2.every(element => element === "O") 
            || diagnol2.every(element => element === "X")) {
            return true;
        }
        return false;
    }

    const checkWin = (board) => {
        if (checkRows(board) || checkColumns(board) || checkDiagnols(board)) {
            return true;
        } else {
            return false;            
        }
    }

    const checkDraws = (board) => {
        let isDraw = true;
        board.forEach(row => {
            row.forEach(cell => {
                if (cell.getValue() === "") {
                    isDraw = false;
                    return isDraw;
                }
            })
        })
        return isDraw;
    }

    const playRound = (row, column) => {
        let message = "";
        message = board.dropToken(row, column, getActivePlayer());

        if (board.getIsAvailable() === true) {            
            if (checkWin(board.getBoard())) {
                message = `${getActivePlayer().name} wins!`;
            } else if (checkDraws(board.getBoard())) {
                message = `It's a draw.`;   
            } else {
                switchPlayerTurn();
            }
        }
        return message;
    }

    printNewRound();

    return {getActivePlayer, playRound, getBoard: board.getBoard};
}

function ScreenConrtroller() {
    const game = GameController();
    const turnDiv = document.querySelector(".turn");
    const messageDiv = document.querySelector(".message");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer().name;

        turnDiv.textContent = `${activePlayer}'s turn...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function boardClickHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) {
            return;
        }

        messageDiv.textContent = game.playRound(selectedRow, selectedColumn); 
        updateScreen();
    }

    boardDiv.addEventListener("click", boardClickHandler);

    updateScreen();
}

ScreenConrtroller();

