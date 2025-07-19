import { ObjectId } from "mongodb";
import { genSaltSync, hashSync, compareSync } from 'bcrypt-ts';

export class User {
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

  constructor(id?: ObjectId, email?: string, password?: string, bad?: number, 
    firstName?: string, middleName?: string, lastName?: string,  resetToken?: string, 
    resetExpires?: Date, administrator?: boolean, planId?: ObjectId) {
      this.email = (email) ? email : '';
      this.password = (password) ? password : '';
      this.badAttempts = (bad) ? bad : 0;
      this.firstName = (firstName) ? firstName : '';
      this.middleName = (middleName) ? middleName : '';
      this.lastName = (lastName) ? lastName : '';
      this.id = (id) ? id : undefined;
      this.resetToken = (resetToken) ? resetToken : '';
      this.resetTokenExpires = (resetExpires) ? new Date(resetExpires) : new Date(0);
      this.administrator = (administrator) ? administrator : false;
      this.planId = (planId) ? planId : undefined;
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