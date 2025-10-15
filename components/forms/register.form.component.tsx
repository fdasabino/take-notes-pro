import LogoComponent from "@/components/ui/logo/logo.component";
import { ButtonComponent } from "@/components/ui/button/button.component";
import { useAppDispatch } from "@/store/hooks";
import { Form, Formik } from "formik";
import { registerValidation } from "@/components/ui/input/validation/input.validation";
import InputComponent from "@/components/ui/input/input.component";
import { MdEmail } from "react-icons/md";
import { AiOutlineArrowRight } from "react-icons/ai";
import { CgLogIn } from "react-icons/cg";
import Link from "next/link";
import { signUpWithEmail } from "@/store/thunk/auth.thunk";
import { FirebaseError } from "firebase/app";
import { showErrorToast, showSuccessToast } from "@/components/ui/toast/toast.component";

const initialValues = {
  email_address: "",
  create_password: "",
  repeat_password: "",
};

const RegisterFormComponent = () => {
  const dispatch = useAppDispatch();

  const handleRegister = async (values: typeof initialValues) => {
    try {
      const email = values.email_address;
      const password = values.create_password;

      const result = await dispatch(signUpWithEmail({ email, password }));
      if (signUpWithEmail.rejected.match(result)) {
        showErrorToast({
          title: "Registration failed",
          message: result.payload || "Unknown error",
        });
      } else {
        showSuccessToast({ title: "Registration successful", message: "Welcome aboard!" });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        showErrorToast({
          title: "Registration failed",
          message: error.message || "Unknown error",
        });
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
            <h2 className="text-foreground">Register</h2>
            <p className="text-foreground/50 mt-2">
              Create an account to start your note-taking journey
            </p>
          </div>

          {/* Email Login Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={registerValidation}
            onSubmit={handleRegister}
            enableReinitialize>
            {({ values, isSubmitting, isValid, errors }) => {
              console.log(errors);
              return (
                <Form className="flex flex-col items-center space-y-4 p-4 rounded-lg w-full max-w-lg">
                  <InputComponent
                    type="email"
                    icon={MdEmail}
                    name="email_address"
                    value={values.email_address}
                    placeholder="Email address"
                  />
                  <InputComponent
                    type="password"
                    icon={AiOutlineArrowRight}
                    name="create_password"
                    value={values.create_password}
                    placeholder="Password"
                  />
                  <InputComponent
                    type="password"
                    icon={AiOutlineArrowRight}
                    name="repeat_password"
                    value={values.repeat_password}
                    placeholder="Repeat Password"
                  />
                  <ButtonComponent
                    size="md"
                    variant={isValid ? "success" : "danger"}
                    type="submit"
                    className="w-full"
                    disabled={
                      isSubmitting ||
                      errors.email_address !== undefined ||
                      errors.create_password !== undefined ||
                      errors.repeat_password !== undefined
                    }
                    icon={CgLogIn}>
                    Sign In
                  </ButtonComponent>
                </Form>
              );
            }}
          </Formik>
          <div className="flex justify-center items-center">
            <Link
              href="/auth/login"
              className="text-sm text-primary hover:underline">
              Already have an account?{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterFormComponent;
