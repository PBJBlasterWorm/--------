const canvas = document.getElementById("myCanvas")
const start = document.getElementById('gameSetting')
const ctx = canvas.getContext("2d") // 2D rendering context를 ctx변수에 저장(캔버스에 그리기위해 실직적으로 사용됨)

const ballRadius = 10   // 원의 반지름 값

let x = canvas.width / 2        // x좌표 중앙
let y = canvas.height - 30      // y좌표 하단
let dx = 2
let dy = -2 // 프레임마다 공이 움직이는 거리

var paddleHeight = 10                           // paddle의 높이
var paddleWidth = 75                            // paddle의 길이
var paddleX = (canvas.width - paddleWidth) / 2  // paddle의 x축 시작위치

var rightPressed = false
var leftPressed = false     // 버튼을 누르는 함수를 false로 초기화(처음 버튼이 눌려지지 않은 상태이기때문)

const brickRowCount = 5     // 벽돌 행의 수
const brickColumnCount = 8  // 벽돌 열의 수
const brickWidth = 75       // 벽돌의 길이
const brickHeight = 20      // 벽돌의 높이
const brickPadding = 10     // 각 벽돌의 간격
const brickOffsetTop = 30   // 캔버스와 벽돌사이 간격(위)
const brickOffsetLeft = 30  // 캔버스와 벽돌사이 간격(옆)

var score = 0   // 점수를 저장하는 변수 초기화

let lives = 3   // 목숨값을 저장하는 변수 초기화

// 벽돌 생성
const bricks = []
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }    // 공이 벽돌에 부딪힐때 status속성으로 초기화
    }
}

document.addEventListener("keydown", keyDownHandler, false) // 키를 눌렀을때 keyDownHandler실행
document.addEventListener("keyup", keyUpHandler, false)     // 키에 손을 땠을때 keyUpHandler실행

// 마우스 이벤트리스너
document.addEventListener("mousemove", mouseMoveHandler, false)

function keyDownHandler(e) {
    if (e.keyCode == 39) {          // keyCode=39 -> 오른쪽 방향키
        rightPressed = true         // 오른쪽 방향키를 누르면 true
    }
    else if (e.keyCode == 37) {     // keyCode=37 -> 오른쪽 방향키
        leftPressed = true          // 왼쪽 방향키를 누르면 true
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false        // 오른쪽 방향키를 때면 false
    }
    else if (e.keyCode == 37) {
        leftPressed = false         // 왼쪽 방향키를 때면 false
    }
}

function mouseMoveHandler(e) {
    // 뷰포트(e.clientX) 안에 있는 가로 마우스 위치에 캔버스의 좌측 끝과 뷰포트(canvas.offsetLeft)의 좌측 끝 사이의 거리를 뺀 값
    const relativeX = e.clientX - canvas.offsetLeft
    // paddle이 캔버스 밖으로 나가지 않도록 하게한다
    if (relativeX > 0 && relativeX < canvas.width) {
        // 마우스 위치를 paddle의 중앙에 가도록한다
        paddleX = relativeX - paddleWidth / 2
    }
}

// 공의 중앙이 어떤 벽돌 범위 내에 있을 경우 공의 방향을 바꾸게 되는 함수
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r]  // b는 벽돌 객체를 저장하는 함수
            if (b.status == 1) {
                // 공의 x좌표는 벽돌의 x좌표보다 커야한다
                // 공의 x좌표는 벽돌의 x좌표 + 가로길이 보다 작아야한다
                // 공의 y좌표는 벽돌의 y좌표보다 커야한다
                // 공의 y좌표는 벽돌의 y좌표 + 높이길이 보다 작아야한다
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy * 1.1  // 공이 벽돌에 부딪혔다면 공의 속도를 1.1배 빠르게
                    b.status = 0    // 공이 벽돌에 부딪혔다면 해당벽돌의 status속성을 0으로 초기화
                    score++         // 벽돌이 깨질때마다 score값 증가
                    if (score == brickRowCount * brickColumnCount) {
                        re_back = confirm("승리 하셨습니다.")
                        if (re_back == 1) {
                            location.reload()
                        }
                        else {
                            window.history.back()
                        }
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial"                 // 글자의 크기 글꼴
    ctx.fillStyle = "#0095DD"               // 글자 색
    ctx.fillText("Score: " + score, 8, 20)  // 캔버스에 치될 텍스트, x좌표(왼쪽으로 부터 떨어진 거리), y좌표(위로 부터 떨어진 거리)
}

function drawLives() {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#0095DD"
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20)
}

function drawBall() {
    //ctx.beginPath()                             // 명령어 시작
    //ctx.arc(x, y, ballRadius, 0, Math.PI * 2)   // 처음 두 값들은 캔버스의 좌상단 모서리의 좌표, 길이, 높이
    //ctx.fillStyle = "hotpink"                   // 도형의 색
    //ctx.fill()                                  // 도형생성
    //ctx.closePath()                             // 명령어 종료
    const ballImage = document.getElementById('ballImage'); // 이미지 태그의 ID를 사용하여 이미지 요소 가져오기
    ctx.drawImage(ballImage, x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
}

function drawPaddle() {
    //ctx.beginPath()
    //ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    //ctx.fillStyle = "#000"
    //ctx.fill()
    //ctx.closePath()
    const paddleImage = document.getElementById('paddleImage');
    ctx.drawImage(paddleImage, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

// 생성된 벽돌 그리기
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            // 벽돌을 그리기 전에 status속성을 확인해 status가 1이면 벽돌을 그리고 0이면 그릴필요가 없다
            if (bricks[c][r].status == 1) {
                // 벽돌을 그릴때 변수를 지정해 한곳에 생성되지 안로독 위치 잡기
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                const brickImage = document.getElementById('brickImage'); // Change 'brickImage' to your actual image ID
                ctx.drawImage(brickImage, brickX, brickY, brickWidth, brickHeight);
                ctx.closePath()
            }
        }
    }
}


function gameStart() {
    start.style.display = 'none'
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)    // 이전 프레임의 도형을 지운다
        drawBricks()
        drawBall()
        drawPaddle()
        collisionDetection()
        drawScore()

        drawLives()

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx    // 음수로 바꿔 공의 방향을 바꾼다
        }

        if (y + dy < ballRadius) {
            dy = -dy
        }
        else if (y + dy > canvas.height - ballRadius) {     // 공이 밑면에 닿을시 실행
            if (x > paddleX && x < paddleX + paddleWidth) { // 공이 paddle에 닿을시 실행
                dy = -dy
            }
            else {
                lives--;
                // lives의 값이 0이하가되면 게임종료

                if (lives < 0) {
                    re_back = confirm("게임 오버 (확인을 누르면 다시시작, 취소를 누르면 뒤로가기)")
                    if (re_back == true) {
                        location.reload()
                        clearInterval(interval)
                    }
                    else {
                        window.history.back()
                        x = canvas.width / 2
                        y = canvas.height - 30
                    }
                }
                
                // lives의 값이 0이 아니면 공과 paddle의 위치 초기화
                else {
                    x = canvas.width / 2
                    y = canvas.height - 30
                    dx = 2
                    dy = -2
                    paddleX = (canvas.width - paddleWidth) / 2
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7    // 오른쪽 방향키를 누르면 x좌표로 값만큼 이동
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7    // 왼쪽 방향키를 누르면 x좌표 값만큼 이동
        }
        x += dx
        y += dy
    }
    const interval = setInterval(draw, 10)  // draw함수는 setInterval로 인해 10ms마다 실행된다(무한)
}
