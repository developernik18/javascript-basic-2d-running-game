export class InputHandler {
  constructor(restartGame) {
    this.keys = [];
    this.touchY = '';
    this.touchThreshold = 50;

    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      } else if(e.key === "Enter") {
        restartGame();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });

    window.addEventListener('touchstart', e => {
      console.log('start');
      console.log(e);
      this.touchY = e.changedTouches[0].pageY;
    })
    
    window.addEventListener('touchmove', e => {
      const swipeDistance = e.changedTouches[0].pageY - this.touchY;

      if(swipeDistance < - this.touchThreshold && this.keys.indexOf('swipe up')){
        this.keys.push('swipe up');
      } else if(swipeDistance > this.touchThreshold && this.keys.indexOf('swipe down')) {
        this.keys.push('swipe down');
        restartGame();
      }
    })
    
    window.addEventListener('touchend', e => {
      this.keys.splice(this.keys.indexOf('swipe up'), 1);
      this.keys.splice(this.keys.indexOf('swipe down'), 1);
    })
  }
}