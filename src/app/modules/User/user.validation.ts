import { z } from "zod";
const createUserValidationSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: "User name is required",
      invalid_type_error: "User name must be a string",
    }),
    email: z.string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    }),
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    }),
  }),
});

export const userValidation = {
  createUserValidationSchema,
};
