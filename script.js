
function createGameBoard() {
    const docs = document.getElementById("board");

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            let pixel = document.createElement("div");
            pixel.className = "pixel";
            pixel.setAttribute("xpos", x);
            pixel.setAttribute("ypos", y);
            docs.appendChild(pixel);
        }
    }
}

var snakeLength = 3;
var snakePos = [[0, 0], [0, 1], [0, 2]];
var headPos = [0, 2];
var direction = 2;
var prevDirection = 0;
var foodPos = [4, 4]
var score = 0;
var isGameOver = false;
var isWinning = false;

document.addEventListener("keydown", setDirection);

function move() {

    if (!isGameOver && !isWinning) {
        switch (direction) {
            case 1:
                moveUp();
                break;
            case 2:
                moveRight();
                break;
            case 3:
                moveDown();
                break;
            case 4:
                moveLeft();
                break;
            default:
                break;
        }
        let newHeadPos = headPos.slice();
        let prevPos = snakePos.slice();
        snakePos = updatePos(prevPos, newHeadPos)

        if (foodPos[1] == headPos[0] && foodPos[0] == headPos[1]) {
            eat();
        }

        doesEatTails(snakePos, headPos);
        doesWin(score);
        prevDirection = direction;
        draw();
    }
}

function updatePos(prevSnakePos, newHeadPos) {
    if (snakeLength >= prevSnakePos.length) {
        let prevPos = prevSnakePos.slice();
        let newPos = [...prevPos, newHeadPos];
        return newPos;
    } else {
        let prevPos = prevSnakePos.slice(1,)
        let newPos = [...prevPos, newHeadPos];
        return newPos;
    }
}

function play() {
    window.setInterval(move, 200)
}

function doesEatTails(currentPos, currentHeadPos) {
    let tails = currentPos.slice(0, currentPos.length - 1);
    let tailsAsString = JSON.stringify(tails);
    let headAsString = JSON.stringify(currentHeadPos);

    if (tailsAsString.includes(headAsString)) {
        isGameOver = true;
    }
}

function doesWin(score) {
    if (score == 60) {
        isWinning = true;
    }
}

function setDirection(event) {
    let key = event.keyCode;

    switch (key) {
        case 38:
            if (prevDirection != 3) {
                direction = 1;
            }
            break;
        case 39:
            if (prevDirection != 4) {
                direction = 2;
            }
            break;
        case 40:
            if (prevDirection != 1) {
                direction = 3;
            }
            break;
        case 37:
            if (prevDirection != 2) {
                direction = 4;
            }
            break;
        default:
            break;
    }
}

function spawnFood() {
    let rand1 = Math.round(Math.random() * 7);
    let rand2 = Math.round(Math.random() * 7);
    let newFoodPos = [rand2, rand1];
    let newFoodPosAsString = JSON.stringify(newFoodPos);
    let posAsString = JSON.stringify(snakePos);

    while (posAsString.includes(newFoodPosAsString)) {
        rand1 = Math.round(Math.random() * 7);
        rand2 = Math.round(Math.random() * 7);
        newFoodPos = [rand2, rand1]
        newFoodPosAsString = JSON.stringify(newFoodPos);
        posAsString = JSON.stringify(snakePos);
    }

    foodPos[0] = rand1;
    foodPos[1] = rand2;
}

function moveUp() {
    headPos[0] -= 1;
    if (headPos[0] < 0) {
        headPos[0] += 8
    }
}

function moveDown() {
    headPos[0] += 1;
    if (headPos[0] > 7) {
        headPos[0] -= 8
    }
}

function moveRight() {
    headPos[1] += 1;
    if (headPos[1] > 7) {
        headPos[1] -= 8
    }
}

function moveLeft() {
    headPos[1] -= 1;
    if (headPos[1] < 0) {
        headPos[1] += 8
    }
}

function draw() {
    let xpos = snakePos.map(pos => pos[1])
    let ypos = snakePos.map(pos => pos[0])
    let foodXpos = foodPos[0];
    let foodYpos = foodPos[1];
    let headYPos = headPos[0];
    let headXPos = headPos[1];

    const allPixel = document.getElementsByClassName("pixel");
    for (let i = 0; i < allPixel.length; i++) {
        allPixel[i].setAttribute("style", "background-color: black")
    }

    for (let i = 0; i < snakePos.length; i++) {
        const player = document.querySelector(`div[xpos="${xpos[i]}"][ypos="${ypos[i]}"]`)
        player.setAttribute("style", "background-color: #1f7a37")
    }

    const food = document.querySelector(`div[xpos="${foodXpos}"][ypos="${foodYpos}"]`)
    food.setAttribute("style", "background-color: yellow")

    const head = document.querySelector(`div[xpos="${headXPos}"][ypos="${headYPos}"]`)
    head.setAttribute("style", "background-color: #155c28")

    if (isGameOver) {
        document.getElementById("gameover").style.display = "block"
    } else {
        document.getElementById("gameover").style.display = "none"
    }

    if (isWinning) {
        document.getElementById("winning").style.display = "block"
    } else {
        document.getElementById("winning").style.display = "none"
    }

    document.getElementById("score").innerHTML = score;
}

function reload() {
    location.reload();
}

function eat() {
    console.log("eat")
    snakeLength++;
    score++;
    spawnFood();
}