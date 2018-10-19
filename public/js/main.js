const c = document.getElementById('stage');
const ctx = c.getContext('2d');

const stage_w = c.width;
const stage_h = c.height;

const rnd_w = () => Math.random() * stage_w;
const clear = () => ctx.clearRect(0, 0, stage_w, stage_h);

const delPart = (i) => arr.splice(i, 1);
const addPart = () => new Particle(10, rnd_w(), ctx);
const rePart = (i) => {
  arr.splice(i, 1)
  arr.push(new Particle(10, rnd_w(), ctx));
};

let arr = Array.from(Array(100), () => addPart());

const init = () => {
  clear();
  arr.forEach((el, i) => {
    if(el.x >= stage_w) {
      rePart(i);
    }
    return (el.draw(), el.step())
  });
  console.log(arr.length);
  window.requestAnimationFrame(init);   
}

init();
