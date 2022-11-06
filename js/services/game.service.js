import utils from './util.service.js'
import gameState from '../../data/gameRecord.json' assert {type: 'json'}
import {botService} from './bot.service.js'
export const gameService = {
    makePlayerTurn,
    createBoard,
    checkWin,
    checkEndGame,
    gameplay,
    getupdatedBoard
}

let isGameFinished
let gameBoard

function gameplay() {
    let turn
    gameBoard = createBoard()
    _render(gameBoard)

    while (!isGameFinished || turn === 'exit') {
        if (!gameBoard && gameState.movesCount === 0) gameBoard = createBoard()
        else if (!gameBoard && gameState.movesCount > 0) gameBoard = gameState.prevMoves.at(-1)

        turn = prompt('make a move on the board!')
        gameBoard = makePlayerTurn(turn, gameBoard)
        isGameFinished = checkIsGameFinished()

        if (gameBoard && !isGameFinished) {
            _render(gameBoard)
            gameBoard = botService.makeBotTurn(gameBoard)
            _render(gameBoard)
            isGameFinished = checkIsGameFinished()
        }
        
    }
    _render(gameBoard)
}

function checkIsGameFinished(){
    return gameState.isEndGame || gameState.isGameWon
}
//? Function checks if the contestant (obj with data from either bot or player)
//? has won the game. Meant to be checked after every turn, or rather after there are 5 or more movesCount
function checkWin(board, contestant) {
    let {movesCount, isGameWon} = gameState
    if (movesCount < 5) return
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
        if (secDiagCount === 3 || mainDiagCount === 3) return isGameWon = true
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
        if (rowCount === 3 || colCount === 3) return isGameWon = true
        else {
            rowCount = 0
            colCount = 0
        }
    }
}

function checkEndGame() {
    let {movesCount, isEndGame} = gameState
    return movesCount === 9 ? isEndGame = true : isEndGame = false
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
        const updatedBoard = getupdatedBoard(posI, posJ, gameState.playerSign, board)

        gameState.prevMoves.push(updatedBoard)
        gameState.lastPlayerMove.i = posI
        gameState.lastPlayerMove.j = posJ
        gameState.movesCount++

            checkEndGame()
        checkWin(updatedBoard, { markSign: gameState.playerSign })
        gameState.isPlayerTurn = false
        return updatedBoard
    }
}

function getupdatedBoard(num1, num2, markSign, board) {
    let updatedBoard = JSON.parse(JSON.stringify(board))
    updatedBoard[num1][num2].isMarked = true
    updatedBoard[num1][num2].markingSign = markSign
    return updatedBoard
}