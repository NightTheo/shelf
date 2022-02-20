import { BookCoverRepository } from '../domain/book-cover.repository';
import { BookCover } from '../domain/book-cover';
import { createWriteStream, write, writeFile } from 'fs';
import { StringsUtils } from '../../utils/strings.utils';
import { FilesUtils } from '../../utils/files.utils';

export class BookCoverFileSystemRepository implements BookCoverRepository {
  private readonly bookCoverDirectory = 'storage/books/cover';

  /**
   * @return Path of the saved file
   */
  save(bookCover: BookCover): string {
    const newFileName = FilesUtils.generateRandomNameFor(
      bookCover.file.originalname,
    );
    const path = `${this.bookCoverDirectory}/${newFileName}`;
    writeFile(path, bookCover.file.buffer, (err) => {
      if (err) return console.log(err);
    });
    return path;
  }
}
