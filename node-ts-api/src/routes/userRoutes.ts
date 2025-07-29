import { Router, Request, Response } from 'express';
import { Collection, ObjectId } from 'mongodb';
import { AuthenticationRequest, AuthenticationResponse, IUser, 
  UpdateUserRequest, User, UserEmailRequest } from 'soap-models/dist/users';
import { collections } from '../config/mongoconnect';
import { NewUserRequest, NewUserResponse } from 'soap-models/dist/users';
import * as jwt from 'jsonwebtoken';
import { auth } from '../middleware/authorization.middleware';

const router = Router();

// CRUD Functions 

// ******* Retrieve All Users ********
router.get('/users', auth, async (req: Request, res: Response) => {
  const tusers: Collection | undefined = collections.users;
  if (tusers) {
    const cursor = tusers.find<IUser>({});
    let results = (await cursor.toArray());
    const list: User[] = []
    results.forEach(u => {
      list.push(new User(u));
    });
    list.sort((a,b) => a.compareTo(b));
    return res.status(200).json(list);
  } else {
    console.log("No User Collection");
    res.status(404).send("Unable to find collection");
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

    if (!iuser || iuser === null) {
      throw new Error(`No User Found for address: ${request.email}`);
    } else {
      const user = new User(iuser)
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(404).send(`User Not Found: ${req.body.email}`)
  }
});

// ******* Authenticate User with email address and password ********
router.post('/user/authenticate', async (req: Request, res: Response) => {
  try {
    const request = req.body as AuthenticationRequest;
    const query = { email: request.email };
    const iuser = await collections.users?.findOne<IUser>(query);
    if (!iuser || iuser === null) {
      throw new Error('No User');
    } else {
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
          const key = process.env.JWT_SECRET;
          const expires = process.env.JWT_EXPIRES;
          if (key && expires) {
            const accessToken = jwt.sign({ _id: user.id.toString() }, key,
              { expiresIn: expires as any});
            res.cookie('Authorization', accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60 * 1000,
              sameSite: "strict"
            });
          }
          const rKey = process.env.JWT_REFRESH_SECRET;
          const rExpires = process.env.JWT_REFRESH_EXPIRES;
          if (rKey && rExpires) {
            const refreshToken = jwt.sign({ _id: user.id.toString() }, rKey, {
              expiresIn: rExpires as any,
            });
            res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 24 * 60 * 60 * 1000,
              sameSite: "strict"
            });
          }
        }
        user.badAttempts = bad;
        
        return res.status(200).json(user);
      } catch (error) {
        if (typeof error === 'string') {
          console.log(error);
          return res.status(401).send(error);
        } else if (error instanceof Error) {
          console.log(error.message);
          return res.status(401).send(error.message);
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send(`User Not Found: ${req.body.email}`)
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
  const rToken = req.headers['refreshtoken'];
  if (!rToken) {
    return res.status(401).send('Access Denied. No refresh token provided.')
  }
  const refreshToken = rToken as string;
  const key = (process.env.JWT_SECRET) ? process.env.JWT_SECRET : 'SECRET';
  const secret = (process.env.JWT_REFRESH_SECRET) 
    ? process.env.JWT_REFRESH_SECRET : 'SECRET';
  const expires = (process.env.JWT_EXPIRES)
    ? process.env.JWT_REFRESH_EXPIRES : '1d';

  try {
    const decoded = jwt.verify(refreshToken, secret) as jwt.JwtPayload;
    const accessToken = jwt.sign({ _id: decoded.id.toString() }, key,
              { expiresIn: expires as any});
    return res
      .cookie('Authorization', accessToken, {
          httpOnly: true,
          sameSite: 'strict'
        })
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