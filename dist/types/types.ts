import { Interface } from "readline";


export interface NewUserRequestBody {
    name: String;
    email: String;
    photo: String;
    gender: "male" | "female";
    role: "admin" | "user";
    _id: String;
    dob: Date;
}