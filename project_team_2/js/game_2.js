const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "forestgreen";
const paddle1Color = "lightblue";
const paddle2Color = "red";
const paddleBorder = "black";
const ballColor = "yellow";
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 50;
const scoreToWin = 11; 

const gameMessage = document.querySelector("#gameMessage");

let intervalID;
let ballSpeed;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 200
};
let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 300
};

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", () => {
    resetBtn.style.display = 'none'; // 재시작 버튼 감추기
    gameStart();
    resetGame() // 게임 다시 시작
});
backBtn.addEventListener("click", () => {
    window.history.back();
});

gameStart();

function gameStart(){
    createBall();
    nextTick();
};
function nextTick() {
    intervalID = setTimeout(() => {
        clearBoard();
        drawPaddles();
        drawScore();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        displayGameMessage(); // 수정된 부분
        nextTick();
    }, 10);
}
function clearBoard() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    
}
function drawPaddles(){
    ctx.strokeStyle = paddleBorder;

    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    dorder = 1;
    

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    
};
function createBall(){
    ballSpeed = 1;
    if(Math.round(Math.random()) == 1){
        ballXDirection =  1; 
    }
    else{
        ballXDirection = -1; 
    }
    if(Math.round(Math.random()) == 1){
        ballYDirection = Math.random() * 1; //more random directions
    }
    else{
        ballYDirection = Math.random() * -1; //more random directions
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);
};
function moveBall(){
    ballX += (ballSpeed * ballXDirection);
    ballY += (ballSpeed * ballYDirection);
};
function drawBall(ballX, ballY) {
    ctx.fillStyle = ballColor;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fill();
}
function checkCollision(){ //공 움직이는거
    if(ballY <= 0 + ballRadius){
        ballYDirection *= -1;
    }
    if(ballY >= gameHeight - ballRadius){
        ballYDirection *= -1;
    }
    if(ballX <= 0){
        player2Score+=1;
        updateScore();
        createBall();
        return;
    }
    if(ballX >= gameWidth){
        player1Score+=1;
        updateScore();
        createBall();
        return;
    }
    if(ballX <= (paddle1.x + paddle1.width + ballRadius)){
        if(ballY > paddle1.y && ballY < paddle1.y + paddle1.height){
            ballX = (paddle1.x + paddle1.width) + ballRadius; // if ball gets stuck
            ballXDirection *= -1;
            ballSpeed += 0.5;
        }
    }
    if(ballX >= (paddle2.x - ballRadius)){
        if(ballY > paddle2.y && ballY < paddle2.y + paddle2.height){
            ballX = paddle2.x - ballRadius; // if ball gets stuck
            ballXDirection *= -1;
            ballSpeed += 0.5;
        }
    }
};
function changeDirection(event){ //패들 움직이는거
    const keyPressed = event.keyCode;
    const paddle1Up = 87;
    const paddle1Down = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;

    switch(keyPressed){
        case(paddle1Up):
            if(paddle1.y > 0){
                paddle1.y -= paddleSpeed;
            }
            break;
        case(paddle1Down):
            if(paddle1.y < gameHeight - paddle1.height){
                paddle1.y += paddleSpeed;
            }
            break;
        case(paddle2Up):
            if(paddle2.y > 0){
                paddle2.y -= paddleSpeed;
            }
            break;
        case(paddle2Down):
            if(paddle2.y < gameHeight - paddle2.height){
                paddle2.y += paddleSpeed;
            }
            break;
    }
};
function updateScore(){
    scoreText.textContent = `${player1Score}       ${player2Score}`;
};
function resetGame(){
    const previousBallSpeed = ballSpeed;
    player1Score = 0;
    player2Score = 0;
    paddle1 = {
        width: 25,
        height: 100,
        x: 0,
        y: 0
    };
    paddle2 = {
        width: 25,
        height: 100,
        x: gameWidth - 25,
        y: gameHeight - 100
    };
    ballSpeed = 1;
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;

    updateScore();
    gameStart();
    displayGameMessage();
    createBall()
}
function checkWinner() {
    if (player1Score >= scoreToWin || player2Score >= scoreToWin) {
        gameMessage.textContent = (player1Score >= scoreToWin) ? '플레이어1 승리!' : '플레이어2 승리!';
        gameOverMenu.style.display = 'block';
    }
}
function drawPaddles() {
    ctx.strokeStyle = paddleBorder;

    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function drawScore() {
    ctx.fillStyle = "rgba(0, 0, 139, 1)"; // 텍스트 색상 설정
    ctx.font = "90px Arial"; // 텍스트 글꼴 및 크기 설정
    ctx.fillText(`${player1Score}              ${player2Score}`, gameWidth / 5, 300);
}
function showRestartButton() {
    resetBtn.style.display = 'block'; // 재시작 버튼 보이기
    clearInterval(intervalID); // 게임 인터벌 멈추기
    checkWinner();
} 0;
function displayGameMessage() {
    gameMessage.textContent = '';
    
    if (player1Score >= scoreToWin) {
        gameMessage.textContent = '플레이어1 승리!';
        showRestartButton();
    } else if (player2Score >= scoreToWin) {
        gameMessage.textContent = '플레이어2 승리!';
        showRestartButton();
    }
    checkWinner();
}