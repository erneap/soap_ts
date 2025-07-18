import { ObjectId } from "mongodb";

export default class User {
  private id?: ObjectId;
  private email: string;
  private password: string;
  private badAttempts: number;
  private firstName: string;
  private middleName: string;
  private lastName: string;
  private resetToken: string;
  private resetTokenExpires: Date;

  constructor(email: string, password: string, bad: number, first: string, 
    middle: string, last: string, id?: ObjectId, resetToken?: string, 
    resetExpires?: Date) {
      this.email = email;
      this.password = password;
      this.badAttempts = bad;
      this.firstName = first;
      this.middleName = middle;
      this.lastName = last;
      this.id = (id) ? id : undefined;
      this.resetToken = (resetToken) ? resetToken : '';
      this.resetTokenExpires = (resetExpires) ? resetExpires : new Date(0);
    }
  
}