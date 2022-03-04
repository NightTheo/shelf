import { IsbnFormatException } from './IsbnFormatException';

export class IsbnFormatFactory {
  static get(type: number): RegExp {
    switch (type) {
      case 13:
        return /(\d{3})-?(\d{1})-?(\d{2})-?(\d{6})-?(\d{1})/;
      default:
        throw new IsbnFormatException(`Isbn-${type} format is not handled.`);
    }
  }
}
