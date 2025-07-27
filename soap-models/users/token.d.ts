import { ObjectId } from "mongodb";
import { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
export declare const SECRET_KEY: Secret;
export declare function createToken(id: ObjectId, email: string): string;
export interface CustomRequest extends Request {
    token: string | JwtPayload;
}
export declare const auth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
