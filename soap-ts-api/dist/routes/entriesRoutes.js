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
const entries_1 = require("soap-models/dist/entries");
const authorization_middleware_1 = require("../middleware/authorization.middleware");
const router = (0, express_1.Router)();
router.get('/entries/year/:user/:year', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryCol = mongoconnect_1.collections.entries;
    if (entryCol) {
        const list = [];
        const sUser = req.params.user;
        const year = Number(req.params.year);
        const query = { userID: sUser, year: year };
        const iEntryList = yield entryCol.findOne(query);
        if (iEntryList && iEntryList !== null) {
            const entryList = new entries_1.SoapEntryList(iEntryList);
            entryList.entries.forEach(entry => {
                list.push(new entries_1.SoapEntry(entry));
            });
            list.sort((a, b) => a.compareTo(b));
        }
        return res.status(200).json(list);
    }
    else {
        return res.status(404).send('No Soap Entry Collection');
    }
}));
router.get('/entries/dates/:user/:start/:end', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryCol = mongoconnect_1.collections.entries;
    if (entryCol) {
        const list = [];
        const sUser = req.params.user;
        const sStartDate = req.params.start;
        const startDate = new Date(Date.parse(sStartDate));
        const sEndDate = req.params.end;
        let endDate = new Date();
        if (sEndDate === '') {
            endDate = new Date(Date.parse(sEndDate));
        }
        let year = startDate.getUTCFullYear();
        console.log(year);
        while (year <= endDate.getUTCFullYear()) {
            const query = { userID: sUser, year: startDate.getUTCFullYear() };
            const iEntryList = yield entryCol.findOne(query);
            if (iEntryList && iEntryList !== null) {
                const entryList = new entries_1.SoapEntryList(iEntryList);
                const tlist = entryList.getEntries(startDate, endDate);
                tlist.forEach(entry => {
                    list.push(new entries_1.SoapEntry(entry));
                });
            }
            year++;
        }
        list.sort((a, b) => a.compareTo(b));
        return res.status(200).json(list);
    }
    else {
        return res.status(404).send('No Soap Entry Collection');
    }
}));
router.get('/entry/:user/:date', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryCol = mongoconnect_1.collections.entries;
    if (entryCol) {
        const sUser = req.params.user;
        const sEntryDate = req.params.date;
        const entryDate = new Date(Date.parse(sEntryDate));
        const query = { userID: sUser, year: entryDate.getUTCFullYear() };
        const iEntryList = yield entryCol.findOne(query);
        if (iEntryList && iEntryList !== null) {
            const entryList = new entries_1.SoapEntryList(iEntryList);
            const entry = entryList.getEntry(entryDate);
            if (entry) {
                return res.status(200).json(entry);
            }
            else {
                return res.status(404).send('Soap Entry not found');
            }
        }
        else {
            return res.status(404).send('Entry List for user and year not found');
        }
    }
    else {
        return res.status(404).send('No Soap Entry Collection');
    }
}));
router.post('/entry', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryCol = mongoconnect_1.collections.entries;
    const userCol = mongoconnect_1.collections.users;
    if (entryCol) {
        const data = req.body;
        const entrydate = new Date(Date.parse(data.entrydate));
        const query = { userID: data.user, year: entrydate.getUTCFullYear() };
        const iEntryList = yield entryCol.findOne(query);
        let entryList = new entries_1.SoapEntryList();
        if (iEntryList && iEntryList !== null) {
            entryList = new entries_1.SoapEntryList(iEntryList);
        }
        else {
            entryList.userID = data.user;
            entryList.year = entrydate.getUTCFullYear();
            const uQuery = { _id: new mongodb_1.ObjectId(data.user) };
            const iUser = yield (userCol === null || userCol === void 0 ? void 0 : userCol.findOne(uQuery));
            if (iUser && iUser !== null) {
                entryList.lastName = iUser.lastName;
            }
            const result = yield entryCol.insertOne(entryList);
            entryList.id = result.insertedId.toString();
        }
        let entry = entryList.getEntry(entrydate);
        if (!entry) {
            entry = entryList.addEntry(entrydate);
            const lquery = { _id: new mongodb_1.ObjectId(entryList.id) };
            yield entryCol.replaceOne(lquery, entryList);
        }
        return res.status(202).json(entry);
    }
    else {
        return res.status(404).send('No Soap Entry Collection');
    }
}));
router.put('/entry', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryCol = mongoconnect_1.collections.entries;
    if (entryCol) {
        try {
            const data = req.body;
            const entrydate = new Date(Date.parse(data.entrydate));
            const query = { userID: data.user, year: entrydate.getUTCFullYear() };
            const iEntryList = yield entryCol.findOne(query);
            if (iEntryList && iEntryList !== null) {
                const entryList = new entries_1.SoapEntryList(iEntryList);
                const entry = entryList.updateEntry(entrydate, data.field, data.value);
                if (entry) {
                    const lquery = { _id: new mongodb_1.ObjectId(entryList.id) };
                    yield entryCol.replaceOne(lquery, entryList);
                    return res.status(200).json(entry);
                }
                else {
                    return res.status(400).send('Problem updating entry');
                }
            }
            else {
                return res.status(404).send('Entry List for user and year not found');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(404).send(error.message);
            }
            else if (typeof error === "string") {
                return res.status(404).send(error);
            }
            else {
                return res.status(500).send(error);
            }
        }
    }
    else {
        return res.status(404).send('No Soap Entry Collection');
    }
}));
router.delete('/entry/:user/:date', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const entryCol = mongoconnect_1.collections.entries;
    if (entryCol) {
        const sDate = req.params.date;
        const date = new Date(Date.parse(sDate));
        const sUser = req.params.user;
        const query = { userID: sUser, year: date.getUTCFullYear() };
        const iEntryList = yield entryCol.findOne(query);
        if (iEntryList && iEntryList !== null) {
            const entryList = new entries_1.SoapEntryList(iEntryList);
            entryList.deleteEntry(date);
            const equery = { _id: new mongodb_1.ObjectId(entryList.id) };
            if (entryList.entries.length > 0) {
                yield entryCol.replaceOne(equery, entryList);
            }
            else {
                yield entryCol.deleteOne(equery);
            }
            return res.status(200).json({ "message": 'Deletion completed' });
        }
        else {
            return res.status(404).send('Entry List for user and year not found');
        }
    }
    else {
        return res.status(404).send('No Soap Entry Collection');
    }
}));
exports.default = router;
