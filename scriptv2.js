var canvas = document.getElementById("myCanvas");
canvas.width = 1000;
canvas.height = 800;
var ctx = canvas.getContext("2d");
var objects = [];
canvas.addEventListener("click", returnclick);
var holearray = [];
let select = document.getElementById("mct");
let btn = document.getElementById("btn");
btn.addEventListener("click", initialize);
let bhm = 0;
let xL = 0;
let yL = 0;
function initialize() {
  bhm = +document.getElementById("bhm").value;
  xL = +document.getElementById("lx").value;
  yL = +document.getElementById("ly").value;
  holearray.push(new gravityWell(xL, yL, bhm));
}

function returnclick(event) {
  if (select.value == "ball") {
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    var vx = 0;
    var vy = 0;
    objects.push(new Object(x, y, vx, vy));
  } else if (select.value == "bh") {
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    var mass = 1;
    holearray.push(new gravityWell(x, y, mass));
  }
}

for (var i = 0; i < 100; i++) {
  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;
  var vx = Math.random() * 4 - 2;
  var vy = Math.random() * 4 - 2;
  objects.push(new Object(x, y, vx, vy));
}

function Object(x, y, vx, vy) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
}

Object.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
};

function gravityWell(x, y, mass) {
  this.x = x;
  this.y = y;
  this.mass = mass;
}

function areColliding(obj1, obj2) {
  var dx = obj1.x - obj2.x;
  var dy = obj1.y - obj2.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  return distance < 20;
}

function update() {
  for (var i = 0; i < objects.length; i++) {
    objects[i].update();
    for (var j = i + 1; j < objects.length; j++) {
      if (areColliding(objects[i], objects[j])) {
        var dx = objects[i].x - objects[j].x;
        var dy = objects[i].y - objects[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var overlap = 20 - distance;
        objects[i].vx += ((dx / distance) * overlap) / 2;
        objects[i].vy += ((dy / distance) * overlap) / 2;
        objects[j].vx -= ((dx / distance) * overlap) / 2;
        objects[j].vy -= ((dy / distance) * overlap) / 2;
      }
    }
  }
}

// function updateC() {
//   for (var i = 0; i < objects.length; i++) {
//     objects[i].update();
//     for (var j = i + 1; j < holearray.length; j++) {
//       if (areColliding(objects[i], holearray[j])) {
//         objects[i].vx = -1;
//         objects[i].vy = -1;
//         //objects[j].vx -= ((dx / distance) * overlap) / 2;
//         //objects[j].vy -= ((dy / distance) * overlap) / 2;
//       }
//     }
//   }
// }

function GF(m1, bhx, bhy, ballx, bally) {
  var G = m1 / Math.sqrt((bhx - ballx) ** 2 + (bhy - bally) ** 2) ** 2;
  var D = Math.sqrt((bhx - ballx) ** 2 + (bhy - bally) ** 2);
  return [G, D];
}

Object.prototype.update = function () {
  for (var i = 0; i < holearray.length; i++) {
    var dx = holearray[i].x - this.x;
    var dy = holearray[i].y - this.y;
    let [G, D] = GF(
      holearray[i].mass,
      holearray[i].x,
      holearray[i].y,
      this.x,
      this.y
    );
    this.vx += dx * G;
    this.vy += dy * G;
    this.x += this.vx;
    this.y += this.vy;
  }
};

gravityWell.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
};

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < holearray.length; i++) {
    holearray[i].draw();
  }
  for (var i = 0; i < objects.length; i++) {
    objects[i].draw();
    //  objects[i].update();
  }
  // updateC();
  update();
}

animate();
