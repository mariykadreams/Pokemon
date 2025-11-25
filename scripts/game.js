const gameMenu = document.getElementById("game-menu")
const gameContainer = document.getElementById("game")
const startGameButton = document.getElementById("start-game-button")
const pokeballOpening = document.getElementById("pokeball-opening")
const timer = document.getElementById("timer")

const GAME_DURATION = 20 * 1000 // milliseconds
let startTime = null
const NUM_TRAINERS = 401
const NUM_POKEMONS = 401
const NUM_DISPLAYED = 300

const IMG_SIZE = 70
const SAFE_MARGIN = 70
const START_POSITION_TOP = (window.innerHeight * 80)/100
const START_POSITION_LEFT = window.innerWidth/2 - IMG_SIZE/2

const trainerImages = []
const pokemonImages = []
const imageNodes = []


for (let i = 0; i < NUM_TRAINERS; i++) {
    trainerImages.push("../images/trainers/" + i + ".png")
}
for (let i = 0; i < NUM_POKEMONS; i++) {
    pokemonImages.push("../images/pokemon_svg/" + i + ".svg")
}
createElements(imageNodes, NUM_DISPLAYED)


startGameButton.onclick = () => {
    startGame()
}


function startGame() {
    setImageVisibility(gameMenu, false)
    setImageVisibility(timer, true)
    startRound()
    startCountdown()
}


function startCountdown() {
    startTime = performance.now()
    updateCountdown(startTime)
    requestAnimationFrame(updateCountdown)
}


function updateCountdown(timestamp) {
    const elapsed = timestamp - startTime
    const remaining = Math.max(0, GAME_DURATION - elapsed)

    document.getElementById("timer").innerHTML = Math.round(remaining / 100) / 10

    if (remaining > 0) {
        requestAnimationFrame(updateCountdown)
    } else {
        endGame()
    }
}

function startRound() {
    shuffle(trainerImages)
    const pokemon = pokemonImages[Math.floor(Math.random() * NUM_POKEMONS)]

    const srcs = trainerImages.slice(0, NUM_DISPLAYED - 1)
    srcs.push(pokemon)

    loadImages(imageNodes, srcs, () => {
        setImageVisibility(pokeballOpening, true)
        for (let i = 0; i < NUM_DISPLAYED; i++) {
            setImageVisibility(imageNodes[i], true)
            animateCurveMove(imageNodes[i])
        }
    })
}


function endGame() {
    for (let i = 0; i < imageNodes.length; i++) {
        setImageVisibility(imageNodes[i], false)
    }
    setImageVisibility(pokeballOpening, false)
    setImageVisibility(timer, false)
    setImageVisibility(gameMenu, true)
}


function createElements(elements, n) {
    for (let i = 0; i < n - 1; i++) {
        let trainer = document.createElement("img")
        setImageAttributes(trainer)
        gameContainer.appendChild(trainer)
        elements.push(trainer)
    }

    let pok = document.createElement("img")
    setImageAttributes(pok)
    pok.style.zIndex = 1000
    pok.onclick = () => {
        pokemonFound()
    }
    gameContainer.appendChild(pok)
    elements.push(pok)
}


function setImageAttributes(img) {
    img.width = IMG_SIZE
    img.height = IMG_SIZE
    img.style.position = "absolute"
    setImageVisibility(img, false)
    setImageRandomPosition(img)
}


function generateRandomPosition() {
    let top = Math.floor(
        Math.random() * (window.innerHeight - SAFE_MARGIN * 2 - IMG_SIZE)
    ) + SAFE_MARGIN
    let left = Math.floor(
        Math.random() * (window.innerWidth - SAFE_MARGIN * 2 - IMG_SIZE)
    ) + SAFE_MARGIN
    return {
        top,
        left
    }
}


function setImageRandomPosition(img) {
    position = generateRandomPosition()
    img.style.top = `${position.top}px`
    img.style.left = `${position.left}px`
}


function loadImages(nodes, srcs, callback) {
    let remaining = nodes.length
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].onload = () => {
            remaining--
            if (remaining === 0) callback()
        }
        nodes[i].src = srcs[i]
    }
}


function setImageVisibility(img, visible) {
    img.style.display = visible ? "block" : "none"
}


function animateCurveMove(img) {
    img.style.top = `${START_POSITION_TOP}px`
    img.style.left = `${START_POSITION_LEFT}px`

    let position = generateRandomPosition()
    const newTop = position.top
    const newLeft = position.left

    const dx = newLeft - START_POSITION_LEFT
    const dy = newTop - START_POSITION_TOP

    const cx = dx * 0.5 + (-dy * 0.3)
    const cy = -window.innerHeight * 0.3 + dx * dx * 0.0005 - 300 * Math.random() 

    img.style.setProperty("--cx", `${cx}px`)
    img.style.setProperty("--cy", `${cy}px`)
    img.style.setProperty("--ex", `${dx}px`)
    img.style.setProperty("--ey", `${dy}px`)

    img.style.animation = "none"
    void img.offsetWidth
    img.style.animation = "curve 1s linear forwards"

    img.onanimationend = () => {
        img.style.animation = "none"
        img.style.left = `${newLeft}px`
        img.style.top = `${newTop}px`
        setImageVisibility(pokeballOpening, false)
    }
}


function pokemonFound() {
    for (let i = 0; i < imageNodes.length; i++) {
        setImageVisibility(imageNodes[i], false)
    }
    startRound()
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}