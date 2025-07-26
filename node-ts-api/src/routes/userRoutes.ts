import { Router, Request, Response } from 'express';
import { Collection, ObjectId } from 'mongodb';
import { AuthenticationRequest, AuthenticationResponse, IUser, UpdateUserRequest, User, UserEmailRequest } from 'soap-models/users';
import { collections } from '../config/mongoconnect';
import { NewUserRequest, NewUserResponse } from 'soap-models/users';
import { jwtSign, refreshSign, refreshVerify } from 'soap-models/utils';
import * as jwt from 'jsonwebtoken';
import { auth } from '../middleware/authorization.middleware';

const router = Router();

// CRUD Functions 

// ******* Retrieve All Users ********
router.get('/users', auth, async (req: Request, res: Response) => {
  const tusers: Collection | undefined = collections.users;
  if (tusers) {
    const cursor = tusers.find<User>({})
    let results = (await cursor.toArray()).sort((a,b) => a.compareTo(b));
    return res.status(200).json(results);
  }
});

// ******** Retrieve a single user from database *******
router.get('/user/:id', auth, async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const query = { _id: new ObjectId(id) };
    const user = (await collections.users?.findOne<User>(query)) as User;

    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(404).send(`Unable to find User: ${id}`);
  }
});

// ******* Create a new user ********
router.post('/user/new', async (req: Request, res: Response) => {
  try {
    const newuser = req.body as NewUserRequest;
    const user = new User();
    user.email = newuser.email;
    user.firstName = newuser.firstName;
    user.middleName = newuser.middleName;
    user.lastName = newuser.lastName;
    const tempPassword = user.createRandomPassword();

    const result = await collections.users?.insertOne(user);

    if (result) {
      user.id = result.insertedId;
      const newResponse: NewUserResponse = {
        user: user,
        password: tempPassword,
      };
      res.status(201).json(newResponse);
    } else {
      res.status(500).send("Failed to create new user");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error)
  }
});

// ******* find User with email address ********
router.post('/user/find', auth, async (req: Request, res: Response) => {
  try {
    const request = req.body as UserEmailRequest;
    const query = { email: request.email };
    const iuser = (await collections.users?.findOne<User>(query)) as IUser;

    if (iuser) {
      const user = new User(iuser)
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(404).send(`User Not Found: ${req.body.email}`)
  }
});

// ******* Authenticate User with email address and password ********
router.post('/user/authenticate', async (req: Request, res: Response) => {
  try {
    const request = req.body as AuthenticationRequest;
    const query = { email: request.email };
    const iuser = (await collections.users?.findOne<User>(query)) as IUser;

    if (iuser) {
      try {
        const user = new User(iuser);
        let bad = 0;
        if (user.badAttempts < 0) {
          bad = -1;
        }
        user.checkPassword(request.password);
        const nquery = { _id: user.id };
        await collections.users?.updateOne(query, { $set: user });
        if (user.id) {
          console.log(process.env.JWT_SECRET);
          console.log(process.env.JWT_REFRESH_SECRET);
          const accessToken = jwtSign(user.id);
          const refreshToken = refreshSign(user.id);
          res.header('Authorization', accessToken)
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "strict"
          });
        }
        user.badAttempts = bad;
        
        res.status(200).json(user);
      } catch (error) {
        if (typeof error === 'string') {
          console.log(error);
          res.status(401).send(error);
        } else if (error instanceof Error) {
          console.log(error.message);
          res.status(401).send(error.message);
        }
      }
    }
  } catch (error) {
    res.status(404).send(`User Not Found: ${req.body.email}`)
  }
});

router.put('/user', auth, async (req: Request, res: Response) => {
  try {
    const data = req.body as UpdateUserRequest;
    const query = { _id: new ObjectId(data.id)};
    const iuser = (await collections.users?.findOne<User>(query)) as IUser;

    if (iuser) {
      const user = new User(iuser);
      switch (data.field.toLowerCase()) {
        case "password":
          user.setPassword(data.value);
          break;
        case "unlock":
          user.badAttempts = 0;
          break;
        case "first":
        case "firstname":
          user.firstName = data.value;
          break;
        case "middle":
        case "middlename":
          user.middleName = data.value;
          break;
        case "last":
        case "lastname":
          user.lastName = data.value;
          break;
      }

      const result = await collections.users?.updateOne(query, { $set: user });
      res.status(200).json(user);
    }

  } catch (error) {
    res.status(404).send(`User Not Found: ${req.body.id}`)
  }
});

router.post('/refresh', auth, async (req: Request, res: Response) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.')
  }

  try {
    const decoded = refreshVerify(refreshToken) as jwt.JwtPayload;
    const accessToken = jwtSign(decoded._id)

    return res
      .header('Authorization', accessToken)
      .send(decoded._id);
  } catch (error) {
    return res.status(400).send('Invalid refresh token.');
  }
});

router.delete('/user/:id', auth, async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.deleteOne(query);
    if (result && result.deletedCount > 0) {
      return res.status(200).send("User deleted");
    }
  } catch (error) {
    res.status(404).send(`Unable to find User: ${id}`);
  }
});

export default router;