"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshVerify = exports.refreshSign = exports.jwtVerify = exports.jwtSign = void 0;
const jwt = require("jsonwebtoken");
const jwtSign = (id) => {
    const key = process.env.JWT_SECRET;
    const expires = process.env.JWT_EXPIRES;
    const token = jwt.sign({ _id: id.toString() }, key, {
        expiresIn: expires,
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
const refreshSign = (id) => {
    const key = process.env.JWT_REFRESH_SECRET;
    const expires = process.env.JWT_REFRESH_EXPIRES;
    const token = jwt.sign({ _id: id.toString() }, key, {
        expiresIn: expires,
    });
    return token;
};
exports.refreshSign = refreshSign;
const refreshVerify = (token) => {
    const key = process.env.JWT_REFRESH_SECRET;
    const result = jwt.verify(token, key);
    return result;
};
exports.refreshVerify = refreshVerify;
//# sourceMappingURL=jwt.js.map