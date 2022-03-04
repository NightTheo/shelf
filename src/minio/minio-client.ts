import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as Minio from 'minio';
import * as fs from 'fs';
import { config } from './config';
import { FileLocation } from '../shared/files/file-location';
import { File } from '../shared/files/file';
import { FileException } from '../shared/files/file.exception';
import { FilesUtils } from '../shared/files/files.utils';

const mime = require('mime-types');

@Injectable()
export class MinioClient {
  private readonly bucket = config.MINIO_BUCKET;

  public get minio(): Minio.Client {
    return this.minioService.client;
  }

  constructor(private readonly minioService: MinioService) {}

  public async upload(directory: string, file: File): Promise<FileLocation> {
    const newName: string = FilesUtils.generateRandomNameFor(
      file.location.path,
    );
    const path: string = `${directory}/${newName}`;
    const metaData = { 'Content-Type': mime.lookup(path) };
    try {
      await this.minio.putObject(this.bucket, path, file.file, metaData);
    } catch (e) {
      throw new FileException(
        `MinioError[${e}]. Unable to save file ${path} in MinIO.`,
      );
    }
    return new FileLocation(path);
  }

  delete(location: FileLocation): void {
    this.minio.removeObject(this.bucket, location.path, (err) => {
      if (err) {
        throw new FileException(
          `MinioError[${err}]. Unable to delete file '${location.path}'.`,
        );
      }
    });
  }

  async download(
    localDirectory: string,
    objetName: string,
    bucket: string = this.bucket,
  ): Promise<File> {
    const name: string = FilesUtils.fileNameOfPath(objetName);
    const localPath: string = `${localDirectory}/${name}`;
    return new Promise(async (resolve) => {
      fs.mkdirSync(localDirectory, { recursive: true });
      this.minio.fGetObject(bucket, objetName, localPath, async (err) => {
        if (err) {
          throw new FileException(`MinioError[${err}]. Unable to delete file.`);
        }
        const picture: Buffer = await FilesUtils.fileToBuffer(localPath);
        FilesUtils.delete(localPath);
        resolve(new File(picture, new FileLocation(localPath)));
      });
    });
  }
}
