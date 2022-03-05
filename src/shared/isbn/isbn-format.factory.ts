import { IsbnFormatException } from './isbn-format.exception';

export class IsbnFormatFactory {
  static get(type: number): RegExp {
    switch (type) {
      case 13:
        return /(\d{3})-?(\d{1})-?(\d{4})-?(\d{4})-?(\d{1})/;
      default:
        throw new IsbnFormatException(`Isbn-${type} format is not handled.`);
    }
  }
}
