export class LibraryIdFormatException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LibraryIdFormatException';
  }
}
