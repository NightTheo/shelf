import { IsbnValidator } from '../../books/domain/isbn/isbn.validator';
import { Isbn } from '../../books/domain/isbn/isbn';
import axios from 'axios';

export class IsbnValidatorGoogleApi implements IsbnValidator {
  async validate(isbn: Isbn): Promise<boolean> {
    const res = await axios.get(
      'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn.value,
    );
    return res.data.totalItems !== 0;
  }
}
