export class Throttler {
  timeoutHandle: any;

  throttle(callback: VoidFunction, milliseconds: number) {
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(callback, milliseconds);
  }
}
