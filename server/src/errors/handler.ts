import { ErrorRequestHandler } from "express";
import { ValidationError } from "yup";

interface ValidationErrors {
  [key: string]: string[];
}

const errorHandler: ErrorRequestHandler = (error, req, res) => {
  if (error instanceof ValidationError) {
    let errors: ValidationErrors = {};

    error.inner.forEach((err) => {
      errors[err.path] = err.errors;
    });

    return res.status(400).json({ message: "Validation Error", errors });
  }

  console.error(error);

  return res.status(500).json({ message: "Server Error" });
};

export default errorHandler;