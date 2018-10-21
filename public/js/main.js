const c = document.getElementById('stage');
const ctx = c.getContext('2d');
const stage_w = c.width;
const stage_h = c.height;
let parts = [];
let mouse_x = 0;
let mouse_y = 0;

const clear = () => ctx.clearRect(0, 0, stage_w, stage_h);

const addPart = (x, y) => new Particle(x, y, ctx);
const delPart = (i) => parts.splice(i, 1);
const rePart = (i) => parts[i] = addPart(parts[i].ax, parts[i].ay);

let testB = true;
const rect = c.getBoundingClientRect();

const createParts = (x, y, str) => {
  ctx.font = 'bold 120px arial';
  ctx.textAlign = 'center';
  ctx.fillText(str, x, y);
  const data = ctx.getImageData(0, 0, stage_w, stage_h).data;
  for(let i = 0; i< stage_w; i += Math.round(stage_w / 350)) {
    for(let j = 0; j < stage_h; j += Math.round(stage_w / 350)) {
      if(data[((i + j * stage_w) * 4) + 3] > 250) {
        parts.push(addPart(i, j));
      }
    }
  }
}

c.addEventListener('mousemove', (e) => {
  mouse_x = e.clientX - rect.left;
  mouse_y = e.clientY - rect.top;
}) 

c.addEventListener('click', (e) => {
  testB = !testB;
  return testB ? 
    parts.forEach(el => el.restore(el.ax, el.ay)) : 
    parts.forEach(el => el.sendTo(el.ax, el.ay));
});

const removeLost = (parts) => {
  parts.map((el, i) => {
    if(el.x > stage_w * 1.2 || el.x < -60) {
      rePart(i);
    } else if(el.y > stage_h * 1.2 || el.y < -60) {
      rePart(i);
    }
  });
}

const _mC = (n) => Math.ceil(n);

const inRadius = (x, y, tx, ty, r) => {
    return (_mC(y) >= (_mC(ty)-r) && _mC(y) <= (_mC(ty)+r)) && 
    (_mC(x) >= (_mC(tx)-r) && _mC(x) <= (_mC(tx)+r));
}

const init = () => {
  parts.forEach(el => el.follow(mouse_x, mouse_y, 100));
  parts.forEach((el, i) => {
    if(inRadius(el.x, el.y, mouse_x, mouse_y, 50)) { 
      el.col[0] += 10;
      el.col[2] -= 15;
      el.col[1] += 10; 
    }

    inRadius(el.x, el.y, el.ax, el.ay, 50) ? 
      (el.col[2] -= 14, el.col[1] += 5, el.col[0] -= 10) :
      (el.col[2] += 12, el.col[1] -= _mC(getRnd(13, 1))); 
    if(i % 50 === 0 && el.moves.toText) el.moves.toText = false;
      return (el.draw(), el.step())
  });
  //removeLost(parts);
  window.requestAnimationFrame(init);   
}

createParts(800, 500, 'Go Go Ebay!');
init();
