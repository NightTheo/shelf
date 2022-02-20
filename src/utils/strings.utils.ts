const crypto = require('crypto');

export abstract class StringsUtils {
  static randomStringOfLength(length: number): string {
    return crypto.randomBytes(length).toString(36).replace('.', '');
  }
}
