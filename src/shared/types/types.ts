import { ObjectId } from "mongoose";
import { Context } from "telegraf";

export type UserDetails = {
  role: string;
  _id: ObjectId;
};

export interface CustomRequest extends Request {
  session: any; // You can define a more specific type for the session if needed
  user: any;
}

export interface TelegrafContext extends Context {
  message: any;
}
export interface timeINterface {
  date: string;
  time: string;
}

export interface Size {
  h: number;
  w: number;
}
