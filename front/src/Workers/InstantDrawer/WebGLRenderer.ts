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
  private readonly _projectionMatrix: Float32Array;
  private readonly _programInfo: _ProgramInfo;
  private readonly _size: Vector2;
  private readonly _dpr: number;
  /**
   * ex: pointsToRender = [...p1, ...p2, ...p3];
   *
   * where p1, p2, and p3 are objects that conform to {x: number, y: number}
   * or [x: number, y: number];
   */
  private _pointsToRender: number[];

  constructor({
    canvas,
    size,
    devicePixelRatio,
  }: {
    canvas: OffscreenCanvas;
    size: Vector2;
    devicePixelRatio: number;
  }) {
    this._dpr = devicePixelRatio;
    this._gl = canvas.getContext("webgl2")!;
    this._canvas = canvas;

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

    const w = this._gl.canvas.width;
    const h = this._gl.canvas.height;
    this._projectionMatrix = this._projectionAndTranslation(w, h, w / 2, h / 2);
  }

  setPoints(pointsToRender: number[]) {
    this._pointsToRender = pointsToRender;
  }

  render(): void {
    this._gl.uniformMatrix3fv(
      this._programInfo.uniformLocations.uMatrix,
      false,
      this._projectionMatrix
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

  private _projectionAndTranslation(
    width: number,
    height: number,
    x: number,
    y: number
  ) {
    const dst = new Float32Array(9);

    const _x = (x / width) * 2 - 1;
    const _y = (y / height) * 2 - 1;

    dst[0] = 2 / width;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = -2 / height;
    dst[5] = 0;
    dst[6] = _x;
    dst[7] = _y;
    dst[8] = 1;

    return dst;
  }
}
