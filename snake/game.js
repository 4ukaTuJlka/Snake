
let score = 0;
let bestScore = 0;
let needSaveScore = true;

const config = {
    step: 0,
    maxStep: 6,
    sizeCell: 16,
    sizeBerry: 16 / 4
}

const snake = {
    x: 160,
    y: 160,
    dx: config.sizeCell,
    dy: 0,
    tails: [],
    maxTails: 3
}

let berry = {
    x: 0,
    y: 0
}


let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
let scoreBlock = document.querySelector(".game-score .score-count");
let bestScoreBlock = document.querySelector(".game-best .best-score");
drawScore();




// Проверит можно ли сохранять результат в localStorage
if (typeof localStorage === 'undefined') {
    needSaveScore = false;
    alert("Невозможно сохранять результат. localStorage отключен!");
}else{
    needSaveScore = true;
    saveBestScore(); // сохраням bestScore в localStorage, чтобы было из чего читать
}




function gameLoop() {

    requestAnimationFrame(gameLoop);
    if (++config.step < config.maxStep) {
        return;
    }
    config.step = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBerry();
    drawSnake();
}
requestAnimationFrame(gameLoop);

function drawSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;

    collisionBorder();

    snake.tails.unshift({ x: snake.x, y: snake.y });

    if (snake.tails.length > snake.maxTails) {
        snake.tails.pop();
    }

    snake.tails.forEach(function (el, index) {
        if (index == 0) {
            context.fillStyle = "#5A9800";
        } else {
            context.fillStyle = "#8BEA00";
        }
        context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

        if (el.x === berry.x && el.y === berry.y) {
            snake.maxTails++;
            incScore();
            randomPositionBerry();
        }


        for (let i = index + 1; i < snake.tails.length; i++) {

            if (el.x == snake.tails[i].x && el.y == snake.tails[i].y) {
                refreshGame();
            }

        }

    });
}

function collisionBorder() {
    if (snake.x < 0) {
        snake.x = canvas.width - config.sizeCell;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - config.sizeCell;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
}

function refreshGame() {

    //Перед рестартом игры проверит результат игры
    checkBestScore();
      
    score = 0;
    drawScore();

    snake.x = 160;
    snake.y = 160;
    snake.tails = [];
    snake.maxTails = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry();
}

function drawBerry() {
    context.beginPath();
    context.fillStyle = "red";
    context.arc(berry.x + (config.sizeCell / 2), berry.y + (config.sizeCell / 2), config.sizeBerry, 0, 2 * Math.PI);
    context.fill();
}

function randomPositionBerry() {
    berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
    berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
}

function incScore() {
    score++;
    drawScore();
}

function drawScore() {
    scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

document.addEventListener("keydown", function (e) {
    if (e.code == "ArrowUp") {
        snake.dy = -config.sizeCell;
        snake.dx = 0;
    } else if (e.code == "ArrowLeft") {
        snake.dx = -config.sizeCell;
        snake.dy = 0;
    } else if (e.code == "ArrowDown") {
        snake.dy = config.sizeCell;
        snake.dx = 0;
    } else if (e.code == "ArrowRight") {
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }
});





// Отобразит текст лучшего результата
function drawBestScore() {
    bestScoreBlock.innerHTML = bestScore;
}

// Проверит нужно ли сохранять результат и отобразит его
function checkBestScore() {
    bestScore = getBestScore();

    if (score > bestScore) {
        saveBestScore();
        drawBestScore();
    }
}

// Сохраняет лучший результат в localStorage, если это возможно
function saveBestScore() {
    bestScore = score;

    if(needSaveScore){
        localStorage.setItem('bestScore', bestScore);
    }
}

// Возвращает лучший результат из localStorage, если это возможно, иначе вернет score
function getBestScore() {
    if(needSaveScore){
        var data = localStorage.getItem('bestScore');
        return data;
    }

    return score;
}