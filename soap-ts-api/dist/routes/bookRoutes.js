"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const books = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "Brave New World", author: "Aldous Huxley" }
];
// Get all books
router.get("/books", (req, res) => {
    res.json(books);
});
// Get a book by ID
router.get("/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (book) {
        res.json(book);
    }
    else {
        res.status(404).json({ message: "Book not found" });
    }
});
// Create a new book
router.post("/books", (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(newBook);
    res.status(201).json(newBook);
});
// Update a book by ID
router.put("/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
        books[bookIndex] = { id: bookId, title: req.body.title, author: req.body.author };
        res.json(books[bookIndex]);
    }
    else {
        res.status(404).json({ message: "Book not found" });
    }
});
// Delete a book by ID
router.delete("/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        res.status(204).send();
    }
    else {
        res.status(404).json({ message: "Book not found" });
    }
});
exports.default = router;
