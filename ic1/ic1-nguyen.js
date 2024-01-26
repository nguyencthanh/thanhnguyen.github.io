/*
ic1-nguyen.js
Thanh Nguyen
*/

//Global Variables
var gl;
var points;

window.onload = function init() {
    //Grab the canvas object and initialize it 
    let canvas = document.getElementById('gl-canvas');
    gl = WebGLUtils.setupWebGL(canvas);

    //Error Checking
    if (!gl) {
        alert('WebGL unavailable');
    }

    //Triangle Vertices
    let vertices = [vec2(0, 0), vec2(0, 1), vec2(1, 0)];

    //Configure WebGL
    gl.viewport(0, 0, canvas.clientWidth, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //Load Shaders and Initialize Attribute Buffers
    let program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    //Load Data into GPU
    let bufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    //Set its Position and Render it
    var vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    render();
};

//Render Our gl Variable
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}