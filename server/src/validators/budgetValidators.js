import { body } from "express-validator";

export const budgetValidator = [
  body("category").trim().notEmpty().withMessage("Category is required."),
  body("monthlyLimit")
    .isFloat({ gt: 0 })
    .withMessage("Monthly budget must be greater than zero.")
    .toFloat(),
];
