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
            message = `Dropped ${player.name}'s token ${player.token}...`;
            isAvailable = true;
        } else {
            message = `This cell is already dropped a token! Please re-drop.`;
            isAvailable = false;
        }
        return message;
    }

    return {getBoard, dropToken, getIsAvailable: getIsAvailable};
}

function Cell() {
    let value = "";

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addToken, getValue}
}

function GameController(playerOneName, playerTwoName) {
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

    return {getActivePlayer, playRound, getBoard: board.getBoard};
}

function ScreenConrtroller() {
    const dialog = document.querySelector("dialog");
    const startButton = document.querySelector("#start");
    const restartButton = document.querySelector("#restart");
    const cancelBtn = document.querySelector("#cancel_btn");
    const playBtn = document.querySelector("#play_btn");
    const turnDiv = document.querySelector(".turn");
    const messageDiv = document.querySelector(".message");
    const boardDiv = document.querySelector(".board");
    let player1Name = document.querySelector("#player1").value;
    let player2Name = document.querySelector("#player2").value;
    let game = GameController("Player 1", "Player 2");
    startButton.addEventListener("click", () => dialog.showModal());
    cancelBtn.addEventListener("click", () => dialog.close());

    function playClickHandler(event) {
        event.preventDefault();
        messageDiv.innerHTML = "&nbsp";
        player1Name = document.querySelector("#player1").value;
        player2Name = document.querySelector("#player2").value;
        if (player1Name === "" || player2Name === "") {
            alert("Fields must be filled out");
            return;
        }
        dialog.close();
        game = GameController(player1Name, player2Name);
        updateScreen();
        return;
    }

    playBtn.addEventListener("click", playClickHandler);

    function restartClickHandler() {
        messageDiv.innerHTML = "&nbsp";
        game = GameController(player1Name, player2Name);
        updateScreen();
    }

    restartButton.addEventListener("click", restartClickHandler)

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        if (activePlayer.name !== "") {
            turnDiv.textContent = `${activePlayer.token} It's ${activePlayer.name}'s turn...`
        }
        

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

    dialog.showModal();
    updateScreen();
}

ScreenConrtroller();

