import { Router, Request, Response } from 'express';
import { Collection, ObjectId } from 'mongodb';
import { AuthenticationRequest, AuthenticationResponse, IUser, 
  UpdateUserRequest, User, UserEmailRequest } from 'soap-models/users';
import { collections } from '../config/mongoconnect';
import { NewUserRequest, NewUserResponse } from 'soap-models/users';
import * as jwt from 'jsonwebtoken';
import { auth } from '../middleware/authorization.middleware';
import { sendMail } from '../config/emailer';

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
    return res.status(404).send("Unable to find collection");
  }
});

// ******** Retrieve a single user from database *******
router.get('/user/:id', auth, async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const query = { _id: new ObjectId(id) };
    const user = (await collections.users?.findOne<User>(query)) as User;

    if (user && user !== null) {
      res.status(200).json(user);
    }
  } catch (error) {
    return res.status(404).send(`Unable to find User: ${id}`);
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
    user.translationId = newuser.translation;
    user.planId = newuser.plan;
    const tempPassword = user.createRandomPassword();

    const query = { email: newuser.email };
    const oldUser = await collections.users?.findOne<User>(query);

    if (oldUser) {
      return res.status(403).send('User already present');
    }
    const result = await collections.users?.insertOne(user);

    if (result) {
      user.id = result.insertedId.toString();
      const newResponse: NewUserResponse = {
        user: user,
        password: tempPassword,
      };

      // TODO:  send an email with the new password
      let message = '<!DOCTYPE html>\n<html>\n<head>\n<style>\n'
        + 'body { background-color:lightblue;display:flex;flex-direction:column;'
        + 'justify-content:center;align-items:center;padding:10px;}\n'
        + 'div.main {display:flex;flex-direction:column;justify-content:center;'
        + 'align-items: center;}\n'
        + 'div.password {background-color:blue;color:white;display:flex;'
        + 'flex-direction:column;justify-content:center;align-items:center;'
        + 'padding: 10px;}\n'
        + '</style>\n</head>\n<body>\n'
        + '<h1>Soap Journal Web Application</h1>\n'
        + '<h2>Thank you for creating an account at soapjournal.org</h2>\n'
        + '<div class="main">\n'
        + '<p>The account you created will allow you to create journal entries, '
        + 'create and maintain a reading plan, and read the bible according to '
        + 'your choosen plan.</p>\n'
        + "<p>We are glad that you've choosen to enrich your life through faith!"
        + '</p>\n<div class="password">\n'
        + '<p>The following is your temporary password, use it to log into the '
        + 'application:</p>\n'
        + `<h2 style="color: yellow;">${tempPassword}</h2>\n`
        + '<p style="color:lightpink;text-decoration: underline;">\n'
        + 'You will be required to change your password after the first log in.\n'
        + '</p>\n</div>\n<div style="margin-top: 25px;">Thanks again, the '
        + 'webmaster.</div>\n</div>\n</body>\n</html>\n';

      try {
        await sendMail(user.email, 'New Account Creation', message);
      } catch (error) {
        console.log(error);
      }
      
      return res.status(201).json(newResponse);
    } else {
      return res.status(500).send("Failed to create new user");
    }
  } catch (error) {
    return res.status(400).send(error)
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
    if (error instanceof Error) {
      return res.status(404).send(error.message);
    } else if (typeof error === "string") {
      return res.status(404).send(error);
    } else {
      return res.status(500).send(error);
    }
  }
});

// ******* Authenticate User with email address and password ********
router.post('/user/authenticate', async (req: Request, res: Response) => {
  try {
    const request = req.body as AuthenticationRequest;
    const query = { email: request.email };
    const iuser = await collections.users?.findOne<IUser>(query);
    if (!iuser || iuser === null) {
      throw new Error('No User Found');
    } else {
      try {
        const user = new User(iuser);
        let bad = 0;
        if (user.badAttempts < 0) {
          bad = -1;
        }
        user.checkPassword(request.password);
        user.badAttempts = bad;
        const nquery = { _id: user.id };
        await collections.users?.updateOne(query, { $set: user });
        if (user.id) {
          const key = process.env.JWT_SECRET;
          const expires = process.env.JWT_EXPIRES;
          if (key && expires) {
            const accessToken = jwt.sign({ _id: user.id.toString() }, key,
              { expiresIn: expires as any});
            res.setHeader('authorization', accessToken);
          }
          const rKey = process.env.JWT_REFRESH_SECRET;
          const rExpires = process.env.JWT_REFRESH_EXPIRES;
          if (rKey && rExpires) {
            const refreshToken = jwt.sign({ _id: user.id.toString() }, rKey, {
              expiresIn: rExpires as any,
            });
            res.setHeader('refreshToken', refreshToken);
          }
        }
        
        return res.status(200).json(user);
      } catch (error) {
        if (typeof error === 'string') {
          console.log(error);
          return res.status(401).send(error);
        } else if (error instanceof Error) {
          console.log(error.message);
          return res.status(401).send(error.message);
        } else {
          return res.status(500).send(error);
        }
      }
    }
  } catch (error) {
    if (typeof error === 'string') {
      console.log(error);
      return res.status(401).send(error);
    } else if (error instanceof Error) {
      console.log(error.message);
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send(error);
    }
  }
});

