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
const mongodb_1 = require("mongodb");
const users_1 = require("soap-models/users");
const mongoconnect_1 = require("../config/mongoconnect");
const utils_1 = require("soap-models/utils");
const router = (0, express_1.Router)();
// CRUD Functions 
// ******* Retrieve All Users ********
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tusers = mongoconnect_1.collections.users;
    if (tusers) {
        const cursor = tusers.find({});
        let results = (yield cursor.toArray()).sort((a, b) => a.compareTo(b));
        return res.status(200).json(results);
    }
}));
// ******** Retrieve a single user from database *******
router.get('/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const user = (yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.findOne(query)));
        if (user) {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(404).send(`Unable to find User: ${id}`);
    }
}));
// ******* Create a new user ********
router.post('/user/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const newuser = req.body;
        const user = new users_1.User();
        user.email = newuser.email;
        user.firstName = newuser.firstName;
        user.middleName = newuser.middleName;
        user.lastName = newuser.lastName;
        const tempPassword = user.createRandomPassword();
        const result = yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.insertOne(user));
        if (result) {
            user.id = result.insertedId;
            const newResponse = {
                user: user,
                password: tempPassword,
            };
            res.status(201).json(newResponse);
        }
        else {
            res.status(500).send("Failed to create new user");
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}));
// ******* find User with email address ********
router.post('/user/find', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const request = req.body;
        const query = { email: request.email };
        const iuser = (yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query)));
        if (iuser) {
            const user = new users_1.User(iuser);
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(404).send(`User Not Found: ${req.body.email}`);
    }
}));
// ******* Authenticate User with email address and password ********
router.post('/user/authenticate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const request = req.body;
        const query = { email: request.email };
        const iuser = (yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query)));
        if (iuser) {
            try {
                const user = new users_1.User(iuser);
                let bad = 0;
                if (user.badAttempts < 0) {
                    bad = -1;
                }
                user.checkPassword(request.password);
                const nquery = { _id: user.id };
                yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.updateOne(query, { $set: user }));
                let token = '';
                if (user.id) {
                    token = (0, utils_1.jwtSign)(user.id);
                }
                user.badAttempts = bad;
                const result = {
                    user: user,
                    token: token,
                    error: '',
                };
                res.status(200).json(result);
            }
            catch (error) {
                if (typeof error === 'string') {
                    console.log(error);
                    res.status(401).send(error);
                }
                else if (error instanceof Error) {
                    console.log(error.message);
                    res.status(401).send(error.message);
                }
            }
        }
    }
    catch (error) {
        res.status(404).send(`User Not Found: ${req.body.email}`);
    }
}));
router.put('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const data = req.body;
        const query = { _id: new mongodb_1.ObjectId(data.id) };
        const iuser = (yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query)));
        if (iuser) {
            const user = new users_1.User(iuser);
            switch (data.field.toLowerCase()) {
                case "password":
                    user.setPassword(data.value);
                    break;
                case "unlock":
                    user.badAttempts = 0;
                    break;
                case "first":
                case "firstname":
                    user.firstName = data.value;
                    break;
                case "middle":
                case "middlename":
                    user.middleName = data.value;
                    break;
                case "last":
                case "lastname":
                    user.lastName = data.value;
                    break;
            }
            const result = yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.updateOne(query, { $set: user }));
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(404).send(`User Not Found: ${req.body.id}`);
    }
}));
exports.default = router;
