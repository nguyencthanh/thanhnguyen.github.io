"use strict";

var canvas;
var gl;

var points = [];
var colors = [];
var theta = 0.0;
var thetaLoc;
var numTimesToSubdivide = 0;
var colorIndex = 0;
var changeDir = false;

function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  // Initialize our data for the Sierpinski Gasket
  var vertices = [vec2(-0.5, -0.5), vec2(0, 0.5), vec2(0.5, -0.5)];
  var colorSet = [
    vec3(1.0, 1.0, 0.0),
    vec3(1.0, 0.0, 1.0),
    vec3(0.0, 1.0, 0.0),
    vec3(0.0, 1.0, 1.0),
  ];

  divideTriangle(vertices[0], vertices[1], vertices[2], numTimesToSubdivide);

  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Load shaders and initialize attribute buffers
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Load the data into the GPU
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 50000, gl.STATIC_DRAW);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  thetaLoc = gl.getUniformLocation(program, "theta");

  document.getElementById("slider").onchange = function (event) {
    numTimesToSubdivide = parseInt(event.target.value);
  };

  document.body.addEventListener(
    "click",
    function (e) {
      colorIndex = (colorIndex + 1) % colors.length;
      points = [];
      colors = [];
      triangle(a, b, c, colorSet[colorIndex]);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        flatten(points.concat(colors)),
        gl.STATIC_DRAW
      );
    },
    false
  );

  window.addEventListener(
    "keydown",
    function (e) {
      if (e.key == " ") {
        changeDir = false;
        theta = 0.0;
      }
      if (e.key == "ArrowLeft") {
        changeDir = true;
      }
      if (e.key == "ArrowRight") {
        changeDir = false;
      }
    },
    false
  );

  render();
}

function triangle(a, b, c, color) {
  points.push(a, b, c);
  colors.push(colors[color], colors[color], colors[color]);
}

function divideTriangle(a, b, c, count) {
  // check for end of recursion
  if (count === 0) {
    triangle(a, b, c);
  } else {
    //bisect the sides
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    --count;

    // three new triangles
    divideTriangle(a, ab, ac, count);
    divideTriangle(c, ac, bc, count);
    divideTriangle(b, bc, ab, count);
  }
}

window.onload = init;

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  if (changeDir === false) {
    theta += 0.01;
  }
  if (changeDir === true) {
    theta -= 0.01;
  }
  console.log(theta);
  gl.uniform1f(thetaLoc, theta);
  gl.drawArrays(gl.TRIANGLES, 0, points.length);
  points = [];
  requestAnimFrame(init);
}
