import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Background } from './background.js';
import { InputHandler } from './inputHandler.js';


window.addEventListener("load", () => {
  /**
   * @type {HTMLCanvasElement}
   */

  const canvas = document.querySelector("#canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1200;
  canvas.height = 720;

  let score = 0;
  let enemies = [];
  let lastTime = 0;
  let enemyTimer = 0;
  let enemyInterval = 500;
  let randomEnemyInterval = Math.random() * 1000 + 500;
  let gameOver = false;
  
  const input = new InputHandler(restartGame);
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);
  const fullScreenButton = document.querySelector('#fullScreenButton');


  function handleEnemies(deltaTime, increaseScore) {
    

    if(enemyTimer > enemyInterval + randomEnemyInterval) {
      enemies.push(new Enemy(canvas.width, canvas.height));
      randomEnemyInterval = Math.random() * 1000 + 500;
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    
    enemies.forEach(enemy => {
      enemy.draw(ctx);
      enemy.update(deltaTime, increaseScore);
    })

    enemies = enemies.filter(enemy => !enemy.markedForDeletion);

  }

  function displayStatusText(context) {
    context.textAlign = 'left';
    context.font ='40px Helvetica';
    context.fillStyle = "black";
    context.fillText('Score: '+ score, 20, 50);
    context.fillStyle = "white";
    context.fillText('Score: '+ score, 22, 52);
    if(gameOver) {
      context.font ='40px Helvetica';
      context.textAlign = 'center';
      context.fillStyle = "black";
      context.fillText('GAME OVER, Press Enter or swipe down to restart ', canvas.width/2, canvas.height/2 - 100);
      context.fillStyle = "white";
      context.fillText('GAME OVER, Press Enter or swipe down to restart ', canvas.width/2 + 2, canvas.height/2 - 98);
    }
  }

  function isGameOver(enemies, player) {
    let result = false;
    // collision detection
    enemies.forEach(enemy => {
      const dx = (enemy.x + enemy.width/2 - 20) - (player.x + player.width/2);
      const dy = (enemy.y + enemy.height/2) - (player.y + player.height/2 + 20);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if(distance < (enemy.width / 3 + player.width/ 3)) {
        result = true;
      }
    })
    return result;
  }

  function increaseScore() {
    score += 10;
  }

  function restartGame() {
    if(gameOver) {
      player.restart();
      background.restart();
      score = 0;
      enemies = [];
      gameOver = false;
      animate(0);    
    }
  }

  function toggleFullScreen() {
    if(!document.fullscreenElement) {
      canvas.requestFullscreen().then().catch(err => alert(`Error, can't enable full screen mode: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  }

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    background.draw(ctx);
    background.update();

    player.draw(ctx);
    player.update(input, deltaTime, enemies);
    
    handleEnemies(deltaTime, increaseScore);
    gameOver = isGameOver(enemies, player);
    displayStatusText(ctx);
    if(!gameOver) requestAnimationFrame(animate);
  }
  
  fullScreenButton.addEventListener('click', toggleFullScreen);
  animate(0);
});
