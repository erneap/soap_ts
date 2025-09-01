"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoconnect_1 = require("../config/mongoconnect");
const mongodb_1 = require("mongodb");
const plans_1 = require("soap-models/dist/plans");
const authorization_middleware_1 = require("../middleware/authorization.middleware");
const router = (0, express_1.Router)();
router.get('/books', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booksCol = mongoconnect_1.collections.books;
    if (booksCol) {
        const cursor = yield booksCol.find({});
        const books = yield cursor.toArray();
        const list = [];
        books.forEach(b => {
            list.push(new plans_1.BibleBook(b));
        });
        list.sort((a, b) => a.compareTo(b));
        return res.status(200).json(list);
    }
    else {
        return res.status(404).send('No Bible Books Collection');
    }
}));
router.get('/book/:id', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booksCol = mongoconnect_1.collections.books;
    if (booksCol) {
        const id = req.params.id;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const ibook = yield booksCol.findOne(query);
        if (ibook && ibook !== null) {
            const book = new plans_1.BibleBook(ibook);
            return res.status(200).json(book);
        }
        else {
            return res.status(404).send('Bible Book not found');
        }
    }
    else {
        return res.status(404).send('No Bible Books Collection');
    }
}));
router.post('/book', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booksCol = mongoconnect_1.collections.books;
    if (booksCol) {
        const data = req.body;
        // check to see if book is already present
        const bQuery = { title: data.title };
        const iBook = yield booksCol.findOne(bQuery);
        if (iBook && iBook !== null) {
            return res.status(403).send('Duplicate title attempted');
        }
        else {
            const cursor = yield booksCol.find({});
            const books = yield cursor.toArray();
            const list = [];
            books.forEach(b => {
                list.push(new plans_1.BibleBook(b));
            });
            list.sort((a, b) => a.compareTo(b));
            const newBook = new plans_1.BibleBook();
            newBook.id = list[list.length - 1].id + 1;
            newBook.abbrev = data.abbrev;
            newBook.title = data.title;
            newBook.chapters = data.chapters;
            const result = yield booksCol.insertOne(newBook);
            if (result && result.insertedId) {
                return res.status(201).json(newBook);
            }
            else {
                return res.status(401).send('New Bible Book not created');
            }
        }
    }
    else {
        return res.status(404).send('No Bible Books Collection');
    }
}));
router.put('/book', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booksCol = mongoconnect_1.collections.books;
    if (booksCol) {
        const data = req.body;
        const query = { _id: new mongodb_1.ObjectId(data.id) };
        const ibook = yield booksCol.findOne(query);
        if (ibook && ibook !== null) {
            console.log(data.field);
            switch (data.field.toLowerCase()) {
                case "abbrev":
                case "abbreviation":
                case "code":
                    ibook.abbrev = data.value;
                    break;
                case "title":
                    ibook.title = data.value;
                    break;
                case "chapters":
                    ibook.chapters = Number(data.value);
                    break;
                case "move":
                    const cursor = yield booksCol.find({});
                    const books = yield cursor.toArray();
                    const list = [];
                    books.forEach(b => {
                        list.push(b);
                    });
                    list.sort((a, b) => (a.id < b.id) ? -1 : 1);
                    let bFound = false;
                    for (let i = 0; i < list.length && !bFound; i++) {
                        if (ibook.id === list[i].id) {
                            bFound = true;
                            const old = list[i].id;
                            if (i > 0 && data.value.toLowerCase().substring(0, 2) === 'up') {
                                const other = list[i - 1];
                                ibook.id = other.id;
                                other.id = old;
                                const tquery = { _id: other._id };
                                yield booksCol.replaceOne(tquery, other);
                            }
                            else if (i < list.length - 1 && data.value.toLowerCase().substring(0, 2) === 'do') {
                                const other = list[i + 1];
                                ibook.id = other.id;
                                other.id = old;
                                const tquery = { _id: other._id };
                                yield booksCol.replaceOne(tquery, other);
                            }
                        }
                    }
                    break;
            }
            yield booksCol.replaceOne(query, ibook);
            return res.status(200).json(ibook);
        }
        else {
            return res.status(404).send("Bible Book not found");
        }
    }
    else {
        return res.status(404).send('No Bible Books Collection');
    }
}));
router.delete('/book/:id', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booksCol = mongoconnect_1.collections.books;
    if (booksCol) {
        // with a deletion, first we delete the requested book,
        // then we pull all the other books into a list, sort them,
        // and reapply the id (sort value) to each remaining book in
        // order and update the database for each.
        const id = req.params.id;
        const query = { id: Number(id) };
        const result = yield booksCol.deleteOne(query);
        if (result.deletedCount > 0) {
            const cursor = yield booksCol.find({});
            const books = yield cursor.toArray();
            const list = [];
            books.forEach(b => {
                list.push(b);
            });
            list.sort((a, b) => (a.id < b.id) ? -1 : 1);
            for (let i = 0; i < list.length; i++) {
                list[i].id = i + 1;
                const tquery = { _id: list[i]._id };
                yield booksCol.replaceOne(tquery, list[i]);
            }
            return res.status(200).send('Deletion completed');
        }
        else {
            return res.status(404).send('Bible book not found');
        }
    }
    else {
        return res.status(404).send('No Bible Books Collection');
    }
}));
exports.default = router;
