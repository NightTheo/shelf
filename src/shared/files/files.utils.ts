import * as fs from 'fs';
import { unlink, writeFile } from 'fs';
import { StringsUtils } from '../strings/strings.utils';
import { FileException } from './file.exception';

export abstract class FilesUtils {
  public static fileToBuffer(filename: string): Promise<Buffer> {
    const readStream = fs.createReadStream(filename);
    const chunks = [];
    return new Promise((resolve, reject) => {
      readStream.on('error', (err) => {
        reject(err);
      });
      readStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      readStream.on('close', () => {
        resolve(Buffer.concat(chunks));
      });
    });
  }

  public static generateRandomNameFor(fileName: string, length = 15): string {
    return (
      StringsUtils.randomStringOfLength(length) +
      '.' +
      this.getTypeOfFileName(fileName)
    );
  }

  public static fileNameOfPath(path: string): string {
    if (!path) {
      throw new FileException(`Incorrect path '${path}'`);
    }
    return path.split('/').pop();
  }

  static getTypeOfFileName(name: string) {
    return this.fileNameOfPath(name).split('.').pop();
  }

  static getBaseOfFileName(name: string) {
    return this.fileNameOfPath(name).split('.').slice(0, -1).join('.');
  }

  static replace;

  static delete(localPath: string) {
    unlink(localPath, (e) => {
      if (e) {
        throw new FileException(`Unable to delete on local '${localPath}'.`);
      }
    });
  }

  static write(path: string, file: Buffer) {
    writeFile(path, file, (err) => {
      if (err) {
        throw new FileException(`Unable to write file '${path}'.`);
      }
    });
  }
}
