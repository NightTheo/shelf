import { BufferFile } from '../exposition/controller/buffer-file';
import { FileLocation } from '../persistence/file-location';

export class BookCover {
  private readonly _file: BufferFile;
  private readonly _location: FileLocation;

  constructor(picture: BufferFile, location: FileLocation) {
    this._file = picture;
    this._location = location;
  }

  get file(): BufferFile {
    return this._file;
  }

  get location(): FileLocation {
    return this._location;
  }

  public exists(): boolean {
    return this._file.filename != null;
  }
}
