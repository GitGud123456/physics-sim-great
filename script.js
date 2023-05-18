var canvas = document.getElementById("myCanvas");
canvas.width = 1000;
canvas.height = 750;
var ctx = canvas.getContext("2d");
var objects = [];
canvas.addEventListener("click", returnclick);
var holearray = [];
let select = document.getElementById("mct");
let btn = document.getElementById("btn");
let clearbtn = document.getElementById("clear");
clearbtn.addEventListener("click", clear);
document.addEventListener("keyup", initialize());
document.addEventListener("keyup", bhinitialize());

btn.addEventListener("click", makeRandom);
let lastTime = 0;
let dt = 0.013213999999999998;
requestAnimationFrame(time);
let parameters = [];
document.addEventListener("keyup", applyParameters());

// Make Obj at mouse location
function returnclick(event) {
  if (select.value == "ball") {
    var [m, r, vx, vy] = initialize();
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    document.getElementById("by").value = y;
    document.getElementById("bx").value = x;
    var ax = 0;
    var ay = 0;
    var Fnetx = 0;
    var Fnety = 0;
    objects.push(new Object(x, y, vx, vy, m, r, ax, ay, Fnetx, Fnety));
  } else if (select.value == "bh") {
    var [bhm, bhr, bhvx, bhvy] = bhinitialize();
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    document.getElementById("by").value = y;
    document.getElementById("bx").value = x;
    holearray.push(new gravityWell(x, y, bhvx, bhvy, bhm, bhr));
  }
}

// motion stuff
function update() {
  for (var i = 0; i < objects.length; i++) {
    objects[i].update();
    for (var j = i + 1; j < objects.length; j++) {
      if (areColliding(objects[i], objects[j])) {
        var Pinitialx =
          objects[i].vx * objects[i].m + objects[j].vx * objects[j].m;
        var Pinitialy =
          objects[i].vy * objects[i].m + objects[j].vy * objects[j].m;
        var v1fx =
          (Pinitialx - objects[j].m * (objects[i].vx - objects[j].vx)) /
          (objects[i].m + objects[j].m);
        var v2fx =
          (Pinitialx - objects[i].m * (objects[j].vx - objects[i].vx)) /
          (objects[i].m + objects[j].m);
        var v1fy =
          (Pinitialy - objects[j].m * (objects[i].vy - objects[j].vy)) /
          (objects[i].m + objects[j].m);
        var v2fy =
          (Pinitialy - objects[i].m * (objects[j].vy - objects[i].vy)) /
          (objects[i].m + objects[j].m);
        objects[i].vx = v1fx;
        objects[i].vy = v1fy;
        objects[j].vx = v2fx;
        objects[j].vy = v2fy;

        var dx = objects[i].x - objects[j].x;
        var dy = objects[i].y - objects[j].y;
        var distance = Math.sqrt(dx ** 2 + dy ** 2);
        var overlap = objects[i].r + objects[j].r - distance;
        if (overlap > 0) {
          var angle = Math.atan2(dx, dy);
          objects[i].x += (Math.sin(angle) * overlap) / 2;
          objects[j].x -= (Math.sin(angle) * overlap) / 2;
          objects[i].y += (Math.cos(angle) * overlap) / 2;
          objects[j].y -= (Math.cos(angle) * overlap) / 2;
        }
      }
    }
  }
}

//update Obj position
Object.prototype.update = function () {
  //safety
  if (this.x <= 0 + this.r) {
    this.x = 0 + this.r;
    this.vx *= -1;
  }
  if (this.x >= canvas.width - this.r) {
    this.x = canvas.width - this.r;
    this.vx *= -1;
  }
  if (this.y <= 0 + this.r) {
    this.y = 0 + this.r;
    this.vy *= -1;
  }
  if (this.y >= canvas.height - this.r) {
    this.y = canvas.height - this.r;
    this.vy *= -1;
  }
  [ax, ay] = GF(this.ax, this.ay);
  this.ax = ax;
  this.ay = ay;
  this.Fnetx = (Ff(this.m, this.vx) + this.ax) * dt;
  this.Fnety = (Ff(this.m, this.vy) + this.ay) * dt;
  console.log(this.x, this.vx, this.ax, "Y", this.y, this.vy, this, ay);
  this.x += (this.vx + this.ax) * dt;
  this.y += (this.vy + this.ay) * dt;
};

//animate objects
Object.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
};
//animate black holes
gravityWell.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();
};

//loop
function animate() {
  parameters = applyParameters();
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //grav bh stuff
  for (var i = 0; i < holearray.length; i++) {
    holearray[i].draw();
  }
  //end
  for (var i = 0; i < objects.length; i++) {
    objects[i].draw();
    //objects[i].update();
  }

  update();

  requestAnimationFrame(time);
}

animate();

//helper Functions

