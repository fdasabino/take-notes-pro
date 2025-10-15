import { ButtonComponent } from "@/components/ui/button/button.component";
import InputComponent from "@/components/ui/input/input.component";
import { resetValidation } from "@/components/ui/input/validation/input.validation";
import { Form, Formik, FormikHelpers } from "formik";
import { MdEmail, MdArrowForward } from "react-icons/md";
import React from "react";
import LogoComponent from "@/components/ui/logo/logo.component";
import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";
import { resetPassword } from "@/store/thunk/auth.thunk";
import { useAppDispatch } from "@/store/hooks";
import { FirebaseError } from "firebase/app";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast.component";

const initialValues = { email: "" };

const ResetFormComponent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleResetPassword = async (
    values: { email: string },
    { resetForm }: FormikHelpers<{ email: string }>
  ) => {
    try {
      const result = await dispatch(resetPassword({ email: values.email }));
      if (resetPassword.rejected.match(result)) {
        showErrorToast({ title: "Reset failed", message: result.payload || "Unknown error" });
      } else {
        showSuccessToast({
          title: "Email sent",
          message: "Check your inbox to reset your password",
        });
        resetForm();
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        showErrorToast({ title: "Reset failed", message: error.message || "Unknown error" });
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      {/* Left Side - Login Form */}
      <div className="w-full flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <LogoComponent
                size={72}
                showText={true}
              />
            </div>
            <h2 className="text-foreground">Reset Password</h2>
            <p className="text-foreground/50 mt-2">Enter your email to reset your password</p>
          </div>

          <div className="w-full flex justify-center">
            <ButtonComponent
              size="sm"
              variant="primary"
              className="mx-auto"
              icon={BiArrowBack}
              iconPosition="right"
              onClick={() => router.back()}>
              Go Back
            </ButtonComponent>
          </div>
          {/* Divider */}
          <div className="relative">
            <hr className="border-muted/25" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-foreground/50 text-nowrap"></span>
          </div>
          {/* Email Login Form */}
          <Formik
            validationSchema={resetValidation}
            initialValues={initialValues}
            onSubmit={handleResetPassword}>
            {({ values, isSubmitting, isValid, errors }) => {
              return (
                <Form className="my-4">
                  <InputComponent
                    type="email"
                    name="email"
                    icon={MdEmail}
                    value={values.email}
                    placeholder="Enter your email address..."
                    maxLength={100}
                    showCharCount
                  />
                  <ButtonComponent
                    type="submit"
                    variant={isValid ? "success" : "danger"}
                    icon={MdArrowForward}
                    loading={isSubmitting}
                    className="mt-2"
                    size="sm"
                    disabled={isSubmitting || errors.email !== undefined}>
                    {isSubmitting ? "Sending email..." : "Send email"}
                  </ButtonComponent>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetFormComponent;
