import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export const jwtSign = (id: ObjectId): string => {
  const key = process.env.JWT_SECRET
  const expires = process.env.JWT_EXPIRES
  const token = jwt.sign({_id: id.toString() }, key, { 
    expiresIn: expires as any, });
  return token;
}

export const jwtVerify = (token: string): jwt.JwtPayload | string => {
  const key = process.env.JWT_SECRET;
  const result = jwt.verify(token, key);
  return result;
}

export const refreshSign = (id: ObjectId): string => {
  const key = process.env.JWT_REFRESH_SECRET
  const expires = process.env.JWT_REFRESH_EXPIRES
  const token = jwt.sign({_id: id.toString() }, key, { 
    expiresIn: expires as any, });
  return token;
}

export const refreshVerify = (token: string): jwt.JwtPayload | string => {
  const key = process.env.JWT_REFRESH_SECRET;
  const result = jwt.verify(token, key);
  return result;
}