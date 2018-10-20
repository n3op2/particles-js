const getRnd = (min, max) => Math.random() * (max - min) + min;
const toNeg = (n) => -Math.abs(n); 
const toPos = (n) => Math.abs(n); 
const angPI = (min_deg, max_deg) => 2 * Math.PI / getRnd(min_deg, max_deg); 
const getDist = (t_x, x, t_y, y) => {
  let dx = t_x - x;
  let dy = t_y - y;
  return { dx: dx, dy: dy, dist: Math.sqrt((dx * dx) + (dy * dy)) };
}

class Particle {
  constructor(x, y, ctx) {
    this.dir = Math.random() > 0.5 ? true : false;
    this.ax = x, this.ay = y;
    this.x = x, this.y = y;
    this.vel = 2;
    this.ctx = ctx
    this.r = getRnd(7, 1);
    this.f = 1.000873;
    this.a = 0;
    this.radius = getRnd(2, -2), this.radiusMax = 5.5;
    this.aStep = angPI(660, 40), this.aStepMax = 2;
    this.col = [Math.ceil(getRnd(155, 10)), Math.ceil(getRnd(150, 0)), 20];
    this.moves = {
      toText: false
    }

    this.draw = () => {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgb(' + this.col.join(',') + ')';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = '20';
      ctx.shadowOffsetX = this.radius;
      ctx.shadowOffsetY = this.radius;
      ctx.fill();
    }

    this.restore = (x, y) => {
      // reset all moves
      this.moves.toText = false;
      this.vel = 2;
      this.radius = getRnd(1, -1);
      this.aStep = 2 * Math.PI / getRnd(860, 40);
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
        if(dist > this.vel  / 4 && !this.moves.toText) {
          ratio = (this.vel / 4) / dist;
          this.x = (ratio * dx) + this.x;
          this.y = (ratio * dy) + this.y;
        }
      }
    }

    this.step = () => {
      if(this.moves.toText){
        let { dx, dy, dist } = getDist(this.targetX, this.x, this.targetY, this.y);
        let ratio;
        if(dist > this.vel){
          if(this.aStep < 0.5 && this.aStep > 0.01) this.aStep /= this.vel; 
          this.vel *= this.f + 0.006;
          ratio = this.vel / dist;
          let new_x = ratio * dx;
          let new_y = ratio * dy;
          this.x += new_x - this.radius * Math.sin(this.a);
          this.y += new_y - this.radius * Math.cos(this.a);
        } 
      } else {
        if(this.aStep < this.aStepMax) this.aStep /= this.f;
        if(this.radius > toNeg(this.radiusMax) && this.radius < this.radiusMax) { 
          this.radius /= this.f;
        } else {
          this.radius = this.radius * 3;
        }
        this.x -= this.radius * Math.sin(this.a) * 1.4;
        this.y -= this.radius * Math.cos(this.a) * 1.2;
      }
      this.dir ? this.a += this.aStep : this.a -= this.aStep;
    }
  }
}
