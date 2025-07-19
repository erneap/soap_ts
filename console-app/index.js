"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("soap-models/test");
const translations_json_1 = __importDefault(require("./translations.json"));
(0, test_1.sayHello)();
const trans = translations_json_1.default;
trans.list.forEach(t => {
    console.log(`Short: ${t.short} - Long: ${t.long}`);
});
