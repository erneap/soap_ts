import { Router, Request, Response } from 'express';
import { Collection, ObjectId } from 'mongodb';
import { AuthenticationRequest, IUser, User, UserEmailRequest } from 'soap-models/users';
import { collections } from '../config/mongoconnect';
import { NewUserRequest, NewUserResponse } from 'soap-models/users';
import node from 'bcrypt-ts';

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
        const user = new User(iuser)
        user.checkPassword(request.password);
        const nquery = { _id: user.id };
        await collections.users?.updateOne(query, { $set: user });
        res.status(200).json(user);
      } catch (error) {
        res.status(401).send(error);
      }
    }
  } catch (error) {
    res.status(404).send(`User Not Found: ${req.body.email}`)
  }
});

export default router;