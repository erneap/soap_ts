"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtVerify = exports.jwtSign = void 0;
const jwt = require("jsonwebtoken");
const jwtSign = (id) => {
    const key = process.env.JWT_SECRET;
    const token = jwt.sign({ _id: id.toString() }, key, {
        expiresIn: '1 day',
    });
    return token;
};
exports.jwtSign = jwtSign;
const jwtVerify = (token) => {
    const key = process.env.JWT_SECRET;
    const result = jwt.verify(token, key);
    return result;
};
exports.jwtVerify = jwtVerify;
//# sourceMappingURL=jwt.js.map