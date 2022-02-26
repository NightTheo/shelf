import { BookCoverRepository } from './book-cover.repository';
import { BookCover } from '../domain/book-cover';
import { createWriteStream, write, writeFile } from 'fs';
import { StringsUtils } from '../../utils/strings.utils';
import { FilesUtils } from '../../utils/files/files.utils';
import { Isbn } from '../domain/isbn';
import { FileLocation } from './file-location';
import { BufferFile } from '../exposition/controller/buffer-file';

export class BookCoverFileSystemRepository implements BookCoverRepository {
  private readonly bookCoverDirectory = 'storage/books/cover';

  save(bookCover: BookCover): FileLocation {
    const newFileName = FilesUtils.generateRandomNameFor(
      bookCover.location.path,
    );
    const path = `${this.bookCoverDirectory}/${newFileName}`;
    writeFile(path, bookCover.file, (err) => {
      if (err) return console.log(err);
    });
    return new FileLocation(path);
  }

  async findAt(location: FileLocation): Promise<BookCover> {
    const picture: Buffer = await FilesUtils.fileToBuffer(location.path);
    return new BookCover(picture, location);
  }
}
