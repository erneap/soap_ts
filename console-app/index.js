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
const entries_1 = require("soap-models/entries");
const mongoconnect_1 = require("./config/mongoconnect");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoconnect_1.connectToDB)();
    const entryCol = mongoconnect_1.collections.entries;
    if (entryCol) {
        try {
            const query = { userID: '688880632b30fd51bd570215', year: 2025 };
            const iList = yield entryCol.findOne(query);
            let list = new entries_1.SoapEntryList();
            if (iList && iList !== null) {
                list = new entries_1.SoapEntryList(iList);
            }
            console.log(list.id);
        }
        catch (error) {
            console.log(error);
        }
    }
});
main();
