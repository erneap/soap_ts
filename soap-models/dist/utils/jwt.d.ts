import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
export declare const jwtSign: (id: ObjectId) => string;
export declare const jwtVerify: (token: string) => jwt.JwtPayload | string;
export declare const refreshSign: (id: ObjectId) => string;
export declare const refreshVerify: (token: string) => jwt.JwtPayload | string;
