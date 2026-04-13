/**
 * validateRequest.js
 * Middleware to check express-validator results.
 * Use after validation chains in route definitions.
 */

import { validationResult } from "express-validator";
import { HTTP_STATUS } from "../settings/constants.js";

/**
 * Reads validation errors from express-validator.
 * If errors exist → 422 response. Otherwise → next().
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.UNPROCESSABLE).json({
      status:  "error",
      message: "Validation failed",
      errors:  errors.array().map((e) => ({
        field:   e.path,
        message: e.msg,
      })),
    });
  }

  next();
};