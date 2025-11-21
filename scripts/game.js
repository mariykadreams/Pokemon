const gameMenu = document.getElementById("game-menu")
const gameContainer = document.getElementById("game")
const startGameButton = document.getElementById("start-game-button")

const GAME_DURATION = 25;
const NUM_TRAINERS = 401;
const NUM_POKEMONS = 401;
const NUM_DISPLAYED = 300;

const IMG_SIZE = 70;
const SAFE_MARGIN = 60;

const trainerImages = []
const pokemonImages = []
let imageNodes = []


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
    gameMenu.style.display = "none"
    // TODO
    startRound()
}


function startRound() {
    shuffle(trainerImages)
    const pokemon = pokemonImages[Math.floor(Math.random() * NUM_POKEMONS)]

    const srcs = trainerImages.slice(0, NUM_DISPLAYED - 1)
    srcs.push(pokemon)

    loadImages(imageNodes, srcs, () => {
        for (let i = 0; i < NUM_DISPLAYED; i++) {
            setImageVisibility(imageNodes[i], true)
            setImageRandomPosition(imageNodes[i])
        }
    })
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
        pokemonFound(elements)
    }
    gameContainer.appendChild(pok)
    elements.push(pok)
}


function setImageAttributes(img) {
    img.width = 70
    img.height = 70
    img.style.position = "absolute"
    setImageVisibility(img, false)
    setImageRandomPosition(img)
}


function setImageRandomPosition(img) {
    let top = Math.floor(
        Math.random() * (window.innerHeight - SAFE_MARGIN - IMG_SIZE)
    ) + SAFE_MARGIN
    let left = Math.floor(
        Math.random() * (window.innerWidth - SAFE_MARGIN - IMG_SIZE)
    ) + SAFE_MARGIN
    img.style.top = `${top}px`
    img.style.left = `${left}px`
}


function setImageStartPosition(img) {
    img.style.top = `${(window.innerHeight * 80)/100}px`
    img.style.left = `${window.innerWidth/2 - IMG_SIZE/2}px`
}


function loadImages(nodes, srcs, callback) {
    let remaining = nodes.length;
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].onload = () => {
            remaining--;
            if (remaining === 0) callback();
        };
        nodes[i].src = srcs[i];
    }
}


function setImageVisibility(img, visible) {
    img.style.display = visible ? "block" : "none"
}


function pokemonFound(elements) {
    gameMenu.style.display = "block"
    for (let i = 0; i < elements.length; i++) {
        setImageVisibility(elements[i], false)
        setImageStartPosition(elements[i])
    }
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}