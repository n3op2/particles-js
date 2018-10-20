const c = document.getElementById('stage');
const ctx = c.getContext('2d');

const stage_w = c.width;
const stage_h = c.height;
let parts = [];
let mouse_x = 0;
let mouse_y = 0;

const rnd_w = () => Math.random() * stage_w;
const clear = () => ctx.clearRect(0, 0, stage_w, stage_h);

const addPart = (x, y) => new Particle(x, y, ctx);
const delPart = (i) => parts.splice(i, 1);
const rePart = (i) => parts[i] = addPart(parts[i].ax, parts[i].ay);

const targetReached = (parts) => {
  return parts.every(el => (el.x > target_x - 50 && el.x < target_x + 50));
}

let testB = true;

const rect = c.getBoundingClientRect();


const createParts = (x, y, str) => {
  ctx.font = 'bold 100px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(str, x, y);
  const data = ctx.getImageData(0, 0, stage_w, stage_h).data;
  for(let i = 0; i< stage_w; i += Math.round(stage_w / 400)) {
    for(let j = 0; j < stage_h; j += Math.round(stage_w / 400)) {
      if(data[((i + j * stage_w) * 4) + 3] > 150) {
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
  console.log('click');
  testB = !testB;
  return testB ? 
    parts.forEach(el => el.restore(el.ax, el.ay)) : 
    parts.forEach(el => el.sendTo(el.ax, el.ay));
});

const removeLost = (parts) => {
  parts.map((el, i) => {
    if(el.x > stage_w * 2 || el.x < -600) {
      delPart(i);
    } else if(el.y > stage_h * 2 || el.y < -600) {
      delPart(i);
    }
  });
}

const _mC = (n) => Math.ceil(n);
const inRadius = (el, r) => {
    return (_mC(el.y) >= (_mC(el.ay)-r) && _mC(el.y) <= (_mC(el.ay)+r)) && 
    (_mC(el.x) >= (_mC(el.ax)-r) && _mC(el.x) <= (_mC(el.ax)+r));
   
}
const init = () => {
  clear();
  parts.forEach(el => el.follow(mouse_x, mouse_y, 20));
  parts.forEach((el, i) => {
    if(mouse_x <= el.x + 20 && mouse_x >= el.x - 20) {
      if(el.radius < 5) {
        el.radius *= 1.0092;
      }
    }
  if(inRadius(el, 50)) {
    if(el.col[0] <= 255) el.col[0] += 20;
    if(el.col[1] >= 0) el.col[1] -= 20;;
  } else {
    if(el.col[0] >= 0) el.col[0] -= 5;
    if(el.col[1] <= 255) el.col[1] += 5;
  }
  if(i % 40 === 0 && el.moves.toText) {
    el.moves.toText = false;
  }
    return (el.draw(), el.step())
  });
//  removeLost(parts);
  window.requestAnimationFrame(init);   
}

createParts(100, 300, 'yo');
init();
