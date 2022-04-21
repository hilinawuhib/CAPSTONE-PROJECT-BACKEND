import createError from "http-errors";

export const tutorOnlyMiddleware = (req, res, next) => {
  if (req.user.role === "Tutor") {
    next();
  } else {
    next(createError(403, "Tutor only endpoint!"));
  }
};
