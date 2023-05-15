// const canvas = document.getElementById("myCanvas");
// canvas.width = 800;
// canvas.height = 400;
// let boxX = 100;
// let boxY = 100;
// let moreObj = loadObjs();
// let objInfo = [];
// const ctx = canvas.getContext("2d");
// let btn = document.getElementById("btn");
// btn.addEventListener("click", clearall);

// canvas.addEventListener("click", returnclick);

// requestAnimationFrame(draw);
// function draw() {
//   // LOGIC SECTION

//   // DRAW SECTION

//   //background
//   ctx.fillStyle = "grey";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   // Set the fill style to black
//   ctx.fillStyle = "black";

//   // Draw a square with the new fill style
//   ctx.fillRect(boxX, boxY, 20, 20);

//   drawObjs(moreObj);

//   requestAnimationFrame(draw);
// }

// function returnclick(event) {
//   let num = +moreObj.length + 1;
//   const x = event.clientX - canvas.offsetLeft;
//   const y = event.clientY - canvas.offsetTop;
//   console.log("Clicked at (" + x + ", " + y + ")");
//   moreObj.push({ num, x, y });
//   saveObjs();
//   loadObjs();
// }

// function drawObjs(ObjData) {
//   ctx.fillStyle = "black";
//   for (let i = 0; i < moreObj.length; i++) {
//     ctx.beginPath();
//     ctx.arc(ObjData[i].x, ObjData[i].y, 10, 0, 2 * Math.PI);
//     ctx.fillStyle = "black";
//     ctx.fill();
//   }
// }

// function clearall() {
//   moreObj = [];
//   saveObjs();
// }

// // save
// function saveObjs() {
//   localStorage.setItem("moreObj", JSON.stringify(moreObj));
// }
// // load
// function loadObjs() {
//   let objectsStr = localStorage.getItem("moreObj");
//   return JSON.parse(objectsStr);
// }

var canvas = document.getElementById("myCanvas");
canvas.width = 1000;
canvas.height = 750;
var ctx = canvas.getContext("2d");
var objects = [];
canvas.addEventListener("click", returnclick);

function Object(x, y, vx, vy, m) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = m;
}

Object.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, 50, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
};

function areColliding(obj1, obj2, dist) {
  var dx = Math.abs(obj1.x - obj2.x);
  var dy = Math.abs(obj1.y - obj2.y);
  var distance = Math.sqrt(dx * dx + dy * dy);
  return distance < 100;
}

// function areColliding(obj1, obj2) {
//   var dx = obj1.x - obj2.x;
//   var dy = obj1.y - obj2.y;
//   return distance < 100;
// }

function GF(m1, bhx, bhy, r1, m2, ballx, bally, r2) {
  var G = m1 / Math.sqrt((bhx - ballx) ** 2 + (bhy - bally) ** 2) ** 2;
  var D = Math.sqrt((bhx - ballx) ** 2 + (bhy - bally) ** 2);
  return [G, D];
}

function update() {
  for (var i = 0; i < objects.length; i++) {
    objects[i].update();
    for (var j = i + 1; j < objects.length; j++) {
      if (areColliding(objects[i], objects[j])) {
        var dx = objects[i].x - objects[j].x;
        var dy = objects[i].y - objects[j].y;
        var v1 = Math.sqrt(objects[i].vx ** 2 + objects[i].vy ** 2);
        var v2 = Math.sqrt(objects[j].vx ** 2 + objects[j].vy ** 2);
        nv1 = v1 - v2;

        var dx = objects[i].x - objects[j].x;
        var dy = objects[i].y - objects[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var overlap = 100 - distance;
        objects[i].vx += (dx / distance) * overlap;
        objects[i].vy += (dy / distance) * overlap;
        objects[j].vx -= (dx / distance) * overlap;
        objects[j].vy -= (dy / distance) * overlap;
      }
    }
  }
}

Object.prototype.update = function () {
  var dx = canvas.width / 2 - this.x;
  var dy = canvas.height / 2 - this.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  var acceleration = distance / 1000;
  this.vx += (dx / distance) * acceleration;
  this.vy += (dy / distance) * acceleration;
  this.x += this.vx;
  this.y += this.vy;
};

function returnclick(event) {
  console.log("1");
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  var vx = Math.random() * 4 - 2;
  var vy = Math.random() * 4 - 2;
  objects.push(new Object(x, y, vx, vy));
}

// for (var i = 0; i < 1000; i++) {
//   var x = Math.random() * canvas.width;
//   var y = Math.random() * canvas.height;
//   var vx = Math.random() * 4 - 2;
//   var vy = Math.random() * 4 - 2;
//   objects.push(new Object(x, y, vx, vy));
// }
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < objects.length; i++) {
    objects[i].draw();
    // objects[i].update();
  }

  update();
}

animate();

// for (var i = 0; i < 1; i++) {
//   var x = Math.random() * canvas.width;
//   var y = Math.random() * canvas.height;
//   var vx = Math.random() * 4 - 2;
//   var vy = Math.random() * 4 - 2;
//   objects.push(new Object(x, y, vx, vy));
// }
