import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import Renderer from "../Renderer";

interface _ProgramInfo {
  program: WebGLProgram;
  attributeLocations: {
    aPosition: number;
  };
  uniformLocations: {
    uWorldSpaceMatrix: WebGLUniformLocation | null;
    uOriginMatrix: WebGLUniformLocation | null;
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
  private readonly _baseMatrix: Float32Array;
  private _latestTransformationMatrix = { x: 0, y: 0, z: 1 };
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
    this._baseMatrix = new Float32Array(new Array(9).fill(0));

    const vsSource = `
    attribute vec2 a_position;
    uniform vec2 u_originMatrix;
    uniform mat3 u_matrix;

    void main() {
        gl_Position = vec4((u_matrix * vec3(a_position + u_originMatrix, 1)).xy, 0, 1);
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
        uWorldSpaceMatrix: this._gl.getUniformLocation(
          shaderProgram,
          "u_matrix"
        ),
        uOriginMatrix: this._gl.getUniformLocation(
          shaderProgram,
          "u_originMatrix"
        ),
      },
    };

    this._size = size;
    this.resize(this._size.x, this._size.y, undefined, false);
    this.setTransformation(initialTransformation);

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

  setTransformation(mat?: { x: number; y: number; z: number }): void {
    if (!mat) {
      mat = this._latestTransformationMatrix;
    } else {
      this._latestTransformationMatrix = mat;
    }
    const { x, y, z } = mat;

    const width = this._gl.canvas.width;
    const height = this._gl.canvas.height;

    const tW = 2 / width;
    const tH = 2 / height;

    this._baseMatrix[0] = 1 * tW * z;
    this._baseMatrix[4] = -1 * tH * z;
    this._baseMatrix[6] = (x - width / 2) * tW;
    this._baseMatrix[7] = -(y - height / 2) * tH;
  }

  setPoints(pointsToRender: Float64Array): void {
    this._pointsToRender = pointsToRender;
  }

  render(): void {
    this._gl.uniformMatrix3fv(
      this._programInfo.uniformLocations.uWorldSpaceMatrix,
      false,
      this._baseMatrix
    );
    this._gl.uniform2fv(
      this._programInfo.uniformLocations.uOriginMatrix,
      new Float32Array([this._gl.canvas.width / 2, this._gl.canvas.height / 2])
    );
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(this._pointsToRender),
      this._gl.STATIC_DRAW
    );

    // Not much difference between LINES and LINE_STRIP
    this._gl.drawArrays(this._gl.LINES, 0, this._pointsToRender.length / 2);
  }

  resize(
    newWidth: number,
    newHeight: number,
    dpr?: number,
    setTransform = true
  ): void {
    this._canvas.width = newWidth * (dpr ?? this._dpr);
    this._canvas.height = newHeight * (dpr ?? this._dpr);
    this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);
    if (setTransform) {
      this.setTransformation();
    }
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
