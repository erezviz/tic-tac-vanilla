import gameState from '../../data/gameRecord.json' assert {type: 'json'}
import {gameService} from './game.service.js'
import utils from './util.service.js'
export const botService = {
    makeBotTurn
}

function makeBotTurn(board) {
    let { isPlayerTurn, lastPlayerMove, botLevel } = gameState

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
        const idx1 = utils.getRandomIntInc(0, 2)
        const idx2 = utils.getRandomIntInc(0, 2)
        if (!board[idx1][idx2].isMarked) {
            updatedBoard = gameService.getupdatedBoard(idx1, idx2, gameState.botSign, board)

            successfulMove = true
            gameState.prevMoves.push(updatedBoard)
            gameState.movesCount++
            gameState.isPlayerTurn = true
        }
    }
    gameService.checkEndGame()
    gameService.checkWin(updatedBoard, { markSign: gameState.botSign })
    return updatedBoard
}

function medBotMove(board) {
    if(gameState.movesCount === 1){

    }
}

