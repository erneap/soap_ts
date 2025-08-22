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
exports.collections = void 0;
exports.connectToDB = connectToDB;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
exports.collections = {};
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        dotenv_1.default.config();
        const uri = process.env.MONGO_URI;
        console.log(uri);
        if (uri) {
            try {
                const client = new mongodb_1.MongoClient(uri);
                yield client.connect();
                console.log('Connected to database');
                const db = client.db(process.env.MONGO_DB_NAME);
                let users = db.collection("users");
                if (!users) {
                    users = yield db.createCollection("users");
                }
                exports.collections.users = users;
                let plans = db.collection("plans");
                if (!plans) {
                    plans = yield db.createCollection("plans");
                }
                exports.collections.plans = plans;
                let entries = db.collection('entries');
                if (!entries) {
                    entries = yield db.createCollection("entries");
                }
                exports.collections.entries = entries;
                let translations = db.collection("translations");
                if (!translations) {
                    translations = yield db.createCollection("translations");
                }
                exports.collections.translations = translations;
                let books = yield db.collection('biblebooks');
                if (!books) {
                    books = yield db.createCollection('biblebooks');
                }
                exports.collections.books = books;
                let help = yield db.collection('help');
                if (!help) {
                    help = yield db.createCollection('help');
                }
                exports.collections.help = help;
                console.log('Successfully connected to collections');
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
