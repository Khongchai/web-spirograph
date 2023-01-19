import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import Renderer from "../Renderer";

interface _ProgramInfo {
  program: WebGLProgram;
  attributeLocations: {
    aPosition: number;
  };
  uniformLocations: {
    uMatrix: WebGLUniformLocation | null;
  };
}

/**
 * Usage:
 *
 * ```ts
 *  const renderer = WebGLMultiLinesRenderer(...);
 *  renderer.setPoints([...]);
 *  renderer.render();
 * ```
 */
export default class WebGLMultiLinesRenderer implements Renderer {
  private readonly _gl: WebGL2RenderingContext;
  private readonly _canvas: OffscreenCanvas;
  private readonly _programInfo: _ProgramInfo;
  private readonly _size: Vector2;
  private readonly _dpr: number;
  private readonly _3dMatrix: Float32Array;
  /**
   * ex: pointsToRender = [...p1, ...p2, ...p3];
   *
   * where p1, p2, and p3 are objects that conform to {x: number, y: number}
   * or [x: number, y: number];
   */
  private _pointsToRender: Float64Array;

  constructor({
    canvas,
    size,
    devicePixelRatio,
    initialTransformation = { x: 0, y: 0, z: 1 },
  }: {
    canvas: OffscreenCanvas;
    size: Vector2;
    devicePixelRatio: number;
    initialTransformation?: { x: number; y: number; z: number };
  }) {
    this._dpr = devicePixelRatio;
    this._gl = canvas.getContext("webgl2")!;
    this._canvas = canvas;

    // Set initial transform.
    this._3dMatrix = new Float32Array(new Array(9).fill(0));
    this.applyInitialTransformation(initialTransformation);

    const vsSource = `
    attribute vec2 a_position;

    uniform mat3 u_matrix;

    void main() {
        gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    }
    `;
    const fSource = `
    precision highp float;
    void main() {
          gl_FragColor = vec4(191.0 / 255.0, 134.0 / 255.0, 252.0 / 255.0, 99.0 / 255.0);
        }
    `;

    const shaderProgram = this._initShaderProgram(this._gl, vsSource, fSource);
    this._programInfo = {
      program: shaderProgram,
      attributeLocations: {
        aPosition: this._gl.getAttribLocation(shaderProgram, "a_position"),
      },
      uniformLocations: {
        uMatrix: this._gl.getUniformLocation(shaderProgram, "u_matrix"),
      },
    };

    this._size = size;
    this.resize(this._size.x, this._size.y);
    // TODO think about how to restructure this code better.
    this.applyInitialTransformation();

    this._gl.useProgram(this._programInfo.program);

    const positionBuffer = this._gl.createBuffer();
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer);
    this._gl.vertexAttribPointer(
      this._programInfo.attributeLocations.aPosition,
      2,
      this._gl.FLOAT,
      false,
      0,
      0
    );
    this._gl.enableVertexAttribArray(
      this._programInfo.attributeLocations.aPosition
    );
  }

  private applyInitialTransformation(mat = { x: 0, y: 0, z: 1 }) {
    const width = this._gl.canvas.width;
    const height = this._gl.canvas.height;

    const tW = 2 / width;
    const tH = 2 / height;

    this._3dMatrix[0] = 1 * tW;
    this._3dMatrix[4] = -1 * tH;
    this._3dMatrix[6] = mat.x * tW;
    this._3dMatrix[7] = mat.y * tH;
  }

  applyTransformation(mat = { dx: 0, dy: 0, dz: 1 }): void {
    const width = this._gl.canvas.width;
    const height = this._gl.canvas.height;

    const tW = 2 / width;
    const tH = 2 / height;

    this._3dMatrix[0] *= mat.dz;
    this._3dMatrix[4] *= mat.dz;
    this._3dMatrix[6] += mat.dx * tW;
    this._3dMatrix[7] -= mat.dy * tH;

    // const width = this._gl.canvas.width;
    // const height = this._gl.canvas.height;

    // const tW = 2 / width;
    // const tH = 2 / height;

    // const dommatrix1 = new DOMMatrix([
    //   this._3dMatrix[0],
    //   0,
    //   0,
    //   this._3dMatrix[4],
    //   this._3dMatrix[6],
    //   this._3dMatrix[7],
    // ]);
    // const dommatrix2 = new DOMMatrix([mat.dz, 0, 0, mat.dz, mat.dx, mat.dy]);
    // dommatrix1.multiplySelf(dommatrix2);

    // this._3dMatrix[0] = dommatrix1.a;
    // this._3dMatrix[4] = dommatrix1.d;
    // this._3dMatrix[6] = dommatrix1.e;
    // this._3dMatrix[7] = dommatrix1.f;
  }

  setPoints(pointsToRender: Float64Array): void {
    this._pointsToRender = pointsToRender;
  }

  render(): void {
    this._gl.uniformMatrix3fv(
      this._programInfo.uniformLocations.uMatrix,
      false,
      this._3dMatrix
    );
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(this._pointsToRender),
      this._gl.STATIC_DRAW
    );

    // Not much difference between LINES and LINE_STRIP
    this._gl.drawArrays(this._gl.LINES, 0, this._pointsToRender.length / 2);
  }

  resize(newWidth: number, newHeight: number, dpr?: number): void {
    this._canvas.width = newWidth * (dpr ?? this._dpr);
    this._canvas.height = newHeight * (dpr ?? this._dpr);
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    this.applyTransformation();
  }

  protected _initShaderProgram(
    gl: WebGL2RenderingContext,
    vSource: string,
    fSource: string
  ): WebGLProgram {
    const vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, vSource);
    const fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, fSource);

    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    return shaderProgram;
  }

  protected _loadShader(
    gl: WebGLRenderingContext,
    shaderType: number,
    shaderSource: string
  ): WebGLShader {
    const shader = gl.createShader(shaderType)!;
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    return shader;
  }
}
