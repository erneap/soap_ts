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
const plans_1 = require("soap-models/dist/plans");
const mongodb_1 = require("mongodb");
const mongoconnect_1 = require("../config/mongoconnect");
const router = (0, express_1.Router)();
router.get("/translations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transCol = mongoconnect_1.collections.translations;
    if (transCol) {
        const cursor = transCol.find({});
        let results = yield cursor.toArray();
        const list = [];
        results.forEach(u => {
            list.push(new plans_1.Translation(u));
        });
        list.sort((a, b) => a.compareTo(b));
        return res.status(200).json(list);
    }
    else {
        return res.status(404).send("Unable to find collection");
    }
}));
router.get("/translation/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transCol = mongoconnect_1.collections.translations;
    const id = req.params.id;
    const numRE = new RegExp("^[0-9]+$");
    if (transCol) {
        const query = { short: id };
        let results = yield transCol.findOne(query);
        if (numRE.test(id)) {
            const numquery = { id: Number(id) };
            results = yield transCol.findOne(numquery);
        }
        if (results && results !== null) {
            const trans = new plans_1.Translation(results);
            return res.status(200).json(trans);
        }
        else {
            return res.status(404).send("Translation Not Found");
        }
    }
    else {
        res.status(404).send("Unable to find collection");
    }
}));
router.post("/translation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transCol = mongoconnect_1.collections.translations;
    const data = req.body;
    if (transCol) {
        const query = { short: data.short };
        let results = yield transCol.findOne(query);
        if (results && results !== null) {
            // already present, so update the long title
            results.long = data.long;
            yield transCol.replaceOne(query, results);
            return res.status(200).json(results);
        }
        else {
            // find out the next translation id number and add
            let last = -1;
            const cursor = transCol.find({});
            let list = yield cursor.toArray();
            list.forEach(u => {
                if (last < u.id) {
                    last = u.id;
                }
            });
            const trans = new plans_1.Translation();
            trans.id = last + 1;
            trans.short = data.short;
            trans.long = data.long;
            const answer = yield transCol.insertOne(trans);
            return res.status(201).json(trans);
        }
    }
    else {
        return res.status(404).send("Unable to find collection");
    }
}));
router.put("/translation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transCol = mongoconnect_1.collections.translations;
    const data = req.body;
    if (transCol) {
        const query = { id: data.id };
        let results = yield transCol.findOne(query);
        if (results) {
            switch (data.field.toLowerCase()) {
                case "short":
                    results.short = data.value;
                    break;
                case "long":
                    results.long = data.value;
                    break;
            }
            yield transCol.replaceOne(query, results);
            return res.status(200).json(results);
        }
        else {
            return res.status(404).send("Translation Not Found");
        }
    }
    else {
        return res.status(404).send("Unable to find collection");
    }
}));
router.delete("/translation/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transCol = mongoconnect_1.collections.translations;
    const id = req.params.id;
    const numRE = new RegExp("^[0-9]+$");
    if (transCol) {
        let num = 0;
        if (numRE.test(id)) {
            const numquery = { id: Number(id) };
            const result = yield transCol.deleteOne(numquery);
            num = result.deletedCount;
        }
        else {
            const query = { _id: new mongodb_1.ObjectId(id) };
            const result = yield transCol.deleteOne(query);
            num = result.deletedCount;
        }
        if (num > 0) {
            return res.status(200).send('Translation Deleted');
        }
        else {
            return res.status(202).send('Translation Not Found');
        }
    }
    else {
        return res.status(404).send("Unable to find collection");
    }
}));
exports.default = router;
