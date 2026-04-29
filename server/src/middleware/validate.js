import { validationResult } from "express-validator";
import httpError from "../utils/httpError.js";

const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      httpError(
        422,
        errors
          .array()
          .map((error) => error.msg)
          .join(", "),
      ),
    );
  }

  next();
};

export default validate;
