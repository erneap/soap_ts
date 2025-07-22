import { ObjectId } from "mongodb";
import { sign, verify, Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = 'Soap-Is-Great-For-all-Study';

export function createToken(id: ObjectId, email: string): string {
    const token = sign({_id: id.toString(), email: email}, SECRET_KEY, {expiresIn: '2 days', });
    return token;
}

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer', '');

        if (!token) {
            throw new Error();
        }

        const decoded = verify(token, SECRET_KEY);

        (req as CustomRequest).token = decoded;

        next();
    } catch (err) {
        res.status(401).send('Please Authenticate');
    }
};