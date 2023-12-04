import { Request, Response } from "express";
import { User } from "./user.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config";
import httpStatus from "http-status";

const signUp = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { email: userEmail } = req.body;

    const isUserExist = await User.findOne({ email: userEmail });
    console.log(isUserExist);
    if (isUserExist) {
      const errorResponse = {
        statusCode: httpStatus.CONFLICT,
        success: false,
        message: "User already exist"
      };
      return res.status(httpStatus.CONFLICT).json(errorResponse);
    }
    const result = await User.create(req.body);
    const { _id: userId, email } = result;
    const accessToken = jwt.sign(
      { userId, email },
      config.jwt.secret as Secret,
      {
        expiresIn: config.jwt.expires_in as string
      }
    );

    const successResponse = {
      statusCode: httpStatus.Ok,
      success: true,
      message: "User Sign up SuccessFully",
      data: accessToken
    };
    return res.status(httpStatus.OK).json(successResponse);
  } catch (error) {
    return res.status(httpStatus.OK).json(error);
  }
};
const signIn = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      const errorResponse = {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "User does not exist"
      };
      return res.status(httpStatus.NOT_FOUND).json(errorResponse);
    }
    if (isUserExist.password && isUserExist?.password !== password) {
      const errorResponse = {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Password is InCorrect"
      };
      return res.status(httpStatus.UNAUTHORIZED).json(errorResponse);
    }
    const userId = isUserExist._id;
    const emailed = isUserExist.email;
    const accessToken = jwt.sign(
      { userId, emailed },
      config.jwt.secret as Secret,
      {
        expiresIn: config.jwt.expires_in as string
      }
    );

    const successResponse = {
      statusCode: httpStatus.Ok,
      success: true,
      message: "User Sign in SuccessFully",
      data: accessToken
    };
    return res.status(httpStatus.OK).json(successResponse);
  } catch (error) {
    return res.status(httpStatus.OK).json(error);
  }
};

export const UserService = {
  signIn,
  signUp
};
