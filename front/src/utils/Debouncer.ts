export class Debouncer {
  private _timeoutHandle: any;

  debounce(callback: VoidFunction, milliseconds: number) {
    clearTimeout(this._timeoutHandle);
    this._timeoutHandle = setTimeout(callback, milliseconds);
  }
}
