export class Throttler {
  private _timeoutHandle: any;

  throttle(callback: VoidFunction, milliseconds: number) {
    clearTimeout(this._timeoutHandle);
    this._timeoutHandle = setTimeout(callback, milliseconds);
  }
}
