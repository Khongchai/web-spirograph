// TODO :
// Simplify API find a way to simplify things further
// Managed mode, where the lib manages all canvas transformations.
// Check if the listeners are actually being removed.
// TODO another level of abstraction above this.
// TODO :
// Simplify API find a way to simplify things further
// Managed mode, where the lib manages all canvas transformations.
// Check if the listeners are actually being removed.
// TODO another level of abstraction above this.
class PetiteTransform {
  /**
   * @type {() => {x: number, y: number, z: number}} `x` is the x offset, `y` the y offset, and `z` the zoom scale.
   */
  #getTransformReference;
  /**
   * @type {{max: number, min: number}}
   */
  #zoomSettings;
  // TODO
  #easeFactor = 1;
  /**
   * @type {HTMLElement}
   */
  #eventTarget;
  #cumulatedTransform = {
    dx: 0,
    dy: 0,
    dz: 1,
    total: {
      _parent: this,
      pos: { x: 0, y: 0, z: 1 },
      update: function ({ dx, dy, dz }) {
        // Apply translation first.
        // This is the dot product of the existing matrix and the incoming matrix.
        this.pos.x += dx * this.pos.z;
        this.pos.y += dy * this.pos.z;
        this.pos.z *= dz;

        // Don't return if is identity transform
        const iTransform = !dx && !dy && dz === 1;
        if (!iTransform) {
          this._parent.#onUpdateListeners.forEach((f) =>
            f({
              absolute: {
                ...this.pos,
              },
              relative: {
                dx,
                dy,
                dz,
              },
            })
          );
        }
      },
    },
    /**
     * Self-explanatory.
     *
     * @type {(x?: number, y?: number, z?: number) => void}
     */
    setTransform: function (x = this.dx, y = this.dy, z = this.dz) {
      this.dx = x;
      this.dy = y;
      this.dz = z;
    },
    /**
     * Like `setTransform`, but instead of replacing the values, increment them instead.
     *
     * This is to cache all values in-between frames when called from an animation loop.
     *
     * @type {(x?: number, y?: number, z?: number) => void}
     */
    setTransformIncrement: function (x = 0, y = 0, z = 0) {
      this.dx += x;
      this.dy += y;
      this.dz += z;
    },
    /**
     * Spoonfeed the client only once and then close until more values are set.
     * This is to prevent any translation method in an animation frame from applying the
     * same transform twice. If you need the same transform in multiple places, store it in a variable somewhere.
     *
     * @type {(type: "relative" | "absolute") => {dx: number, dy: number, dz: number}}
     */
    getTransform: function (type) {
      const returnVal = { dx: this.dx, dy: this.dy, dz: this.dz };

      this.dx = 0;
      this.dy = 0;
      this.dz = 1;

      this.total.update(returnVal);

      return type === "relative" ? returnVal : this.total.pos;
    },
  };
  #isMouseDown = false;
  #panOffset = {
    prev: {
      x: 0,
      y: 0,
    },
    cur: {
      x: 0,
      y: 0,
    },
  };
  /**
   * @type {{type: string, callback: () => any}[]}
   */
  #listenersRefs = [];
  /**
   * @type {(({absolute: {x: number, y: number, z: number}, relative: {dx: number, dy: number, dz: number}}) => any)[]}
   */
  #onUpdateListeners = [];

  /**
   *
   * @param {{transformReference?: () => {x: number, y: number, z: number}, devicePixelRatio?: number, easeFactor?: 1, manageZoom?: boolean, managePan?: boolean, zoomSettings?: {max: number, min: number}}}
   * `transformReference` a callback that returns the current transform of the canvas.
   * This sets up the two different modes, the relative mode, which uses the reference to the current transform outside
   * the control of this canvas, and the absolute mode, which does not care about anything else and will treat itself as the source of the transformational truth.
   * `devicePixelRatio` The device pixel ratio that you set your canvas to. It is
   * vital that this matches what you have set for your canvas.
   * `easeFactor` the t in (a + (b - a) * t) of the linear interpolation equation.
   * where t is <= 1 and >= 0. If t is less than 1, repeated call to the `currenTransform` method will yield
   * a different value.
   * `manageZoom` whether or not to have this set up the zoom listener.
   * `managePan` whether or not to have this set up the pan listener.
   * `eventTarget` target to attach the event listener to.
   */
  constructor({
    transformReference,
    devicePixelRatio = 1,
    easeFactor = 1,
    managePan = true,
    manageZoom = true,
    eventTarget = document,
    zoomSettings = {
      max: Number.POSITIVE_INFINITY,
      min: Number.NEGATIVE_INFINITY,
    },
  }) {
    this.#zoomSettings = zoomSettings;
    this.#easeFactor = easeFactor;
    if (transformReference) {
      this.#getTransformReference = transformReference;
    } else {
      const total = this.#cumulatedTransform.total;
      this.#getTransformReference = () => ({
        x: total.pos.x,
        y: total.pos.y,
        z: total.pos.z,
      });
    }

    this.#eventTarget = eventTarget;

    this.#cumulatedTransform.setTransform(0, 0, 1);

    if (managePan) {
      this.#addEventListener("mousedown", (e) => {
        this.#onmousedown({
          x: e.x * devicePixelRatio,
          y: e.y * devicePixelRatio,
        });
      });

      this.#addEventListener("mousemove", (e) => {
        this.#onpan({
          x: e.x * devicePixelRatio,
          y: e.y * devicePixelRatio,
        });
      });

      this.#addEventListener("mouseup", (e) => {
        this.#onmouseup({
          x: e.x * devicePixelRatio,
          y: e.y * devicePixelRatio,
        });
      });
    }

    if (manageZoom) {
      this.#addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();

          this.#onZoom({
            x: e.x * devicePixelRatio,
            y: e.y * devicePixelRatio,
            deltaY: e.deltaY,
          });
        },
        { passive: false }
      );
    }
  }

  /**
   * Call this when you would like to remove all event listeners.
   */
  dispose() {
    this.#listenersRefs.forEach((obj) =>
      this.#eventTarget.removeEventListener(obj.type, obj.callback, obj.options)
    );
    this.#onUpdateListeners = [];
  }

  /**
   * Returns a change in the transform.
   *
   * Note that if you use a method that resets the transformation matrix
   * like `ctx.setTransform` instead of something like `ctx.transform` or
   * `ctx.translate`, the transformations will not work correctly.
   *
   * For something to use with the former, please refer to `currentAbsolteTransform`.
   *
   * @type {() => {dx: number, dy: number, dz: number}}
   */
  get currentRelativeTransform() {
    return this.#cumulatedTransform.getTransform("relative");
  }

  /**
   * Returns the absolute, cumulated transform throughout the lifecyle of this canvas.
   *
   * Useful for when you want to sync multiple canvases to one transform while switching between them as this can be treated as the source of truth.
   *
   * But kind of useless if the `transformReference` is set to a non-null value (the source of truth is not this anymore and the value won't be accurate).
   *
   * @returns {{x: number, y: number, z: number}}
   */
  get currentAbsoluteTransform() {
    return this.#cumulatedTransform.getTransform("absolute");
  }

  #addEventListener(type, callback, options) {
    this.#eventTarget.addEventListener(type, callback, options);
    this.#listenersRefs.push({ type, callback, options });
  }

  /**
   * @param {{x: number, y: number}} e
   */
  #onmousedown(e) {
    this.#isMouseDown = true;
    this.#panOffset.prev.x = e.x - this.#panOffset.cur.x;
    this.#panOffset.prev.y = e.y - this.#panOffset.cur.y;
  }

  #onmouseup() {
    this.#isMouseDown = false;
  }

  /**
   * @param {{x: number, y: number}} e
   */
  #onpan(e) {
    if (this.#isMouseDown) {
      const dx = e.x - this.#panOffset.prev.x;
      const dy = e.y - this.#panOffset.prev.y;

      const worldDx = dx / this.#getTransformReference().z;
      const worldDy = dy / this.#getTransformReference().z;
      this.#panOffset.prev.x = e.x;
      this.#panOffset.prev.y = e.y;

      this.#cumulatedTransform.setTransformIncrement(worldDx, worldDy);
    }
  }

  /**
   * @param {{x: number, y: number, deltaY: number}} e
   */
  #onZoom(e) {
    const change = -e.deltaY * 0.0005;
    const { x, y, z } = this.#getTransformReference();

    // Grab the world space position of the cursor so that we can calculate
    // later how much to offset the canvas by after zooming.
    const wt = {
      dx: ((x - e.x) * change) / z,
      dy: ((y - e.y) * change) / z,
      dz: 1 + change,
    };

    const { max, min } = this.#zoomSettings;
    const futureZoom = wt.dz * z;
    if (max < futureZoom || min > futureZoom) {
      return;
    }

    this.#cumulatedTransform.setTransform(wt.dx, wt.dy, wt.dz);
  }

  disposeAdditionalListener(callback) {
    this.#onUpdateListeners = this.#onUpdateListeners.filter(
      (thing) => thing != callback
    );
  }

  /**
   * Attach additional listners that wants to receive the information about the transformation being applied to the current matrix.
   *
   * @param {({absolute: {x: number, y: number, z: number}, relative: {dx: number, dy: number, dz: number}}) => void} callback always return the change for the current transform in world space.
   * 0 will be returned for dx and dy when no changes are made in the axis, and 1 for dz (eg. in the case of panning).
   */
  onUpdate(callback) {
    this.#onUpdateListeners.push(callback);
  }
}

