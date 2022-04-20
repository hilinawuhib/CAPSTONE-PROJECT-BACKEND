import express from "express";
import cors from "cors";
import usersRouter from "./services/users/index.js";
import coursesRouter from "./services/courses/index.js";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";

const server = express();
const port = 3005;

server.use(cors());
server.use(express.json());
server.use("/users", usersRouter);
server.use("/courses", coursesRouter);
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
console.table(listEndpoints(server));

mongoose.connect(process.env.MONGO_CONNECTION);
mongoose.connection.on("connected", () => {
  console.log("successfully connected to mongo");
  server.listen(port, () => {
    console.log("server running on port ", port);
  });
});
