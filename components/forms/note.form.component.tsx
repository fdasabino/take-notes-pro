import { ButtonComponent } from "@/components/ui/button/button.component";
import InputComponent from "@/components/ui/input/input.component";
import { noteValidationSchema } from "@/components/ui/input/validation/input.validation";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";

const initialValues = { note: "" };

interface NoteFormProps {
  onSubmit: (values: { note: string }, formikHelpers: FormikHelpers<{ note: string }>) => void;
}
const NoteFormComponent: React.FC<NoteFormProps> = ({ onSubmit }) => {
  return (
    <Formik
      validationSchema={noteValidationSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {({ values, isSubmitting }) => {
        return (
          <Form className="my-4">
            <InputComponent
              type="textarea"
              name="note"
              value={values.note}
              placeholder="Write your note here..."
              maxLength={500}
              rows={6}
              showCharCount
            />
            <ButtonComponent
              type="submit"
              variant="primary"
              className="mt-2"
              disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Note"}
            </ButtonComponent>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NoteFormComponent;
