import { gameService } from './services/game.servicetest.js'

window.onload = onInit

function onInit() {
    gameService.gameplay()
}

// document.querySelector('body').addEventListener('load', gameplay)