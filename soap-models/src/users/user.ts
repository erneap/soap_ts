import { ObjectId } from "mongodb";
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export interface IUser {
  _id?: ObjectId;
  email: string;
  password: string;
  badAttempts: number;
  firstName: string;
  middleName: string;
  lastName: string;
  resetToken: string;
  resetTokenExpires: Date;
  administrator: boolean;
  planId?: ObjectId;
}

export class User implements IUser{
  public _id?: ObjectId;
  public id?: ObjectId;
  public email: string;
  public password: string;
  public badAttempts: number;
  public firstName: string;
  public middleName: string;
  public lastName: string;
  public resetToken: string;
  public resetTokenExpires: Date;
  public administrator: boolean;
  public planId?: ObjectId;

  constructor(iuser?: IUser) {
      this.email = (iuser) ? iuser.email : '';
      this.password = (iuser) ? iuser.password : '';
      this.badAttempts = (iuser) ? iuser.badAttempts : 0;
      this.firstName = (iuser) ? iuser.firstName : '';
      this.middleName = (iuser && iuser.middleName) ? iuser.middleName : '';
      this.lastName = (iuser) ? iuser.lastName : '';
      this.id = (iuser && iuser._id) ? iuser._id : undefined;
      this._id = (iuser && iuser._id) ? iuser._id : undefined;
      this.resetToken = (iuser && iuser.resetToken) ? iuser.resetToken : '';
      this.resetTokenExpires = (iuser && iuser.resetTokenExpires) 
        ? new Date(iuser.resetTokenExpires) : new Date(0);
      this.administrator = (iuser) ? iuser.administrator : false;
      this.planId = (iuser && iuser.planId) ? iuser.planId : undefined;
    }

    compareTo(other?: User): number {
      if (other) {
        if (this.lastName === other.lastName) {
          if (this.firstName === other.firstName) {
            return (this.middleName < other.middleName) ? -1 : 1;
          }
          return (this.firstName < other.firstName) ? -1 : 1;
        }
        return (this.lastName < other.lastName) ? -1 : 1;
      }
      return -1;
    }
  
    setPassword(newpwd: string): void {
      const salt = genSaltSync(10);
      const result = hashSync(newpwd, salt);
      this.password = result;
      this.badAttempts = 0;
    }

    checkPassword(pwd: string): void {
      if (compareSync(pwd, this.password)) {
        if (this.badAttempts > 2) {
          throw new Error("Account Locked")
        }
        this.badAttempts = 0;
        return;
      } else {
        this.badAttempts++;
        throw new Error("Account Mismatch");
      }
    }

    createRandomPassword(): string {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        + '0123456789';
      const charLength = characters.length;
      for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength))
      }
      this.setPassword(result);
      this.badAttempts = -1;
      return result;
    }

    unlock(): void {
      this.badAttempts = 0;
    }

    getFullName(): string {
      if (this.middleName === '') {
        return this.firstName + ' ' + this.lastName;
      }
      return this.firstName + ' ' + this.middleName.substring(0,1) + '. '
        + this.lastName;
    }

    getFirstLast(): string {
      return this.firstName + ' ' + this.lastName;
    }

    getLastFirst(): string {
      return this.lastName + ', ' + this.firstName;
    }

    setEmailAddress(email: string) {
      this.email = email;
    }

    getEmailAddress(): string {
      return this.email;
    }

    setFirstName(first: string) {
      this.firstName = first;
    }

    getFirstName(): string {
      return this.firstName;
    }

    setMiddleName(middle: string) {
      this.middleName = middle;
    }

    getMiddleName(): string {
      return this.middleName;
    }

    setLastName(last: string) {
      this.lastName = last;
    }

    getLastName(): string {
      return this.lastName;
    }

    createResetToken(): string {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        + '0123456789';
      const charLength = characters.length;
      for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength))
      }
      let now = new Date();
      this.resetTokenExpires = new Date(now.getTime() + 3600000);
      this.resetToken = result;
      return result;
    }

    checkResetToken(token: string): boolean {
      const now = new Date();
      if (this.resetToken === token 
        && now.getTime() < this.resetTokenExpires.getTime()) {
        return true;
      } else {
        if (this.resetTokenExpires.getTime() < now.getTime()) {
          throw new Error("Reset Token Expired");
        }
        throw new Error("Reset Token Error");
      }
    }
}