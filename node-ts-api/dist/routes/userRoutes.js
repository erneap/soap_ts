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
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
if (process.env.MONGO_USER === undefined) {
    dotenv_1.default.config();
}
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWD}`
    + `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`
    + '?authSource=scheduler&directConnection=true';
const client = new mongodb_1.MongoClient(uri);
client.connect();
// CRUD Functions 
// ******* Retrieve All Users ********
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cursor = client.db('soap').collection('users').find({});
    let results = (yield cursor.toArray()).sort((a, b) => a.compareTo(b));
    return res.status(200).json(results);
}));
exports.default = router;
