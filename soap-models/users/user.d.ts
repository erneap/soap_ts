import { ObjectId } from "mongodb";
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
export declare class User implements IUser {
    _id?: ObjectId;
    id?: ObjectId;
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
    constructor(iuser?: IUser);
    compareTo(other?: User): number;
    setPassword(newpwd: string): void;
    checkPassword(pwd: string): void;
    createRandomPassword(): string;
    unlock(): void;
    getFullName(): string;
    getFirstLast(): string;
    getLastFirst(): string;
    setEmailAddress(email: string): void;
    getEmailAddress(): string;
    setFirstName(first: string): void;
    getFirstName(): string;
    setMiddleName(middle: string): void;
    getMiddleName(): string;
    setLastName(last: string): void;
    getLastName(): string;
    createResetToken(): string;
    checkResetToken(token: string): boolean;
}
