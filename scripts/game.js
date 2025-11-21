const gameMenu = document.getElementById("game-menu")
const gameContainer = document.getElementById("game")
const startGameButton = document.getElementById("start-game-button")
const pokeballOpening = document.getElementById("pokeball-opening")

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
    setImageVisibility(gameMenu, false)
    startRound()
    setTimeout(() => {
        endGame()
    }, 30000)
}


function startRound() {
    shuffle(trainerImages)
    const pokemon = pokemonImages[Math.floor(Math.random() * NUM_POKEMONS)]

    const srcs = trainerImages.slice(0, NUM_DISPLAYED - 1)
    srcs.push(pokemon)

    loadImages(imageNodes, srcs, () => {
        for (let i = 0; i < NUM_DISPLAYED; i++) {
            setImageVisibility(imageNodes[i], true)
            animateCurveMove(imageNodes[i])
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
        pokemonFound()
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


function generateRandomPosition() {
    let top = Math.floor(
        Math.random() * (window.innerHeight - SAFE_MARGIN - IMG_SIZE)
    ) + SAFE_MARGIN
    let left = Math.floor(
        Math.random() * (window.innerWidth - SAFE_MARGIN - IMG_SIZE)
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


function animateCurveMove(img) {
    setImageVisibility(pokeballOpening, true)

    const oldTop = (window.innerHeight * 80)/100
    const oldLeft = window.innerWidth/2 - IMG_SIZE/2
    img.style.top = `${oldTop}px`
    img.style.left = `${oldLeft}px`

    let position = generateRandomPosition()
    const newTop = position.top
    const newLeft = position.left

    const dx = newLeft - oldLeft;
    const dy = newTop - oldTop;

    const cx = dx * 0.5 + (-dy * 0.3);
    // const cy = dy * 0.5 + ( dx * 0.3);
    // const cx = 0
    const cy = -window.innerHeight * 0.3 + dx * dx * 0.0005 - 300 * Math.random() 

    img.style.setProperty("--cx", `${cx}px`);
    img.style.setProperty("--cy", `${cy}px`);
    img.style.setProperty("--ex", `${dx}px`);
    img.style.setProperty("--ey", `${dy}px`);

    img.style.animation = "none";
    void img.offsetWidth;
    img.style.animation = "curve 1s linear forwards";

    img.onanimationend = () => {
        img.style.animation = "none";
        img.style.left = `${newLeft}px`;
        img.style.top = `${newTop}px`;
        setImageVisibility(pokeballOpening, false)
    };
}


function pokemonFound() {
    for (let i = 0; i < imageNodes.length; i++) {
        setImageVisibility(imageNodes[i], false)
    }
    startRound()
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function endGame() {
    for (let i = 0; i < imageNodes.length; i++) {
        setImageVisibility(imageNodes[i], false)
    }
    setImageVisibility(pokeballOpening, false)
    setImageVisibility(gameMenu, true)
}