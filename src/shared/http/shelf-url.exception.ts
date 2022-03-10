export class ShelfUrlException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShelfUrlException';
  }
}
