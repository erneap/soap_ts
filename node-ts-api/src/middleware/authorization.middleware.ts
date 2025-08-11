import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  let aToken = req.headers['authorization'];
  const rToken = req.headers['refreshtoken'];
  if (!aToken && !rToken) {
    return res.status(401).send('Access Denied.  No Token Provided.');
  }
  let accessToken = aToken as string;
  const refreshToken = rToken as string;
  try {
    const key = (process.env.JWT_SECRET) ? process.env.JWT_SECRET as string : 'secret';
    const decoded = jwt.verify(accessToken, key);
    (req as any).user = (decoded as jwt.JwtPayload)._id;
    next();
  } catch (error) {
    console.log(error);
    if (!refreshToken) {
      return res.status(401).send('Access Denied.  No refresh token provided.');
    }

    try {
      const key = (process.env.JWT_REFRESH_SECRET)
        ? process.env.JWT_REFRESH_SECRET as string : 'secret';
      const decoded = jwt.verify(refreshToken, key);
      const id = (decoded as jwt.JwtPayload)._id;
      const aKey: string = (process.env.JWT_SECRET) ? process.env.JWT_SECRET : 'secret';
      const expires: string = (process.env.JWT_EXPIRES) ? process.env.JWT_EXPIRES : '1h';
      const accessToken = jwt.sign({ _id: id}, aKey, { expiresIn: (expires as any)});
      res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: 'strict'
        })
        .cookie('authorization', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 1000,
          sameSite: 'strict'
        });
      next()
    } catch (error) {
      return res.status(400).send('Invalid Token')
    }
  }

};