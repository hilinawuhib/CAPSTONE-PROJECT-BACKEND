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
// courses with the activities
coursesRouter.get("/:courseId/activity/:activityId", async (req, res, next) => {
  try {
    const course = await CoursesModel.findById(req.params.courseId);
    if (!course) {
      res
        .status(404)
        .send({ message: `course with ${req.params.courseId} is not found!` });
    } else {
      const activityIndex = course.activity.findIndex(
        (activity) => activity._id.toString() === req.params.activityId
      );
      if (activityIndex === -1) {
        res.status(404).send({
          message: `activity with ${req.params.activityId} is not found!`,
        });
      } else {
        course.activity[activityIndex] = {
          ...course.activity[activityIndex]._doc,
          ...req.body,
        };
        await course.save();
        res.status(204).send();
      }
    }
  } catch (error) {
    next(error);
  }
});
coursesRouter.post("/:courseId/activity", async (req, res, next) => {
  try {
    const course = await CoursesModel.findById(req.params.courseId);
    if (!course) {
      res
        .status(404)
        .send({ message: `course with ${req.params.courseId} is not found!` });
    } else {
      const newCourse = await CoursesModel.findByIdAndUpdate(
        req.params.courseId,
        { $push: { activity: req.body } },
        { new: true }
      );
      res.send(newCourse);
    }
  } catch (error) {
    next(error);
  }
});

coursesRouter.put("/:courseId/activity/:activityId", async (req, res, next) => {
  try {
    const course = await CoursesModel.findById(req.params.courseId);
    if (!course) {
      res
        .status(404)
        .send({ message: `course with ${req.params.courseId} is not found!` });
    } else {
      const activityIndex = course.activity.findIndex(
        (activity) => activity._id.toString() === req.params.activityId
      );
      if (activityIndex === -1) {
        res.status(404).send({
          message: `activity with ${req.params.activityId} is not found!`,
        });
      } else {
        course.activity[activityIndex] = {
          ...course.activity[activityIndex]._doc,
          ...req.body,
        };
        await course.save();
        res.status(204).send();
      }
    }
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
  }
});
coursesRouter.delete(
  "/:courseId/activity/:activityId",
  async (req, res, next) => {
    try {
      const course = await CoursesModel.findById(req.params.courseId);
      if (!course) {
        res.status(404).send({
          message: `course with ${req.params.courseId} is not found!`,
        });
      } else {
        await CoursesModel.findByIdAndUpdate(
          req.params.id,
          {
            $pull: {
              activity: { _id: req.params.activityId },
            },
          },
          { new: true }
        );
        res.status(204).send();
      }
    } catch (error) {
      console.log(error);
      res.send(500).send({ message: error.message });
    }
  }
);

export default coursesRouter;
