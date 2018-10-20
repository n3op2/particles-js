const getRnd = (min, max) => Math.random() * (max - min) + min;
const toNeg = (n) => -Math.abs(n); 
const toPos = (n) => Math.abs(n); 
const getDist = (t_x, x, t_y, y) => {
  let dx = t_x - x;
  let dy = t_y - y;
  return { dx: dx, dy: dy, dist: Math.sqrt((dx * dx) + (dy * dy)) };
}

class Particle {
  constructor(x, y, ctx) {
    this.ax = x, this.ay = y;
    this.x = x, this.y = y;
    this.dx = 0, this.dy = 0;
    this.direction = 0;
    this.vel = 2;
    this.maxV = 5;
    this.ctx = ctx
    this.r = getRnd(4, 1);
    this.f = 1.000873;
    this.a = 0;
    this.dist = 0;
    this.radius = getRnd(1, -1);
    this.ratio = 0;
    this.rRnd = getRnd(120, 50);
    this.aStep = 2 * Math.PI / getRnd(660, 40), this.aStepMax = 0.3;
    this.col = [Math.ceil(getRnd(155, 10)), Math.ceil(getRnd(150, 0)), 20];
    this.n = 1;
    this.moves = {
      toText: false
    }

    this.draw = () => {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgb(' + this.col.join(',') + ')';
      ctx.fill();
    }

    this.restore = (x, y) => {
      // reset all moves
      this.moves.toText = false;
      this.vel = 2;
      this.radius = getRnd(2, -2);
      this.aStep = 2 * Math.PI / getRnd(560, 40);
    }

    this.sendTo = (x, y) => {
      this.targetX = x;
      this.targetY = y;
      this.moves.toText = true;
    }
    
    this.follow = (mx, my, r) => {
      let { dx, dy, dist } = getDist(mx, this.x, my, this.y);
      let ratio;
      if((mx <= this.x + r && mx >= this.x - r) || (my <= this.y + r && my >= this.y - r)) { 
        if(dist > 1 && !this.moves.toText) {
          ratio = 1 / dist;
          this.x = (ratio * dx) + this.x;
          this.y = (ratio * dy) + this.y;
        }
      }
    }

    this.step = () => {
      if(this.moves.toText){
        this.dx = this.targetX - this.x;  
        this.dy = this.targetY - this.y;  
        this.dist = Math.sqrt((this.dx * this.dx) + (this.dy * this.dy));
        if(this.dist > this.vel){
          if(this.aStep < 0.5 && this.aStep > 0.01) this.aStep /= this.f
          this.vel *= this.f + 0.006;
          this.ratio = this.vel / this.dist;
          this.x = (this.ratio * this.dx) + this.x - (this.radius * Math.sin(this.a));
          this.y = (this.ratio * this.dy) + this.y - (this.radius * Math.cos(this.a));
        } 
      } else {
        if(this.aStep < this.aStepMax) this.aStep *= this.f;
        if(this.radius > -3 && this.radius < 3) { 
          this.radius *= this.f;
        } else {
          this.radius /= this.f;
        }
        this.x += this.radius * Math.sin(this.a);
        this.y += this.radius * Math.cos(this.a);
      }
      this.a += this.aStep;
    }
  }
}
