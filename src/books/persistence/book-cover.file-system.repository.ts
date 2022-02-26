import { BookCoverRepository } from './book-cover.repository';
import { BookCover } from '../domain/book-cover';
import { unlink, writeFile } from 'fs';
import { FilesUtils } from '../../utils/files/files.utils';
import { FileLocation } from './file-location';
import { FileException } from '../../utils/files/file.exception';

export class BookCoverFileSystemRepository implements BookCoverRepository {
  private readonly bookCoverDirectory = 'storage/books/cover';

  save(bookCover: BookCover): FileLocation {
    const newFileName = FilesUtils.generateRandomNameFor(
      bookCover.location?.path,
    );
    const path = `${this.bookCoverDirectory}/${newFileName}`;
    writeFile(path, bookCover.file, (err) => {
      if (err) {
        throw new FileException(`Unable to write file '${path}'`);
      }
    });
    return new FileLocation(path);
  }

  async findAt(location: FileLocation): Promise<BookCover> {
    const picture: Buffer = await FilesUtils.fileToBuffer(location.path);
    return new BookCover(picture, location);
  }

  delete(coverLocation: FileLocation) {
    unlink(coverLocation.path, (err) => {
      if (err) {
        throw new FileException(
          `Unable to delete file '${coverLocation.path}'`,
        );
      }
    });
  }
}
