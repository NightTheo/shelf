import {IsbnFormatException} from "./IsbnFormatException";

export class Isbn {
    private readonly _value: string;

    constructor(string: string) {
        const found = string.match(Isbn.format());
        if(!found) {
            throw new IsbnFormatException("ISBN-13 format is: 'aaa-b-cc-dddddd-e' (with or without dashes)");
        }
        this._value = found.slice(1).join('');
    }

    get value(): string {
        return this._value;
    }

    // ISBN-13 format is: 'aaa-b-cc-dddddd-e', with or without dashes
    static format(): RegExp {
        return /(\d{3})-?(\d{1})-?(\d{2})-?(\d{6})-?(\d{1})/;
    }
}