function bGF(obj1, m, x, y) {
  var G =
    (parameters[0].GravityCoeffcient * obj1.m * m) /
    Math.sqrt((obj1.x - x) ** 2 + (obj1.y - y) ** 2) ** 2;
  var D = Math.sqrt((obj1.x - x) ** 2 + (obj1.y - y) ** 2);
  var dx = obj1.x - x;
  var dy = obj1.y - y;
  var angle = Math.atan2(dx, dy);
  var ay = Math.cos(angle) * G;
  var ax = Math.sin(angle) * G;
  if (G > 3) {
    G = 3;
  }
  return [G, D, dx, dy, ax, ay];
}
function GF(ax, ay) {
  if (holearray.length > 0) {
    for (var i = 0; i < holearray.length; i++) {
      for (var j = 0; j < objects.length; j++) {
        var dx = holearray[i].x - objects[j].x;
        var dy = holearray[i].y - objects[j].y;
        var angle = Math.atan2(dx, dy);

        ax = Math.cos(angle) * parameters[0].parameterAttractionFroce;
        ay = Math.sin(angle) * parameters[0].parameterAttractionFroce;
        if (holearray[i].x < objects[j].x) {
          ax *= -1;
        }
        if (holearray[i].y < objects[j].y) {
          ay *= -1;
        }
      }
    }

    return [ax, ay];
  } else {
    ax = 0;
    ax = 0;
    return [ax, ay];
  }
}

//check collison
function areColliding(obj1, obj2) {
  var dx = obj1.x - obj2.x;
  var dy = obj1.y - obj2.y;
  var distance = Math.sqrt(dx ** 2 + dy ** 2);
  return distance <= obj1.r + obj2.r;
}

//calc Ff
function Ff(m, Fnet) {
  var F = 0;
  F = m * parameters[0].parameterAirFriction; // F coefficent x mass
  if (Fnet > 0) {
    F *= -1;
  }
  if (Math.abs(F) > Math.abs(Fnet)) {
    F = -Fnet;
  }
  if (Fnet == 0) {
    F = 0;
  }

  return F;
}

// create Obj
function Object(x, y, vx, vy, m, r, ax, ay, Fnetx, Fnety) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = m;
  this.r = r;
  this.ax = ax;
  this.ay = ay;
  this.Fnetx = Fnetx;
  this.Fnety = Fnetx;
}
//test objects

//make random obj
function makeRandom() {
  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;
  var vx = Math.random() * 4;
  var vy = Math.random() * 4;
  var m = Math.random() * 100;
  var r = m / 2;
  var ax = Math.random() * 2;
  var ay = Math.random() * 2;
  objects.push(new Object(x, y, vx, vy, m, r, ax, ay));
}
// objects.push(new Object(100, 325, 4, 0, 20, 10));
// objects.push(new Object(900, 325, -4, 0, 20, 10));

//holearray.push(new gravityWell(500, 325, 0, 0, 10, 10));
// for (var i = 0; i < 500; i++) {
//   var x = Math.random() * canvas.width;
//   var y = Math.random() * canvas.height;
//   var vx = Math.random() * 4 - 2;
//   var vy = Math.random() * 4 - 2;
//   var m = Math.random() * 20;
//   var r = m / 2;
//   objects.push(new Object(x, y, vx, vy, m, r));
// }

// for (var i = 0; i < 1000; i++) {
//   var x = Math.random() * canvas.width;
//   var y = Math.random() * canvas.height;
//   // var vx = Math.random() * 4 - 2;
//   // var vy = Math.random() * 4 - 2;
//   var m = Math.random() * 20;
//   var r = m / 2;

//   var vx = 0;
//   var vy = 0;
//   objects.push(new Object(x, y, vx, vy, i / 80, i / 80));
//   // if (i < 200) {
//   //   objects.push(new Object(x, y, vx, vy, 1, 1));
//   // } else if (i < 400) {
//   //   objects.push(new Object(x, y, vx, vy, 3, 3));
//   // } else if (i < 600) {
//   //   objects.push(new Object(x, y, vx, vy, 4, 4));
//   // } else if (i < 800) {
//   //   objects.push(new Object(x, y, vx, vy, 5, 5));
//   // }
// }

//initialize Parameters
function applyParameters() {
  parameterAttractionFroce = +document.getElementById("pAF").value;
  parameterAirFriction = +document.getElementById("pAf").value;
  parameterCollisonResponse = +document.getElementById("pCr").value;
  parameterViscosity = +document.getElementById("pV").value;
  GravityCoeffcient = +document.getElementById("GC").value;

  return [
    {
      parameterAttractionFroce,
      parameterAirFriction,
      parameterCollisonResponse,
      parameterViscosity,
      GravityCoeffcient,
    },
  ];
}

//initalize ball values
function initialize() {
  bm = +document.getElementById("bm").value;
  bvx = +document.getElementById("bvx").value;
  bvy = +document.getElementById("bvy").value;
  br = +document.getElementById("br").value;
  return [bm, br, bvx, bvy];
}
//initalize bh values
function bhinitialize() {
  bhm = +document.getElementById("bhm").value;
  bhvx = +document.getElementById("bhvx").value;
  bhvy = +document.getElementById("bhvy").value;
  bhr = +document.getElementById("bhr").value;
  return [bhm, bhr, bhvx, bhvy];
}

//clear objects
function clear() {
  objects = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// grav stuff

function gravityWell(x, y, vx, vy, m, r) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.m = m;
  this.r = r;
}

function time(time) {
  dt = (time - lastTime) / 1000;
  // console.log(dt, time, lastTime);
  lastTime = time;
  return dt;
}
