import { LibraryRepository } from '../domain/library.repository';
import { Isbn } from '../domain/isbn/isbn';
import { ShelfUrlFactory } from '../../shared/http/shelf-url.factory';
import axios from 'axios';

export class LibraryRepositoryShelfApi implements LibraryRepository {
  async removeBookFromAllLibraries(isbn: Isbn): Promise<void> {
    const url: string = ShelfUrlFactory.getEndPoint('book-in-all-libraries');
    await axios.delete(`${url}/${isbn.value}`);
  }
}
