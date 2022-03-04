import { BookCoverRepository } from './book-cover.repository';
import { FileLocation } from '../../shared/files/file-location';
import { BookCover } from '../domain/book-cover';
import { MinioClient } from '../../minio/minio-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookCoverMinioRepository implements BookCoverRepository {
  readonly bookCoverDirectory: string = 'books/cover';
  private readonly localDirectory: string = 'storage/books/cover';

  constructor(private minio: MinioClient) {}

  delete(coverLocation: FileLocation) {
    this.minio.delete(coverLocation);
  }

  async findAt(location: FileLocation): Promise<BookCover> {
    return await this.minio.download(this.localDirectory, location.path);
  }

  async save(bookCover: BookCover): Promise<FileLocation> {
    return this.minio.upload(this.bookCoverDirectory, bookCover);
  }
}
