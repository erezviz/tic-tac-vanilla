import utils from '../util.service.js'
import data from '../../data/gameRecord.json' assert {type: 'json'}

export const gameService = {
    makePlayerTurn,
    makeBotTurn,
    createBoard,
    checkWin,
    checkEndGame,
    gameplay,
    getGameRec,
    getRandomIntInc
}
    //MUST THIS IS THE GAME STATE
let gameRec = {
    playerSign: 'O',
    botSign: 'X',
    prevMoves: [],
    lastPlayerMove: { i: null, j: null },
    isPlayerTurn: true,
    movesCount: 0,
    botLevel: 'EASY',
    isEndGame: false,
    isGameWon: false
}

let isGameFinished
let gameBoard

function getGameRec() {
    return gameRec
}

function gameplay() {
    let turn
    gameBoard = createBoard()
    _render(gameBoard)
    
    
    while (!isGameFinished || turn === 'exit') {
        if (!gameBoard && gameRec.movesCount === 0) gameBoard = createBoard()
        else if (!gameBoard && gameRec.movesCount > 0) gameBoard = gameRec.prevMoves.at(-1)

        turn = prompt('make a move on the board!')
        gameBoard = makePlayerTurn(turn, gameBoard)
        isGameFinished = gameRec.isEndGame || gameRec.isGameWon

        if (gameBoard && !isGameFinished) {
            _render(gameBoard)
            gameBoard = makeBotTurn(gameBoard)
            _render(gameBoard)
            isGameFinished = gameRec.isEndGame || gameRec.isGameWon
        }
        
    }
    _render(gameBoard)
}
//? Function checks if the contestant (obj with data from either bot or player)
//? has won the game. Meant to be checked after every turn, or rather after there are 5 or more movesCount
function checkWin(board, contestant) {
    if (gameRec.movesCount < 5) return
    let mainDiagCount = 0
    let secDiagCount = 0
    let rowCount = 0
    let colCount = 0

    for (let i = 0; i < board.length; i++) {
        //? Counting the diagonals:
        if (board[i][board.length - 1 - i].isMarked &&
            board[i][board.length - 1 - i].markingSign === contestant.markSign) {
            secDiagCount++
        }
       
        if (board[i][i].isMarked && board[i][i].markingSign === contestant.markSign) {
            mainDiagCount++
        }
        //? Checking the diagonals, before the second for loop,
        //? if one of the diagonals is complete with same sign, there's no need for further iterations, return true
        if (secDiagCount === 3 || mainDiagCount === 3) return gameRec.isGameWon = true
            //? Entering second for loop:
        for (let j = 0; j < board.length; j++) {
            //? Counting the rows and columns:
            if (board[i][j].isMarked && board[i][j].markingSign === contestant.markSign) {
                rowCount++
            }
            if (board[j][i].isMarked && board[j][i].markingSign === contestant.markSign) {
                colCount++
            }
        }
        //? Checking the rows and columns, else statement is to restart the count for the next iteration
        if (rowCount === 3 || colCount === 3) return gameRec.isGameWon = true
        else {
            rowCount = 0
            colCount = 0
        }
    }
}

function checkEndGame() {
    return gameRec.movesCount === 9 ? gameRec.isEndGame = true : gameRec.isEndGame = false
}

function _render(board) {
    let renderedBoard = []
    board.forEach((row, idxI) => {
        renderedBoard.push([])
        row.forEach((cell, idxJ) => {
            renderedBoard[idxI][idxJ] = cell.markingSign
        })
    })
    console.table(renderedBoard)
}

function createBoard() {
    let board = []
    for (let i = 0; i < 3; i++) {
        board.push([])
        for (let j = 0; j < 3; j++) {
            board[i][j] = {
                isMarked: false,
                markingSign: '',
                position: { i, j }
            }
        }
    }
    return board
}

function makePlayerTurn(strNum, board) {
    if (!strNum) return null

    if (strNum.length > 2 || strNum.length < 2) {
        alert('Invalid entry, valid entries are "01","02", etc.')
        return null
    } else if (isNaN(strNum)) {
        alert('ivalid entry, only numbers (between 0-2) are valid.')
        return null
    } else if (+strNum < 0 || +strNum.charAt(0) > 2 || +strNum.charAt(1) > 2) {
        alert('The numbers are not in range. Please select numbers between 0-2.')
        return null
    } else {
        const posI = +strNum.charAt(0)
        const posJ = +strNum.charAt(1)
        if (board[posI][posJ].isMarked) {
            alert('This square is already marked! pick another')
            return null
        }
        const updatedBoard = _getupdatedBoard(posI, posJ, gameRec.playerSign, board)

        gameRec.prevMoves.push(updatedBoard)
        gameRec.lastPlayerMove.i = posI
        gameRec.lastPlayerMove.j = posJ
        gameRec.movesCount++

            checkEndGame()
        checkWin(updatedBoard, { markSign: gameRec.playerSign })
        gameRec.isPlayerTurn = false
        return updatedBoard
    }
}

function _getupdatedBoard(num1, num2, markSign, board) {
    let updatedBoard = JSON.parse(JSON.stringify(board))
    updatedBoard[num1][num2].isMarked = true
    updatedBoard[num1][num2].markingSign = markSign
    return updatedBoard

    // return board.map((row, idxI) => {
    //     return row.map((cell, idxJ) => {
    //         if (num1 === idxI && num2 === idxJ) {
    //             cell.isMarked = true
    //             cell.markingSign = markSign
    //         }
    //         return cell
    //     })
    // })
}

function makeBotTurn(board) {
    let { isPlayerTurn, lastPlayerMove, botLevel } = gameRec

    if (isPlayerTurn) return
    switch (botLevel) {
        case 'EASY':
            return _easyBotMove(board)
        case 'MEDIUM':

            break
        case 'HARD':

            break
    }
}

function _easyBotMove(board) {

    let successfulMove = false
    let updatedBoard
    while (!successfulMove) {
        const idx1 = getRandomIntInc(0, 2)
        const idx2 = getRandomIntInc(0, 2)
        if (!board[idx1][idx2].isMarked) {
            updatedBoard = _getupdatedBoard(idx1, idx2, gameRec.botSign, board)

            successfulMove = true
            gameRec.prevMoves.push(updatedBoard)
            gameRec.movesCount++
                gameRec.isPlayerTurn = true
        }
    }
    //? RENDER IS HERE FOR DEV ONLY! MOVE THIS FUNCTION OUT WHEN READY FOR PROD
    // render(updatedBoard)
    checkEndGame()
    checkWin(updatedBoard, { markSign: gameRec.botSign })
    return updatedBoard
}

function getRandomIntInc(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}