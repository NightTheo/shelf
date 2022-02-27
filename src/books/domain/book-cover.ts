import { FileLocation } from '../persistence/file-location';

export class BookCover {
  private readonly _file: Buffer;
  private _location: FileLocation;

  constructor(picture: Buffer, location: FileLocation) {
    this._file = picture;
    this._location = location;
  }

  get file(): Buffer {
    return this._file;
  }

  get location(): FileLocation {
    return this._location;
  }

  set location(location: FileLocation) {
    this._location = location;
  }

  public exists(): boolean {
    return this._file != null && this._location?.path != null;
  }
}
