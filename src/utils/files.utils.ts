import * as fs from 'fs';
import { StringsUtils } from './strings.utils';
import { BufferFile } from '../books/exposition/controller/buffer-file';
const mime = require('mime-types');

export abstract class FilesUtils {
  public static fileToBuffer(filename: string): Promise<Buffer> {
    const readStream = fs.createReadStream(filename);
    const chunks = [];
    return new Promise((resolve, reject) => {
      readStream.on('error', (err) => {
        console.log('ERROR FS');
        reject(err);
      });
      readStream.on('data', (chunk) => {
        console.log('DATA FS');
        chunks.push(chunk);
      });
      readStream.on('close', () => {
        console.log('CLOSE FS');
        resolve(Buffer.concat(chunks));
      });
    });
  }

  public static async fileToBufferFile(filename: string): Promise<BufferFile> {
    const buffer: Buffer = await this.fileToBuffer(filename);
    return {
      buffer: buffer,
      encoding: null,
      fieldname: null,
      filename: this.fileNameOfPath(filename),
      mimetype: mime.lookup(filename),
      originalname: filename,
      size: buffer.length,
    };
  }

  public static generateRandomNameFor(fileName: string, length = 15): string {
    return (
      StringsUtils.randomStringOfLength(length) +
      '.' +
      fileName.split('.').pop()
    );
  }

  private static fileNameOfPath(path: string) {
    return path.split('/').pop();
  }
}