const canvasTransformer = {
  /**
   * Initialize the absolute version.
   * @type {PetiteTransform}
   */
  _instance: new PetiteTransform({
    devicePixelRatio,
    // Mark as absolute.
    transformReference: null,
    zoomSettings: {
      max: 10,
      min: 0.1,
    },
  }),

  getAbsoluteTransform: function () {
    return this._instance.currentAbsoluteTransform;
  },

  /**
   *
   * @param {(CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D)[]} contexts
   */
  updateOnTransform: function (contexts) {
    this._instance.onUpdate(({ absolute, relative: _ }) => {
      contexts.forEach((ctx) => {
        this.clearCanvas(ctx);

        const { x, y, z } = absolute;
        ctx.setTransform(z, 0, 0, z, x, y);
      });
    });
  },

  /**
   *
   * @param {({absolute: {x: number, y: number, z: number,}, relative: {dx: number, dy: number, dz: number}}) => any} callback
   */
  onTransform: function (callback) {
    this._instance.onUpdate(callback);
  },

  /**
   * @param {CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D} ctx
   */
  clearCanvas: function (ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(
      0,
      0,
      window.innerWidth * devicePixelRatio,
      window.innerHeight * devicePixelRatio
    );
    ctx.restore();
  },

  /**
   * Dispose only the given additional callback.
   * @param {({absolute: {x: number, y: number, z: number,}, relative: {dx: number, dy: number, dz: number}}) => any} callback
   */
  disposeListener: function (callback) {
    this._instance.disposeAdditionalListener(callback);
  },
};

function forcedLoop() {
  canvasTransformer.getAbsoluteTransform();
  requestAnimationFrame(forcedLoop);
}

forcedLoop();

export default canvasTransformer;
