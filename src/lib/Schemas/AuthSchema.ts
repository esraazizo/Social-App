import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is Required")
      .min(3, "minimu length is 3 characters")
      .max(12, "maximu length is 12 characters"),
    username: z
      .string()
      .nonempty("Username is Required")
      .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
      .min(3, "minimu length is 3 characters")
      .max(10, "maximu length is 12 characters"),
    email: z.string().nonempty("Email is required").email("Email not Invalid"),
    dateOfBirth: z
      .string()
      .nonempty("Date of Birth is Required")
      .refine((date) => {
        const currentYear = new Date().getFullYear();
        const userYear = new Date(date).getFullYear();
        const age = currentYear - userYear;
        return age >= 18;
      }, "Age must be older than 18"),
    gender: z.string().nonempty("Gender is Required"),
    password: z
      .string()
      .nonempty("Password is Required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
      ),
    rePassword: z
      .string()
      .nonempty("repassword is Required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
      ),
  })
  .refine(
    (data) => {
      return data.password === data.rePassword;
    },
    {
      path: ["rePassword"],
      message: "Password Not Match",
    },
  );

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Email not Invalid"),

  password: z
    .string()
    .nonempty("Password is Required")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
    ),
});

export type registerSchemaType = z.infer<typeof registerSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;
