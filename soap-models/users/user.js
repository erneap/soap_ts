"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_ts_1 = require("bcrypt-ts");
class User {
    constructor(id, email, password, bad, firstName, middleName, lastName, resetToken, resetExpires, administrator, planId) {
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
    setPassword(newpwd) {
        const salt = (0, bcrypt_ts_1.genSaltSync)(10);
        const result = (0, bcrypt_ts_1.hashSync)(newpwd, salt);
        this.password = result;
        this.badAttempts = 0;
    }
    checkPassword(pwd) {
        if ((0, bcrypt_ts_1.compareSync)(pwd, this.password)) {
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
exports.default = User;
//# sourceMappingURL=user.js.map