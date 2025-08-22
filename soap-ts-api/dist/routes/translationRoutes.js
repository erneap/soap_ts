"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const translations_json_1 = __importDefault(require("../../dist/translations.json"));
const router = (0, express_1.Router)();
const trans = translations_json_1.default;
router.get("/translations", (req, res) => {
    res.status(200).json(trans);
});
exports.default = router;
