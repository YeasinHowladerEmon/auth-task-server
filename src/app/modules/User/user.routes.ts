import express from "express";
import { UserService } from "./user.service";


const route = express.Router();

route.post("/user/signIn", UserService.signIn); //get
route.post("/user/signUp", UserService.signUp); //create

export default route;