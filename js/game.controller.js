import { gameService } from './services/game.service.js'

window.onload = onInit

function onInit() {
    gameService.gameplay()
}

// document.querySelector('body').addEventListener('load', gameplay)