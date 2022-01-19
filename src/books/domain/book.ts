import {Isnb} from "./isbn";
import {Author} from "./author";
import {BookTitle} from "./book-title";
import {BookOverview} from "./book-overview";
import {Picture} from "./picture";
import {IsbnFormatException} from "./IsbnFormatException";

export class Book {
    private _isbn: Isnb;
    private _title: BookTitle;
    private _author: Author;
    private _overview: BookOverview;
    private picture: Picture;


    constructor(isbn: Isnb, title: BookTitle, author: Author, overview: BookOverview) {
        this._isbn = isbn;
        this._title = title;
        this._author = author;
        this._overview = overview
    }

    get isbn(): Isnb {
        return this._isbn;
    }

    get title(): BookTitle {
        return this._title;
    }

    get author(): Author {
        return this._author;
    }

    get overview(): BookOverview {
        return this._overview;
    }

    canBeAdded(): boolean {
        return this.isbn.isValid()
            && this.title.isValid();
    }
}
