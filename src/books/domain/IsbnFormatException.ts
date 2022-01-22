export class IsbnFormatException extends Error{
    constructor(message?: string) {
        super(message);
        this.name = 'IsbnFormatException';
    }
}