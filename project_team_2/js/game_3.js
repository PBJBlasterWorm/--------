
const BLOCKS = {                // 테트리스 블럭

    square: [
        [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
        ],
        [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
        ],
        [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
        ],
        [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
        ],
    ],
    bar: [
        [
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
        ],
        [
            [2, -1],
            [2, 0],
            [2, 1],
            [2, 2],
        ],
        [
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
        ],
        [
            [2, -1],
            [2, 0],
            [2, 1],
            [2, 2],
        ],
    ],
    tree: [
        [
            [1, 0],
            [0, 1],
            [1, 1],
            [2, 1],
        ],
        [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, 2],
        ],
        [
            [2, 1],
            [0, 1],
            [1, 1],
            [1, 2],
        ],
        [
            [2, 1],
            [1, 2],
            [1, 1],
            [1, 0],
        ],
    ],
    z: [
        [
            [0, 0],
            [1, 0],
            [1, 1],
            [2, 1],
        ],
        [
            [0, 1],
            [1, 0],
            [1, 1],
            [0, 2],
        ],
        [
            [0, 0],
            [1, 0],
            [1, 1],
            [2, 1],
        ],
        [
            [0, 1],
            [1, 0],
            [1, 1],
            [0, 2],
        ],
    ],
    rz: [
        [
            [2, 0],
            [1, 0],
            [1, 1],
            [0, 1],
        ],
        [
            [1, 0],
            [1, 1],
            [2, 1],
            [2, 2],
        ],
        [
            [2, 0],
            [1, 0],
            [1, 1],
            [0, 1],
        ],
        [
            [1, 0],
            [1, 1],
            [2, 1],
            [2, 2],
        ],
    ],
    elleft: [
        [
            [0, 0],
            [1, 0],
            [0, 1],
            [0, 2],
        ],
        [
            [0, 1],
            [0, 2],
            [1, 2],
            [2, 2],
        ],
        [
            [1, 2],
            [2, 2],
            [2, 1],
            [2, 0],
        ],
        [
            [2, 1],
            [2, 0],
            [1, 0],
            [0, 0],
        ],
    ],
    elright: [
        [
            [0, 0],
            [1, 0],
            [1, 1],
            [1, 2],
        ],
        [
            [0, 2],
            [0, 1],
            [1, 1],
            [2, 1],
        ],
        [
            [2, 2],
            [1, 2],
            [1, 1],
            [1, 0],
        ],
        [
            [2, 0],
            [2, 1],
            [1, 1],
            [0, 1],
        ],
    ]
}


// DOM

const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoredisplay = document.querySelector(".score");
const restartButton = document.querySelector(".RestartBtn");
const backButton = document.querySelector(".BackBtn");


// Setting

const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables

let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;



const MovingItem = {
    type: "",
    direction: 3,                                   // 화살표 위방향 기준 좌우돌리는 지표
    top: 0,                                                 //좌표 기준 어디까지 내려가는지 표현
    left: 0,                                                    //좌표 기준 좌우값을 알려줌
};

init()

// functions
function init() {
    tempMovingItem = { ...MovingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine()
    }
    generateNewBlock()
}

function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)
}

function renderBlocks(moveType = "") {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");                                                                                // 블록 이동시 중복안되게 제거
    })
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;                                                                                                  // left만큼 오른쪽으로 이동
        const y = block[1] + top;                                                                                                   // top만큼 아래로 이동
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, "moving")
        }

        else {
            tempMovingItem = { ...MovingItem }
            if (moveType === 'retry') {
                clearInterval(downInterval)
                showGameoverText()
            }
            setTimeout(() => {
                renderBlocks('retry')
                if (moveType === "top") {
                    seizeBlock();
                }
            }, 0)
            return true;
        }
    })
    MovingItem.left = left;
    MovingItem.top = top;
    MovingItem.direction = direction;
}

function seizeBlock() {
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}


function checkMatch() {
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if (!li.classList.contains("seized")) {
                matched = false;
            }
        })
        if (matched) {
            child.remove();
            prependNewLine();
            score++;
            scoredisplay.innerText = score;
        }
    })
    generateNewBlock()
}

function generateNewBlock() {

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1)
    }, duration)

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)

    MovingItem.type = blockArray[randomIndex][0]
    MovingItem.top = 0;
    MovingItem.left = 3;
    MovingItem.direction = 0;
    tempMovingItem = { ...MovingItem };
    renderBlocks()
}


function checkEmpty(target) {
    if (!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}

function changedirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks()
}

function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1)
    }, 10)
}

function showGameoverText() {
    gameText.style.display = "flex"
}

//event handling

document.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 39: // right key = 키코드 39
            moveBlock("left", 1);
            break;

        case 37: // left key = 키코드 37
            moveBlock("left", -1);
            break;

        case 40: // down key = 키코드 40
            moveBlock("top", 1);
            break;

        case 38: // up key = 키코드 38
            changedirection();
            break;

        case 32: // spacebar = 키코드 32
            dropBlock()
            break;

        default:
            break;
    }
})

restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    gameText.style.display = "none"
    init();
})

// backButton.addEventListener("click", () => {
//     window.history.back()
// })