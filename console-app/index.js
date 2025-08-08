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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plans_1 = require("soap-models/dist/plans");
const users_1 = require("soap-models/dist/users");
const translations_json_1 = __importDefault(require("./translations.json"));
const plan_json_1 = __importDefault(require("./plan.json"));
const bible_json_1 = __importDefault(require("./bible.json"));
const mongoconnect_1 = require("./config/mongoconnect");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoconnect_1.connectToDB)();
    const userCol = mongoconnect_1.collections.users;
    try {
        const query = { email: 'ernea5956@gmail.com' };
        const result = yield (userCol === null || userCol === void 0 ? void 0 : userCol.findOne(query));
        if (!result) {
            const user = new users_1.User();
            user.email = 'ernea5956@gmail.com';
            user.setPassword('mko09IJNbhu8');
            user.firstName = 'Anton';
            user.middleName = 'Peter';
            user.lastName = 'Erne';
            yield (userCol === null || userCol === void 0 ? void 0 : userCol.insertOne(user));
        }
    }
    catch (error) {
        console.log(error);
    }
    const trans = translations_json_1.default;
    const transCol = mongoconnect_1.collections.translations;
    try {
        for (let i = 0; i < trans.list.length; i++) {
            const t = trans.list[i];
            const query = { short: t.short };
            const result = yield (transCol === null || transCol === void 0 ? void 0 : transCol.findOne(query));
            if (!result) {
                yield (transCol === null || transCol === void 0 ? void 0 : transCol.insertOne(new plans_1.Translation(t)));
                console.log(`Inserted: ${t.long}`);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    const iPlan = plan_json_1.default;
    const plansCol = mongoconnect_1.collections.plans;
    try {
        const plan = new plans_1.Plan(iPlan);
        const query = { name: plan.name };
        const result = (yield (plansCol === null || plansCol === void 0 ? void 0 : plansCol.findOne(query)));
        if (!result) {
            yield (plansCol === null || plansCol === void 0 ? void 0 : plansCol.insertOne(plan));
            console.log('Plan Inserted');
        }
        else {
            if (result._id) {
                plan.id = result._id.toString();
            }
            yield (plansCol === null || plansCol === void 0 ? void 0 : plansCol.replaceOne(query, plan));
            console.log('Plan replaced');
        }
    }
    catch (error) {
        console.log(error);
    }
    const iBooks = bible_json_1.default;
    const bookCol = mongoconnect_1.collections.books;
    try {
        const dbBooks = [];
        const cursor = yield (bookCol === null || bookCol === void 0 ? void 0 : bookCol.find({}));
        let results = yield (cursor === null || cursor === void 0 ? void 0 : cursor.toArray());
        if (results) {
            results.forEach(bk => {
                dbBooks.push(new plans_1.BibleBook(bk));
            });
        }
        dbBooks.sort((a, b) => a.compareTo(b));
        iBooks.forEach((b) => __awaiter(void 0, void 0, void 0, function* () {
            const dBk = dbBooks.find(x => x.abbrev === b.abbrev);
            if (dBk) {
                b.id = dBk.id;
                const query = { _id: b._id };
                yield (bookCol === null || bookCol === void 0 ? void 0 : bookCol.replaceOne(query, b));
            }
            else {
                const result = yield (bookCol === null || bookCol === void 0 ? void 0 : bookCol.insertOne(b));
                b._id = result === null || result === void 0 ? void 0 : result.insertedId;
                dbBooks.push(new plans_1.BibleBook(b));
            }
        }));
    }
    catch (error) {
        console.log(error);
    }
});
main();
