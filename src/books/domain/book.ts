import {Isnb} from "./isbn";
import {Author} from "./author";
import {BookTitle} from "./book-title";
import {BookOverview} from "./book-overview";
import {Picture} from "./picture";

export class Book {
    private _isbn: Isnb;
    private _title: BookTitle;
    private _author: Author;
    private overview: BookOverview;
    private picture: Picture;


    constructor(isbn: Isnb, title: BookTitle, author: Author, overview: BookOverview) {
        this._isbn = isbn;
        this._title = title;
        this._author = author;
        this.overview = overview
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

    canBeAdded(): void {
    }
}