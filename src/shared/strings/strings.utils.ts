export abstract class StringsUtils {
  static randomStringOfLength(length: number): string {
    return require('crypto')
      .randomBytes(length)
      .toString('hex')
      .substring(0, length);
  }
}
