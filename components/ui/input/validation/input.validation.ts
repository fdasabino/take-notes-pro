import * as Yup from "yup";

export const noteValidationSchema = Yup.object().shape({
  note: Yup.string()
    .min(1, "Note must be at least 1 character")
    .max(500, "Note cannot exceed 500 characters")
    .required("Note is required"),
});

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 20;

export const signInValidation = Yup.object().shape({
  login_email: Yup.string()
    .email("Please enter a valid email address...")
    .required("Email address is required..."),
  login_password: Yup.string()
    .required("Password is required...")
    .min(6, `Password is too short (minimum ${MIN_PASSWORD_LENGTH} characters)`)
    .max(20, `Password is too long (maximum ${MAX_PASSWORD_LENGTH} characters)`),
});

export const resetValidation = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address...")
    .required("Email address is required..."),
});

export const registerValidation = Yup.object().shape({
  email_address: Yup.string()
    .email("Please enter a valid email address...")
    .required("Email address is required..."),
  create_password: Yup.string()
    .required("Password is required...")
    .min(MIN_PASSWORD_LENGTH, `Password is too short (minimum ${MIN_PASSWORD_LENGTH} characters)`)
    .max(MAX_PASSWORD_LENGTH, `Password is too long (maximum ${MAX_PASSWORD_LENGTH} characters)`),
  repeat_password: Yup.string()
    .oneOf([Yup.ref("create_password"), undefined], "Passwords must match")
    .required("Please confirm your password"),
});
