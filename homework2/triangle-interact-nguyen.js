/*
triangle.js
Thanh Nguyen
*/

//Global variables we'll need
var gl;
var points;
let [x, y, theta] = [0.0, 0.0, 0.0];
let xLoc, yLoc, thetaLoc;
let dirs = [null, null, null]; //Horizontal, Vertical, Rotation
let s, c;

//This function executes our WebGL code AFTER the window is loaded.
//Meaning, that we wait for our canvas element to exist.
window.onload = function init() {
  // Grab the canvas object and initialize it
  var canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);

  //Error checking
  if (!gl) {
    alert("WebGL unavailable");
  }

  //Triangle vertices
  var vertices = [vec2(-0.25, -0.25), vec2(0, 0.25), vec2(0.25, -0.25)];

  //Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //Load shaders and initialize attribute buffers
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  //Add an Event Listener
  window.addEventListener(
    "keydown",
    function (e) {
      console.log("Key: " + e.keyCode);
      if (e.key == "ArrowLeft") {
        //Left
        dirs[0] = false;
        console.log("theta: " + theta);
      } else if (e.key == "ArrowRight") {
        //Right
        dirs[0] = true;
      } else if (e.key == "ArrowUp") {
        //Up
        dirs[1] = true;
      } else if (e.key == "ArrowDown") {
        //Down
        dirs[1] = false;
      } else if (e.key == " ") {
        //Space
        dirs[0] = null;
        dirs[1] = null;
        console.log("theta: " + theta);
      }
    },
    false
  );

  //Linking to shaders
  xLoc = gl.getUniformLocation(program, "x");
  yLoc = gl.getUniformLocation(program, "y");
  thetaLoc = gl.getUniformLocation(program, "theta");

  //Load data into GPU
  var bufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  //Set its position and render it
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  render();
};

//Render whatever is in our gl variable
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  if (dirs[0] === true) {
    x += 0.01; //Move right
    if (dirs[2] === true) {
      theta -= 0.01;
    }
  } else if (dirs[0] === false) {
    x -= 0.01; //Move left
    if (dirs[2] === true) {
      theta += 0.01;
    }
  }

  if (dirs[1] === true) {
    y += 0.01; //Move up
  } else if (dirs[1] === false) {
    y -= 0.01; //Move down
  }
  gl.uniform1f(xLoc, x);
  gl.uniform1f(yLoc, y);
  gl.uniform1f(thetaLoc, theta);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  window.requestAnimationFrame(render);
}
