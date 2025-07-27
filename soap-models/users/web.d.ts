import { User } from "./user";
export interface NewUserRequest {
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
}
export interface NewUserResponse {
    user: User;
    password: string;
}
export interface AuthenticationResponse {
    user: User;
    token: string;
    error: string;
}
export interface AuthenticationRequest {
    email: string;
    password: string;
}
export interface UserEmailRequest {
    email: string;
}
export interface UpdateUserRequest {
    id: string;
    field: string;
    value: string;
}
