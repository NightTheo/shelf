import { BookCoverRepository } from './book-cover.repository';
import { BookCover } from '../domain/book-cover';
import { FilesUtils } from '../../shared/files/files.utils';
import { FileLocation } from '../../shared/files/file-location';

export class BookCoverFileSystemRepository implements BookCoverRepository {
  readonly bookCoverDirectory: string = 'storage/books/cover';

  save(bookCover: BookCover): Promise<FileLocation> {
    const newFileName = FilesUtils.generateRandomNameFor(
      bookCover.location?.path,
    );
    const path = `${this.bookCoverDirectory}/${newFileName}`;
    FilesUtils.write(path, bookCover.file);
    return Promise.resolve(new FileLocation(path));
  }

  async findAt(location: FileLocation): Promise<BookCover> {
    const picture: Buffer = await FilesUtils.fileToBuffer(location.path);
    return new BookCover(picture, location);
  }

  delete(coverLocation: FileLocation) {
    FilesUtils.delete(coverLocation.path);
  }
}
