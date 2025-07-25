import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export const jwtSign = (id: ObjectId): string => {
  const key = process.env.JWT_SECRET
  const token = jwt.sign({_id: id.toString() }, key, { 
    expiresIn: '1 day', });
  return token;
}