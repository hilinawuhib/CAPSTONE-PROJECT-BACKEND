import express from "express";
import createHttpError from "http-errors";
import { authenticateUser } from "../../auth/Tools.js";
import { generateJWTToken } from "../../auth/Tools.js";
import UsersModel from "./schema.js";
import { JWTAuthMiddleware } from "../../auth/Token.js";
const usersRouter = express.Router();

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});
usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await UsersModel.findById(userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `user with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const updatedUser = await UsersModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `user with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await UsersModel.findByIdAndDelete(userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `user with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.post("/register", async (req, res, next) => {
  try {
    const user = await new UsersModel(req.body).save();
    delete user._doc.password;

    const token = await generateJWTToken({ id: user._id });

    res.send({ user, token });
  } catch (error) {
    console.log({ error });
    res.send(500).send({ message: error.message });
  }
});
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);
    console.log(user);
    if (user) {
      const accessToken = await authenticateUser(user);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "crediential are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});
export default usersRouter;
