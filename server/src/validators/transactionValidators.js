import { body } from "express-validator";

const amountValidator = body("amount")
  .isFloat({ gt: 0 })
  .withMessage("Amount must be greater than zero.")
  .toFloat();

const descriptionValidator = body("description")
  .trim()
  .isLength({ min: 2, max: 160 })
  .withMessage("Description must be between 2 and 160 characters.");

const categoryValidator = body("category")
  .optional({ values: "falsy" })
  .trim()
  .isLength({ min: 2 })
  .withMessage("Category must be at least 2 characters.");

const paymentMethodValidator = body("paymentMethod")
  .trim()
  .notEmpty()
  .withMessage("Payment method is required.");

const dateValidator = body("date").isISO8601().withMessage("A valid date is required.");

export const transactionCreateValidator = [
  amountValidator,
  descriptionValidator,
  categoryValidator,
  paymentMethodValidator,
  dateValidator,
];

export const transactionUpdateValidator = [
  amountValidator.optional(),
  descriptionValidator.optional(),
  categoryValidator,
  paymentMethodValidator.optional(),
  dateValidator.optional(),
];
