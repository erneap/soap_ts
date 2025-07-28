"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.SECRET_KEY = void 0;
exports.createToken = createToken;
const jsonwebtoken_1 = require("jsonwebtoken");
exports.SECRET_KEY = 'Soap-Is-Great-For-all-Study';
function createToken(id, email) {
    const token = (0, jsonwebtoken_1.sign)({ _id: id.toString(), email: email }, exports.SECRET_KEY, { expiresIn: '2 days', });
    return token;
}
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer', '');
        if (!token) {
            throw new Error();
        }
        const decoded = (0, jsonwebtoken_1.verify)(token, exports.SECRET_KEY);
        req.token = decoded;
        next();
    }
    catch (err) {
        res.status(401).send('Please Authenticate');
    }
};
exports.auth = auth;
//# sourceMappingURL=token.js.map