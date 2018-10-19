const getRnd = () => Math.random() * (4 - 0.5) + 0.5;

class Particle {
  constructor(x, y, ctx) {
    this.x = x;
    this.vx = getRnd();
    this.y = y;
    this.ctx = ctx
    this.r = 10;
    this.draw = () => {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'green';
      ctx.fill();
    }
    this.step = () => {
      this.x += this.vx;
    }
  }
}
