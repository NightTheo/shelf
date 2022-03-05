import { Injectable } from '@nestjs/common';
import { LibraryRepositoryTypeORM } from '../persistence/library.repository.typeorm';
import { LibraryId } from '../domain/library-id/library-id';
import { Library } from '../domain/library/library';
import { Book } from '../domain/book/book';
import { BookRepositoryShelfApi } from '../persistence/book.repository.shelf-api';

@Injectable()
export class LibrariesService {
  constructor(
    private libraryRepository: LibraryRepositoryTypeORM,
    private bookRepository: BookRepositoryShelfApi,
  ) {}

  async create(isbnList?: string[]): Promise<LibraryId> {
    const id: LibraryId = this.getUniqueLibraryId();
    const books: Book[] = await this.getBooksByIsbnList(isbnList);
    this.libraryRepository.create(new Library(id, books));
    return Promise.resolve(id);
  }

  private getUniqueLibraryId(): LibraryId {
    let id: LibraryId = new LibraryId();
    while (this.libraryRepository.findOne(id)) {
      id = new LibraryId();
    }
    return id;
  }

  private async getBooksByIsbnList(isbnList: string[]): Promise<Book[]> {
    return !isbnList
      ? []
      : await Promise.all(
          isbnList.map((isbn) => this.bookRepository.findOne(isbn)),
        );
  }
}
