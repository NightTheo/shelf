export class Isbn {
    private readonly _value: string;

    constructor(isbn: string) {
        this._value = isbn;
    }

    get value(): string {
        return this._value;
    }

    public isValid(): boolean {
        return this.hasCorrectLength()
            && this.isNumeric();
    }

    private isNumeric(): boolean {
        return !isNaN(+this._value);
    }

    private hasCorrectLength(): boolean {
        return this._value.length === 13;
    }
}