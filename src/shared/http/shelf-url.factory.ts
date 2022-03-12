import { ShelfUrlException } from './shelf-url.exception';

export abstract class ShelfUrlFactory {
  public static getEndPoint(ressource: string): string {
    const url: string = process.env.SHELF_URL || 'http://localhost:3000';
    switch (ressource) {
      case 'books':
        return url + '/books';
      case 'libraries':
        return url + '/libraries';
      case 'book-in-all-libraries':
        return this.getEndPoint('libraries') + '/book';
      default:
        throw new ShelfUrlException(`Unknown ressource ${ressource}.`);
    }
  }
}
