import { Isbn } from './isbn';

export interface IsbnValidator {
  validate(isbn: Isbn): Promise<boolean>;
}
