export class Player {
  constructor(gameWidth, gameHeight) {
    this.image = document.querySelector("#playerImage");
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.width = 200;
    this.height = 200;
    this.x = 100;
    this.y = this.gameHeight - this.height;
    this.frameX = 0;
    this.maxFrame = 8;
    this.frameY = 0;
    this.fps = 20;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.speed = 0;
    this.vy = 0;
    this.weight = 1;
  }
  restart() {
    this.x = 100;
    this.y = this.gameHeight - this.height;
    this.maxFrame = 8;
    this.frameY = 0;
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update(input, deltaTime) {
    // sprite aniamtion
    if(this.frameTimer > this.frameInterval) {
      if(this.frameX >= this.maxFrame) this.frameX = 0;
      else this.frameX++; 

      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    if (input.keys.indexOf("ArrowRight") > -1) {
      this.speed = 5;
    } else if (input.keys.indexOf("ArrowLeft") > -1) {
      this.speed = -5;
    } else {
      this.speed = 0;
    }

    if ((input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf("swipe up") > -1) && this.onGround()) {
      this.vy -= 30;
    }

    // horizontal movement
    this.x += this.speed;
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.gameWidth - this.width) {
      this.x = this.gameWidth - this.width;
    }

    // vertical movement
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.weight;
      this.maxFrame = 5;
      this.frameY = 1;
    } else {
      this.vy = 0;
      this.frameY = 0;
      this.maxFrame = 8;
    }

    if (this.y > this.gameHeight - this.height)
      this.y = this.gameHeight - this.height;
  }

  onGround() {
    return this.y >= this.gameHeight - this.height;
  }
}