export class UuidVersionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UuidVersionException';
  }
}
