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

    let flag = 0;
    const getFlag = () => flag;

    const dropToken = (row, column, player) => {
        if (board[row][column].getValue() === 0) {
            board[row][column].addToken(player.token);
            console.log(`Dropping ${player.name}'s token into ${row}/${column} cell...`);
        } else {
            console.log(`This cell is already dropped a token! Please re-drop.`);
            flag = 1;
            return;
        }
    }

    const render = () => {
        const renderCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(renderCellValues);
    }

    return {getBoard, dropToken, render, getFlag};
}

function Cell() {
    let value = 0;

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
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ]

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const printNewRound = () => {
        board.render();
        console.log(`It's ${getActivePlayer().name}'s turn.`);
    }

    const rows = board.length;
    const columns = board.length;

    const checkRows = (board) => {
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < columns; j++) {
                row.push(board[i][j]);    
            }
            if (row.every(element => element === 1) || row.every(element => element === 2)) {
                return true;
            }
        }
        return false;
    }

    const checkColumns = (board) => {
        for (let j = 0; j < columns; j++) {
            let column = [];
            for (let i = 0; i < rows; i++) {
                column.push(board[i][j]);    
            }
            if (column.every(element => element === 1) || column.every(element => element === 2)) {
                return true;
            }
        }
        return false;
    }

    const checkDiagnols = (board) => {
        let diagnol1 = [];
        let diagnol2 = [];
        for (let i = 0; i < rows; i++) {
            diagnol1.push(board[i][i]);  
        }
        for (let i = 0; i < rows; i++) {
            for (let j = columns.length - 1; j < 0; j++) {
                diagnol2.push(board[i][j]);
            }
        }
        if (diagnol1.every(element => element === 1) 
            || diagnol1.every(element => element === 2) 
            || diagnol2.every(element => element === 1) 
            || diagnol2.every(element => element === 2)) {
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
        if (checkWin(board)) {
                return false;
        }
        board.forEach(row => {
            row.forEach(cell => {
                cell.getValue === 0;
                return false;
            })
        });
        return true;
    }

    const playRound = (row, column) => {
        board.dropToken(row, column, getActivePlayer());
        
        if (board.getFlag() === 0) {
            switchPlayerTurn();
            printNewRound();
        } else if (board.getFlag() === 0 && checkWin(board)) {
            console.log(`${getActivePlayer().name} wins!`);
        } else if (board.getFlag() === 0 && checkDraws(board)) {
            console.log(`It's a tie.`)
        }
    }

    printNewRound();

    return {getActivePlayer, playRound};
}

const game = GameController();

