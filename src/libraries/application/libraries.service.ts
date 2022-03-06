import { Injectable } from '@nestjs/common';
import { LibraryRepositoryTypeORM } from '../persistence/library.repository.typeorm';
import { LibraryId } from '../domain/library-id/library-id';
import { Library } from '../domain/library/library';
import { Book } from '../domain/book/book';
import { BookRepositoryShelfApi } from '../persistence/book.repository.shelf-api';
import { LibraryNotFoundException } from './exceptions/library.not-found.exception';
import { BookNotFoundException } from './exceptions/book.not-found.exception';
import { UpdateLibraryBooksDto } from '../dto/update-library-books.dto';

@Injectable()
export class LibrariesService {
  constructor(
    private libraryRepository: LibraryRepositoryTypeORM,
    private bookRepository: BookRepositoryShelfApi,
  ) {}

  async createWithListOfIsbn(isbnList?: string[]): Promise<LibraryId> {
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
    if (!isbnList) return [];
    return await Promise.all(
      isbnList.map(async (isbn) => {
        const book: Book = await this.bookRepository.findOne(isbn);
        if (!book) {
          throw new BookNotFoundException(isbn);
        }
        return book;
      }),
    );
  }

  private async getBookByIsbn(isbn: string): Promise<Book> {
    const books: Book[] = await this.getBooksByIsbnList([isbn]);
    return books[0];
  }

  async addBooksInLibrary(
    isbnList: string[],
    libraryId: string,
  ): Promise<void> {
    const library: Library = this.getLibraryById(libraryId);
    const books: Book[] = await this.getBooksByIsbnList(isbnList);
    books.map((book: Book) => library.add(book));
    this.libraryRepository.save(library);
  }

  private getLibraryById(id: string) {
    const libraryId: LibraryId = new LibraryId(id);
    const library: Library = this.libraryRepository.findOne(libraryId);
    if (!library) {
      throw new LibraryNotFoundException(libraryId);
    }
    return library;
  }

  delete(libraryId: string): void {
    const id: LibraryId = this.getLibraryById(libraryId).id;
    this.libraryRepository.delete(id);
  }

  async removeBooksByIsbnListFromLibrary(
    isbnList: string[],
    libraryId: string,
  ): Promise<void> {
    const library: Library = this.getLibraryById(libraryId);
    const books: Book[] = await this.getBooksByIsbnList(isbnList);
    books.forEach((book) => library.remove(book));
    this.libraryRepository.save(library);
  }

  async removeBookFromAllLibraries(isbn: string): Promise<void> {
    const book: Book = await this.getBookByIsbn(isbn);
    const libraries: Library[] = await this.getLibrariesContainingBook(book);
    libraries.forEach((library) => library.remove(book));
  }

  private async getLibrariesContainingBook(book: Book): Promise<Library[]> {
    const allLibraries: Library[] = await this.libraryRepository.findAll();
    return allLibraries.filter((library) => library.has(book));
  }

  async getAll(): Promise<Library[]> {
    return this.libraryRepository.findAll();
  }

  async update(id: string, isbnList: string[]): Promise<void> {
    const library: Library = this.getLibraryById(id);
    library.removeAllBooks();
    const books: Book[] = await this.getBooksByIsbnList(isbnList);
    books.forEach((book) => library.add(book));
    this.libraryRepository.save(library);
  }
}
