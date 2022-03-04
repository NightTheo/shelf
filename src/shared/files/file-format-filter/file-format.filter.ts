import { FileFormatException } from '../file-format.exception';
import { BufferFile } from '../buffer-file';

export class FileFormatFilter {
  static of(formats: string[]) {
    return (
      req: any,
      file: BufferFile,
      callback: (res: any, isAllowed: boolean) => void,
    ) => {
      formats = formats?.map((f) => f.toLowerCase());
      const allowed: RegExp = new RegExp(`\.(${formats.join('|')})$`, 'g');
      if (!file.originalname?.toLocaleLowerCase().match(allowed)) {
        return callback(
          new FileFormatException(
            `The format of the file '${
              file.originalname
            }' is not allowed. Accepted formats are ${
              formats?.join(', ') || ''
            }.`,
          ),
          false,
        );
      }
      callback(null, true);
    };
  }
}
