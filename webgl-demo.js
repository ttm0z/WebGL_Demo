
import {initBuffers} from "./init-buffers.js";
import {drawScene} from "./draw-scene.js"

main();


function main() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl");

    if (gl === null) {
        alert("Unable to Initialize WEBGL");
        return
    }
    // vertex shader program -- GLSL

    const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;
    
    // fragment shader program -- GLSL
    const fsSource = `
        void main(){
            gl_FragColor = vec4(1.0,1.0,1.0,1.0);
        }
    `;

    // initialize the shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)
    
    // compile shader info
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            projectionMatrix:gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };


    const buffers = initBuffers(gl);
    drawScene(gl, programInfo, buffers);


}

function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program:
            ${gl.getProgramInfoLog(
                shaderProgram,
            )}`,
        );
        return null;
    }
    return shaderProgram;
}

function loadShader(gl, type, source){
    
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source)

    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders:
            ${gl.getShaderLogInfo(shader)}`,
            );
            gl.deleteShader(shader);
            return null;    
        }
        return shader
    }