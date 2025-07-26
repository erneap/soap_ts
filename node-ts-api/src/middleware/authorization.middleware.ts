import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { jwtVerify, jwtSign, refreshVerify } from 'soap-models/utils';

const secretKey = process.env.JWT_SECRET;

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers['Authorization'];
  const refreshToken = req.headers['refreshToken'];
  console.log(accessToken);
  console.log(refreshToken);
  if (!accessToken && !refreshToken) {
    return res.status(401).send('Access Denied.  No Token Provided.');
  }

  try {
    const decoded = jwtVerify(accessToken as string);
    (req as any).user = (decoded as jwt.JwtPayload)._id;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send('Access Denied.  No refresh token provided.');
    }

    try {
      const decoded = refreshVerify(refreshToken as string) as jwt.JwtPayload;
      const id = (decoded as jwt.JwtPayload)._id;
      const accessToken = jwtSign(id)

      return res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict'
        })
        .header('Authorization', accessToken)
        .send(id);
    } catch (error) {
      return res.status(400).send('Invalid Token')
    }
  }
};