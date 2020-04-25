export default class SafeError extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
    this.isSafeError = true;
  }
}
