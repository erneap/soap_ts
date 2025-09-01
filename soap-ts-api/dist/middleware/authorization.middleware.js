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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const auth = (req, res, next) => {
    let aToken = req.headers['authorization'];
    const rToken = req.headers['refreshtoken'];
    if (!aToken && !rToken) {
        return res.status(401).send('Access Denied.  No Token Provided.');
    }
    let accessToken = aToken;
    const refreshToken = rToken;
    try {
        const key = (process.env.JWT_SECRET) ? process.env.JWT_SECRET : 'secret';
        const decoded = jwt.verify(accessToken, key);
        req.user = decoded._id;
        next();
    }
    catch (error) {
        if (!refreshToken) {
            return res.status(401).send('Access Denied.  No refresh token provided.');
        }
        try {
            const key = (process.env.JWT_REFRESH_SECRET)
                ? process.env.JWT_REFRESH_SECRET : 'secret';
            const decoded = jwt.verify(refreshToken, key);
            const id = decoded._id;
            const aKey = (process.env.JWT_SECRET) ? process.env.JWT_SECRET : 'secret';
            const expires = (process.env.JWT_EXPIRES) ? process.env.JWT_EXPIRES : '1h';
            const accessToken = jwt.sign({ _id: id }, aKey, { expiresIn: expires });
            res
                .setHeader('authorization', accessToken);
            next();
        }
        catch (error) {
            return res.status(400).send('Invalid Token');
        }
    }
};
exports.auth = auth;
