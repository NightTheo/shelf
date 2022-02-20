import * as fs from 'fs';
import { StringsUtils } from './strings.utils';

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
      fileName.split('.').pop()
    );
  }
}
