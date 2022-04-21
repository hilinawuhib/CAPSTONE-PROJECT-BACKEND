import express from "express";
import createHttpError from "http-errors";
import CoursesModel from "./schema.js";

const coursesRouter = express.Router();

coursesRouter.post("/", async (req, res, next) => {
  try {
    const newCourse = new CoursesModel(req.body);
    const { _id } = await newCourse.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

coursesRouter.get("/", async (req, res, next) => {
  try {
    const courses = await CoursesModel.find();
    res.send(courses);
  } catch (error) {
    next(error);
  }
});

coursesRouter.get("/:courseId", async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    const course = await CoursesModel.findById(courseId);
    if (course) {
      res.send(course);
    } else {
      next(createHttpError(404, `Course with id ${courseId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

coursesRouter.put("/:courseId", async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const updatedCourse = await CoursesModel.findByIdAndUpdate(
      courseId,
      req.body,
      {
        new: true,
      }
    );
    if (updatedCourse) {
      res.send(updatedCourse);
    } else {
      next(createHttpError(404, `Course with id ${courseId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

coursesRouter.delete("/:courseId", async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const deletedCourse = await CoursesModel.findByIdAndDelete(courseId);
    if (deletedCourse) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `course with id ${courseId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
export default coursesRouter;