router.put('/user', auth, async (req: Request, res: Response) => {
  try {
    const data = req.body as UpdateUserRequest;
    const query = { _id: new ObjectId(data.id)};
    const iuser = await collections.users?.findOne<User>(query);

    if (!iuser || iuser === null) {
      throw new Error("User Not Found for Update");
    } else {
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
        case "plan":
          user.planId = data.value;
          break;
        case "translation":
          user.translationId = data.value;
          break;
        case "email":
          user.email = data.value;
          break;
      }

      const result = await collections.users?.updateOne(query, { $set: user });
      res.status(200).json(user);
    }

  } catch (error) {
    if (typeof error === 'string') {
      console.log(error);
      return res.status(401).send(error);
    } else if (error instanceof Error) {
      console.log(error.message);
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send(error);
    }
  }
});

router.put('/user/mustchange', auth, async(req: Request, res: Response) => {
  try {
    const data = req.body as UpdateUserRequest;
    const query = { email: data.id };
    const iuser = await collections.users?.findOne<User>(query);

    if (!iuser || iuser === null) {
      throw new Error("User Not Found for Update");
    } else {
      const user = new User(iuser);
      user.setPassword(data.value);

      const result = await collections.users?.updateOne(query, { $set: user });
      res.status(200).json(user);
    }
  } catch (error) {
    if (typeof error === 'string') {
      console.log(error);
      return res.status(401).send(error);
    } else if (error instanceof Error) {
      console.log(error.message);
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send(error);
    }
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

router.put('/user/forgot', async(req: Request, res: Response) => {
  try {
    const request = req.body as UpdateUserRequest;
    const email = request.id;

    const query = { email: email };
    const iUser = await collections.users?.findOne<IUser>(query);
    if (iUser) {
      const user = new User(iUser)
      const result = user.createResetToken();
      const nquery = { _id: new ObjectId(user.id)};
      await collections.users?.updateOne(nquery, { $set: user });

      let message = '<!DOCTYPE html>\n<html>\n<head>\n<style>\n'
        + 'body { background-color:lightblue;display:flex;flex-direction:column;'
        + 'justify-content:center;align-items:center;padding:10px;}\n'
        + 'div.main {display:flex;flex-direction:column;justify-content:center;'
        + 'align-items: center;}\n'
        + 'div.password {background-color:blue;color:white;display:flex;'
        + 'flex-direction:column;justify-content:center;align-items:center;'
        + 'padding: 10px;}\n'
        + '</style>\n</head>\n<body>\n'
        + '<h1>Soap Journal Web Application</h1>\n'
        + '<h2>Forgot Your Password</h2>\n'
        + '<div class="main">\n<p>\n'
        + "You have notified the site that you've forgotten your password.  The "
        + "process for re-establishing log in privileges is in effect.  Please "
        + "copy the token string below and click the link to get you back to a "
        + "web page to change your forgotten password.\n</p>\n"
        + "<p>We are glad that you've choosen to enrich your life through faith!</p>\n"
        + '<div class="password">\n'
        + '<p>The following is your token string to verify you are the account '
        + `holder:</p>\n<h2 style="color: yellow;">${result}</h2>\n`
        + '<p style="color:lightpink;text-decoration: underline;">\n'
        + '<a href="http://www.soapjournal.org/forgot">Link back to site</a>\n'
        + '</p>\n</div>\n<div style="margin-top: 25px;">'
        + 'Thanks again, the webmaster.</div>\n</div>\n</body>\n</html>';

      try {
        await sendMail(user.email, 'Forgot Password Token', message);
      } catch (error) {
        console.log(error);
      }
      return res.status(200).json(user);
    } else {
      throw new Error("User Not Found");
    }
  } catch (error) {
    console.log(error);
    if (typeof error === 'string') {
      console.log(error);
      return res.status(401).send(error);
    } else if (error instanceof Error) {
      console.log(error.message);
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send(error);
    }
  }
});

router.put('/user/forgot2', async (req: Request, res: Response) => {
  try {
    const request = req.body as UpdateUserRequest;
    const email = request.id;

    const query = { email: email };
    const iUser = await collections.users?.findOne<IUser>(query);
    if (iUser) {
      const user = new User(iUser);
      const now = new Date();
      if (now.getTime() <= user.resetTokenExpires.getTime() 
        && user.resetToken === request.field) {
        user.setPassword(request.value);
        user.resetToken = '';
        user.resetTokenExpires = new Date(0);
        await collections.users?.updateOne(query, { $set: user });
        return res.status(200).json(user);
      } else {
        if (now.getTime() > user.resetTokenExpires.getTime()) {
          throw new Error("Reset Token Expired.  They are only good for 1 hour");
        } else {
          throw new Error("Reset Token was not correct, try again");
        }
      }
    } else {
      throw new Error("User Not Found");
    }
  } catch (error) {
    console.log(error);
    if (typeof error === 'string') {
      console.log(error);
      return res.status(401).send(error);
    } else if (error instanceof Error) {
      console.log(error.message);
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send(error);
    }
  }
});

router.delete('/user/:id', auth, async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.deleteOne(query);
    if (result && result.deletedCount > 0) {
      return res.status(200).send("User deleted");
    } else {
      return res.status(404).send('User not deleted, Not Found');
    }
  } catch (error) {
    return res.status(404).send(`Unable to find User: ${id}`);
  }
});

export default router;