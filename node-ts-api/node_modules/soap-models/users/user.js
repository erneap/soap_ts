"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcrypt_1 = require("bcrypt");
class User {
    id;
    email;
    password;
    badAttempts;
    firstName;
    middleName;
    lastName;
    resetToken;
    resetTokenExpires;
    administrator;
    planId;
    constructor(iuser) {
        this.email = (iuser) ? iuser.email : '';
        this.password = (iuser) ? iuser.password : '';
        this.badAttempts = (iuser) ? iuser.badAttempts : 0;
        this.firstName = (iuser) ? iuser.firstName : '';
        this.middleName = (iuser && iuser.middleName) ? iuser.middleName : '';
        this.lastName = (iuser) ? iuser.lastName : '';
        this.id = (iuser && iuser._id) ? iuser._id : undefined;
        this.resetToken = (iuser && iuser.resetToken) ? iuser.resetToken : '';
        this.resetTokenExpires = (iuser && iuser.resetTokenExpires)
            ? new Date(iuser.resetTokenExpires) : new Date(0);
        this.administrator = (iuser) ? iuser.administrator : false;
        this.planId = (iuser && iuser.planId) ? iuser.planId : undefined;
    }
    compareTo(other) {
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
    setPassword(newpwd) {
        const salt = (0, bcrypt_1.genSaltSync)(10);
        const result = (0, bcrypt_1.hashSync)(newpwd, salt);
        this.password = result;
        this.badAttempts = 0;
    }
    checkPassword(pwd) {
        if ((0, bcrypt_1.compareSync)(pwd, this.password)) {
            if (this.badAttempts > 2) {
                throw new Error("Account Locked");
            }
            this.badAttempts = 0;
            return;
        }
        else {
            this.badAttempts++;
            throw new Error("Account Mismatch");
        }
    }
    createRandomPassword() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            + '0123456789';
        const charLength = characters.length;
        for (let i = 0; i < 16; i++) {
            result += characters.charAt(Math.floor(Math.random() * charLength));
        }
        this.setPassword(result);
        this.badAttempts = -1;
        return result;
    }
    unlock() {
        this.badAttempts = 0;
    }
    getFullName() {
        if (this.middleName === '') {
            return this.firstName + ' ' + this.lastName;
        }
        return this.firstName + ' ' + this.middleName.substring(0, 1) + '. '
            + this.lastName;
    }
    getFirstLast() {
        return this.firstName + ' ' + this.lastName;
    }
    getLastFirst() {
        return this.lastName + ', ' + this.firstName;
    }
    setEmailAddress(email) {
        this.email = email;
    }
    getEmailAddress() {
        return this.email;
    }
    setFirstName(first) {
        this.firstName = first;
    }
    getFirstName() {
        return this.firstName;
    }
    setMiddleName(middle) {
        this.middleName = middle;
    }
    getMiddleName() {
        return this.middleName;
    }
    setLastName(last) {
        this.lastName = last;
    }
    getLastName() {
        return this.lastName;
    }
    createResetToken() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            + '0123456789';
        const charLength = characters.length;
        for (let i = 0; i < 16; i++) {
            result += characters.charAt(Math.floor(Math.random() * charLength));
        }
        let now = new Date();
        this.resetTokenExpires = new Date(now.getTime() + 3600000);
        this.resetToken = result;
        return result;
    }
    checkResetToken(token) {
        const now = new Date();
        if (this.resetToken === token
            && now.getTime() < this.resetTokenExpires.getTime()) {
            return true;
        }
        else {
            if (this.resetTokenExpires.getTime() < now.getTime()) {
                throw new Error("Reset Token Expired");
            }
            throw new Error("Reset Token Error");
        }
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map