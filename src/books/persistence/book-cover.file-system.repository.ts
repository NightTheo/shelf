import { BookCoverRepository } from './book-cover.repository';
import { BookCover } from '../domain/book-cover';
import { createWriteStream, write, writeFile } from 'fs';
import { StringsUtils } from '../../utils/strings.utils';
import { FilesUtils } from '../../utils/files.utils';
import { Isbn } from '../domain/isbn';
import { FileLocation } from './file-location';
import { BufferFile } from '../exposition/controller/buffer-file';

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

  async findAt(location: FileLocation): Promise<BookCover> {
    const picture: BufferFile = await FilesUtils.fileToBufferFile(
      location.path,
    );
    return new BookCover(picture, location);
  }
}
