import { Router, Request, Response } from 'express';
import { Collection, ObjectId } from 'mongodb';
import { AuthenticationRequest, AuthenticationResponse, IUser, UpdateUserRequest, User, UserEmailRequest } from 'soap-models/users';
import { collections } from '../config/mongoconnect';
import { NewUserRequest, NewUserResponse } from 'soap-models/users';
import { jwtSign } from 'soap-models/utils';

const router = Router();

// CRUD Functions 

// ******* Retrieve All Users ********
router.get('/users', async (req: Request, res: Response) => {
  const tusers: Collection | undefined = collections.users;
  if (tusers) {
    const cursor = tusers.find<User>({})
    let results = (await cursor.toArray()).sort((a,b) => a.compareTo(b));
    return res.status(200).json(results);
  }
});

// ******** Retrieve a single user from database *******
router.get('/user/:id', async (req: Request, res: Response) => {
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
router.post('/user/find', async (req: Request, res: Response) => {
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
        let token = '';
        if (user.id) {
          token = jwtSign(user.id);
        }
        user.badAttempts = bad;
        const result: AuthenticationResponse = {
          user: user,
          token: token,
          error: '',
        };
        res.status(200).json(result);
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

router.put('/user', async (req: Request, res: Response) => {
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
    }

  } catch (error) {
    res.status(404).send(`User Not Found: ${req.body.id}`)
  }
});

export default router;