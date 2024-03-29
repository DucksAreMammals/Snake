let direction
let alreadyMoved = false
let gameIsOver = false
let highscore

function changeDirection (newDir) {
  if (!alreadyMoved) {
    switch (newDir) {
      case 'U':
        if (direction !== 'D' && direction !== 'U') {
          direction = newDir
          alreadyMoved = true
        }
        break
      case 'D':
        if (direction !== 'U' && direction !== 'D') {
          direction = newDir
          alreadyMoved = true
        }
        break
      case 'L':
        if (direction !== 'R' && direction !== 'L') {
          direction = newDir
          alreadyMoved = true
        }
        break
      case 'R':
        if (direction !== 'L' && direction !== 'R') {
          direction = newDir
          alreadyMoved = true
        }
        break
    }
  }
}

window.addEventListener('keydown', function (keyEvent) {
  switch (keyEvent.key) {
    case 'ArrowUp':
      keyEvent.preventDefault()
      changeDirection('U')
      break
    case 'ArrowDown':
      keyEvent.preventDefault()
      changeDirection('D')
      break
    case 'ArrowLeft':
      keyEvent.preventDefault()
      changeDirection('L')
      break
    case 'ArrowRight':
      keyEvent.preventDefault()
      changeDirection('R')
      break
    case ' ':
      if (gameIsOver) {
        game()
      }
  }
})

window.onload = game

function game () {
  const canvas = document.getElementById('testCanvas')
  const ctx = canvas.getContext('2d')

  gameIsOver = false
  highscore = document.getElementById('highscore')

  if (!Cookies.get('highscore')) {
    Cookies.set('highscore', 0, {
      expires: 36500
    })
  }

  highscore.innerHTML = Cookies.get('highscore')

  canvas.onclick = function () {
    if (window.innerHeight > window.innerWidth) {
      canvas.style = 'width: 100%'
    } else {
      canvas.style = 'height: 100%'
    }
    document.getElementById('gameContainer').requestFullscreen()
  }

  const gridSize = 25
  const gridColor = '#0c3f0c'

  const snakeColor1 = '#00DD00'
  const snakeColor2 = '#00FF00'

  const appleColor1 = '#DD0000'
  const appleColor2 = '#FF0000'

  const snake = [
    [12, 12]
  ]
  let snakeLen = 4

  let apple = []

  generateApple()

  direction = 'U'

  let score = 0

  const gameLoopIntervalId = setInterval(gameLoop, 100)

  function gameLoop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid()
    moveSnake()
    getApple()
    drawApple()
    drawSnake()
    drawScore()
    collideWithSelf()
    alreadyMoved = false
  }

  function moveSnake () {
    switch (direction) {
      case 'U':
        if (snake[snake.length - 1][1] - 1 >= 0) {
          snake.push([
            snake[snake.length - 1][0],
            snake[snake.length - 1][1] - 1
          ])
        } else {
          snake.push([snake[snake.length - 1][0], 23])
        }
        break
      case 'D':
        if (snake[snake.length - 1][1] + 1 <= 23) {
          snake.push([
            snake[snake.length - 1][0],
            snake[snake.length - 1][1] + 1
          ])
        } else {
          snake.push([snake[snake.length - 1][0], 0])
        }
        break
      case 'L':
        if (snake[snake.length - 1][0] - 1 >= 0) {
          snake.push([
            snake[snake.length - 1][0] - 1,
            snake[snake.length - 1][1]
          ])
        } else {
          snake.push([23, snake[snake.length - 1][1]])
        }
        break
      case 'R':
        if (snake[snake.length - 1][0] + 1 <= 23) {
          snake.push([
            snake[snake.length - 1][0] + 1,
            snake[snake.length - 1][1]
          ])
        } else {
          snake.push([0, snake[snake.length - 1][1]])
        }
        break
    }

    if (snake.length - 1 >= snakeLen) {
      snake.splice(0, 1)
    }
  }

  function drawGrid () {
    for (let i = 0; i < canvas.width + 1; i += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.height, i)
      ctx.strokeStyle = gridColor
      ctx.stroke()
    }

    for (let i = 0; i < canvas.width + 1; i += gridSize) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.width)
      ctx.strokeStyle = gridColor
      ctx.stroke()
    }
  }

  function collideWithSelf () {
    for (let i = 0; i < snake.length - 1; i++) {
      if (
        snake[i][0] === snake[snake.length - 1][0] &&
        snake[i][1] === snake[snake.length - 1][1]
      ) {
        gameOver()
      }
    }
  }

  function drawSnake () {
    for (let i = 0; i < snake.length; i++) {
      drawSegment(snake[i][0], snake[i][1])
    }
  }

  function drawSegment (x, y) {
    ctx.fillStyle = snakeColor1
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize)

    ctx.fillStyle = snakeColor2
    ctx.fillRect(
      x * gridSize + gridSize / 4,
      y * gridSize + gridSize / 4,
      gridSize / 2,
      gridSize / 2
    )
  }

  function drawApple () {
    ctx.fillStyle = appleColor1
    ctx.fillRect(apple[0] * gridSize, apple[1] * gridSize, gridSize, gridSize)

    ctx.fillStyle = appleColor2
    ctx.fillRect(
      apple[0] * gridSize + gridSize / 4,
      apple[1] * gridSize + gridSize / 4,
      gridSize / 2,
      gridSize / 2
    )
  }

  function generateApple () {
    apple = [Math.floor(Math.random() * 24), Math.floor(Math.random() * 24)]

    for (let i = 0; i < snake.length; i++) {
      if (snake[i][0] === apple[0] && snake[i][1] === apple[1]) {
        generateApple()
        return
      }
    }
  }

  function getApple () {
    if (
      snake[snake.length - 1][0] === apple[0] &&
      snake[snake.length - 1][1] === apple[1]
    ) {
      generateApple()
      snakeLen++
      score++
    }
  }

  function gameOver () {
    clearInterval(gameLoopIntervalId)
    ctx.font = '76px Arial'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 + 76 / 2)
    gameIsOver = true
    if (Cookies.get('highscore') < score) {
      Cookies.set('highscore', score, {
        expires: 36500
      })
      highscore.innerHTML = score
    }
  }

  function drawScore () {
    ctx.font = '32px Arial'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'left'
    ctx.fillText('Score: ' + score, 10, 32)
  }
}
