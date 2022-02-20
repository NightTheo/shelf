import { BufferFile } from '../exposition/controller/buffer-file';

export class BookCover {
  private readonly _file: BufferFile;

  constructor(picture: BufferFile) {
    this._file = picture;
  }

  get file(): BufferFile {
    return this._file;
  }
}
