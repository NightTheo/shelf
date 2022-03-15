import { FileException } from './file.exception';

export class FileFormatException extends FileException {
  constructor(message: string) {
    super(message);
    this.name = 'FileFormatException';
  }
}
