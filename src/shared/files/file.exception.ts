export class FileException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileException';
  }
}
