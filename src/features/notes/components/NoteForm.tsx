import Button from "@/shared/ui/button/Button";
import InputField from "@/shared/ui/input/InputField";
import { noteValidationSchema } from "@/shared/validation/inputValidation";
import { Form, Formik, FormikHelpers } from "formik";
import { MdOutlineNoteAdd } from "react-icons/md";
import React from "react";

const initialValues = { note: "" };

interface NoteFormProps {
  onSubmit: (values: { note: string }, formikHelpers: FormikHelpers<{ note: string }>) => void;
}
const NoteForm: React.FC<NoteFormProps> = ({ onSubmit }) => {
  return (
    <Formik
      validationSchema={noteValidationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {({ values, isSubmitting }) => {
        return (
          <Form className="my-4">
            <InputField
              type="textarea"
              name="note"
              value={values.note}
              placeholder="Write your note here..."
              maxLength={500}
              rows={6}
              showCharCount
            />
            <Button
              type="submit"
              variant="primary"
              icon={MdOutlineNoteAdd}
              loading={isSubmitting}
              className="mt-2"
              size="sm"
              disabled={isSubmitting}>
              {isSubmitting ? "Creating note..." : "Save note"}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NoteForm;
