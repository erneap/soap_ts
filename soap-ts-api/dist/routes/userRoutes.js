"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const users_1 = require("soap-models/dist/users");
const mongoconnect_1 = require("../config/mongoconnect");
const jwt = __importStar(require("jsonwebtoken"));
const authorization_middleware_1 = require("../middleware/authorization.middleware");
const emailer_1 = require("../config/emailer");
const router = (0, express_1.Router)();
// CRUD Functions 
// ******* Retrieve All Users ********
router.get('/users', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tusers = mongoconnect_1.collections.users;
    if (tusers) {
        const cursor = tusers.find({});
        let results = (yield cursor.toArray());
        const list = [];
        results.forEach(u => {
            list.push(new users_1.User(u));
        });
        list.sort((a, b) => a.compareTo(b));
        return res.status(200).json(list);
    }
    else {
        return res.status(404).send("Unable to find collection");
    }
}));
// ******** Retrieve a single user from database *******
router.get('/user/:id', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const user = (yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.findOne(query)));
        if (user && user !== null) {
            res.status(200).json(user);
        }
    }
    catch (error) {
        return res.status(404).send(`Unable to find User: ${id}`);
    }
}));
// ******* Create a new user ********
router.post('/user/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const newuser = req.body;
        const user = new users_1.User();
        user.email = newuser.email;
        user.firstName = newuser.firstName;
        user.middleName = newuser.middleName;
        user.lastName = newuser.lastName;
        user.translationId = newuser.translation;
        user.planId = newuser.plan;
        const tempPassword = user.createRandomPassword();
        const query = { email: newuser.email };
        const oldUser = yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query));
        if (oldUser) {
            return res.status(403).send('User already present');
        }
        const result = yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.insertOne(user));
        if (result) {
            user.id = result.insertedId.toString();
            const newResponse = {
                user: user,
                password: tempPassword,
            };
            // TODO:  send an email with the new password
            let message = '<!DOCTYPE html>\n<html>\n<head>\n<style>\n'
                + 'body { background-color:lightblue;display:flex;flex-direction:column;'
                + 'justify-content:center;align-items:center;padding:10px;}\n'
                + 'div.main {display:flex;flex-direction:column;justify-content:center;'
                + 'align-items: center;}\n'
                + 'div.password {background-color:blue;color:white;display:flex;'
                + 'flex-direction:column;justify-content:center;align-items:center;'
                + 'padding: 10px;}\n'
                + '</style>\n</head>\n<body>\n'
                + '<h1>Soap Journal Web Application</h1>\n'
                + '<h2>Thank you for creating an account at soapjournal.org</h2>\n'
                + '<div class="main">\n'
                + '<p>The account you created will allow you to create journal entries, '
                + 'create and maintain a reading plan, and read the bible according to '
                + 'your choosen plan.</p>\n'
                + "<p>We are glad that you've choosen to enrich your life through faith!"
                + '</p>\n<div class="password">\n'
                + '<p>The following is your temporary password, use it to log into the '
                + 'application:</p>\n'
                + `<h2 style="color: yellow;">${tempPassword}</h2>\n`
                + '<p style="color:lightpink;text-decoration: underline;">\n'
                + 'You will be required to change your password after the first log in.\n'
                + '</p>\n</div>\n<div style="margin-top: 25px;">Thanks again, the '
                + 'webmaster.</div>\n</div>\n</body>\n</html>\n';
            try {
                yield (0, emailer_1.sendMail)(user.email, 'New Account Creation', message);
            }
            catch (error) {
                console.log(error);
            }
            return res.status(201).json(newResponse);
        }
        else {
            return res.status(500).send("Failed to create new user");
        }
    }
    catch (error) {
        return res.status(400).send(error);
    }
}));
// ******* find User with email address ********
router.post('/user/find', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const request = req.body;
        const query = { email: request.email };
        const iuser = (yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query)));
        if (!iuser || iuser === null) {
            throw new Error(`No User Found for address: ${request.email}`);
        }
        else {
            const user = new users_1.User(iuser);
            return res.status(200).json(user);
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
}));
// ******* Authenticate User with email address and password ********
router.post('/user/authenticate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const request = req.body;
        const query = { email: request.email };
        const iuser = yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query));
        if (!iuser || iuser === null) {
            throw new Error('No User Found');
        }
        else {
            try {
                const user = new users_1.User(iuser);
                let bad = 0;
                if (user.badAttempts < 0) {
                    bad = -1;
                }
                user.checkPassword(request.password);
                user.badAttempts = bad;
                const nquery = { _id: user.id };
                yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.updateOne(query, { $set: user }));
                if (user.id) {
                    const key = process.env.JWT_SECRET;
                    const expires = process.env.JWT_EXPIRES;
                    if (key && expires) {
                        const accessToken = jwt.sign({ _id: user.id.toString() }, key, { expiresIn: expires });
                        res.setHeader('authorization', accessToken);
                    }
                    const rKey = process.env.JWT_REFRESH_SECRET;
                    const rExpires = process.env.JWT_REFRESH_EXPIRES;
                    if (rKey && rExpires) {
                        const refreshToken = jwt.sign({ _id: user.id.toString() }, rKey, {
                            expiresIn: rExpires,
                        });
                        res.setHeader('refreshToken', refreshToken);
                    }
                }
                return res.status(200).json(user);
            }
            catch (error) {
                if (typeof error === 'string') {
                    console.log(error);
                    return res.status(401).send(error);
                }
                else if (error instanceof Error) {
                    console.log(error.message);
                    return res.status(401).send(error.message);
                }
                else {
                    return res.status(500).send(error);
                }
            }
        }
    }
    catch (error) {
        if (typeof error === 'string') {
            console.log(error);
            return res.status(401).send(error);
        }
        else if (error instanceof Error) {
            console.log(error.message);
            return res.status(401).send(error.message);
        }
        else {
            return res.status(500).send(error);
        }
    }
}));
router.put('/user', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const data = req.body;
        const query = { _id: new mongodb_1.ObjectId(data.id) };
        const iuser = yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query));
        if (!iuser || iuser === null) {
            throw new Error("User Not Found for Update");
        }
        else {
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
                case "plan":
                    user.planId = data.value;
                    break;
                case "translation":
                    user.translationId = data.value;
                    break;
                case "email":
                    user.email = data.value;
                    break;
            }
            const result = yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.updateOne(query, { $set: user }));
            res.status(200).json(user);
        }
    }
    catch (error) {
        if (typeof error === 'string') {
            console.log(error);
            return res.status(401).send(error);
        }
        else if (error instanceof Error) {
            console.log(error.message);
            return res.status(401).send(error.message);
        }
        else {
            return res.status(500).send(error);
        }
    }
}));
router.put('/user/mustchange', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const data = req.body;
        const query = { email: data.id };
        const iuser = yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query));
        if (!iuser || iuser === null) {
            throw new Error("User Not Found for Update");
        }
        else {
            const user = new users_1.User(iuser);
            user.setPassword(data.value);
            const result = yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.updateOne(query, { $set: user }));
            res.status(200).json(user);
        }
    }
    catch (error) {
        if (typeof error === 'string') {
            console.log(error);
            return res.status(401).send(error);
        }
        else if (error instanceof Error) {
            console.log(error.message);
            return res.status(401).send(error.message);
        }
        else {
            return res.status(500).send(error);
        }
    }
}));
router.post('/refresh', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rToken = req.headers['refreshtoken'];
    if (!rToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
    }
    const refreshToken = rToken;
    const key = (process.env.JWT_SECRET) ? process.env.JWT_SECRET : 'SECRET';
    const secret = (process.env.JWT_REFRESH_SECRET)
        ? process.env.JWT_REFRESH_SECRET : 'SECRET';
    const expires = (process.env.JWT_EXPIRES)
        ? process.env.JWT_REFRESH_EXPIRES : '1d';
    try {
        const decoded = jwt.verify(refreshToken, secret);
        const accessToken = jwt.sign({ _id: decoded.id.toString() }, key, { expiresIn: expires });
        return res
            .cookie('Authorization', accessToken, {
            httpOnly: true,
            sameSite: 'strict'
        })
            .send(decoded._id);
    }
    catch (error) {
        return res.status(400).send('Invalid refresh token.');
    }
}));
router.put('/user/forgot', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const request = req.body;
        const email = request.id;
        const query = { email: email };
        const iUser = yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query));
        if (iUser) {
            const user = new users_1.User(iUser);
            const result = user.createResetToken();
            const nquery = { _id: new mongodb_1.ObjectId(user.id) };
            yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.updateOne(nquery, { $set: user }));
            let message = '<!DOCTYPE html>\n<html>\n<head>\n<style>\n'
                + 'body { background-color:lightblue;display:flex;flex-direction:column;'
                + 'justify-content:center;align-items:center;padding:10px;}\n'
                + 'div.main {display:flex;flex-direction:column;justify-content:center;'
                + 'align-items: center;}\n'
                + 'div.password {background-color:blue;color:white;display:flex;'
                + 'flex-direction:column;justify-content:center;align-items:center;'
                + 'padding: 10px;}\n'
                + '</style>\n</head>\n<body>\n'
                + '<h1>Soap Journal Web Application</h1>\n'
                + '<h2>Forgot Your Password</h2>\n'
                + '<div class="main">\n<p>\n'
                + "You have notified the site that you've forgotten your password.  The "
                + "process for re-establishing log in privileges is in effect.  Please "
                + "copy the token string below and click the link to get you back to a "
                + "web page to change your forgotten password.\n</p>\n"
                + "<p>We are glad that you've choosen to enrich your life through faith!</p>\n"
                + '<div class="password">\n'
                + '<p>The following is your token string to verify you are the account '
                + `holder:</p>\n<h2 style="color: yellow;">${result}</h2>\n`
                + '<p style="color:lightpink;text-decoration: underline;">\n'
                + '<a href="http://www.soapjournal.org/forgot">Link back to site</a>\n'
                + '</p>\n</div>\n<div style="margin-top: 25px;">'
                + 'Thanks again, the webmaster.</div>\n</div>\n</body>\n</html>';
            try {
                yield (0, emailer_1.sendMail)(user.email, 'Forgot Password Token', message);
            }
            catch (error) {
                console.log(error);
            }
            return res.status(200).json(user);
        }
        else {
            throw new Error("User Not Found");
        }
    }
    catch (error) {
        console.log(error);
        if (typeof error === 'string') {
            console.log(error);
            return res.status(401).send(error);
        }
        else if (error instanceof Error) {
            console.log(error.message);
            return res.status(401).send(error.message);
        }
        else {
            return res.status(500).send(error);
        }
    }
}));
router.put('/user/forgot2', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const request = req.body;
        const email = request.id;
        const query = { email: email };
        const iUser = yield ((_a = mongoconnect_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne(query));
        if (iUser) {
            const user = new users_1.User(iUser);
            const now = new Date();
            if (now.getTime() <= user.resetTokenExpires.getTime()
                && user.resetToken === request.field) {
                user.setPassword(request.value);
                user.resetToken = '';
                user.resetTokenExpires = new Date(0);
                yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.updateOne(query, { $set: user }));
                return res.status(200).json(user);
            }
            else {
                if (now.getTime() > user.resetTokenExpires.getTime()) {
                    throw new Error("Reset Token Expired.  They are only good for 1 hour");
                }
                else {
                    throw new Error("Reset Token was not correct, try again");
                }
            }
        }
        else {
            throw new Error("User Not Found");
        }
    }
    catch (error) {
        console.log(error);
        if (typeof error === 'string') {
            console.log(error);
            return res.status(401).send(error);
        }
        else if (error instanceof Error) {
            console.log(error.message);
            return res.status(401).send(error.message);
        }
        else {
            return res.status(500).send(error);
        }
    }
}));
router.delete('/user/:id', authorization_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_b = mongoconnect_1.collections.users) === null || _b === void 0 ? void 0 : _b.deleteOne(query));
        if (result && result.deletedCount > 0) {
            return res.status(200).send("User deleted");
        }
        else {
            return res.status(404).send('User not deleted, Not Found');
        }
    }
    catch (error) {
        return res.status(404).send(`Unable to find User: ${id}`);
    }
}));
exports.default = router;
