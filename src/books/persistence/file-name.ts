import { FilesUtils } from '../../shared/files/files.utils';
import { FileLocation } from './file-location';

export class FileName {
  private _base: string;
  private readonly _type: string;

  private constructor(fullName: string) {
    this._type = FilesUtils.getTypeOfFileName(fullName);
    this._base = FilesUtils.getBaseOfFileName(fullName);
  }

  static fromLocation(location: FileLocation): FileName {
    return new FileName(location.path);
  }

  set base(base: string) {
    this._base = base;
  }

  toString() {
    return this._base + '.' + this._type;
  }
}
