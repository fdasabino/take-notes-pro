import * as Yup from "yup";

export const noteValidationSchema = Yup.object().shape({
  note: Yup.string()
    .min(1, "Note must be at least 1 character")
    .max(500, "Note cannot exceed 500 characters")
    .required("Note is required"),
});
