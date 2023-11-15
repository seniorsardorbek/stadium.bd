import { ObjectId } from "mongoose";

export type UserDetails = {
  role: string;
  _id: ObjectId;
};

export interface CustomRequest extends Request {
  session: any; // You can define a more specific type for the session if needed
  user: any;
}

export interface timeINterface {
  date: string;
  time: string;
}
