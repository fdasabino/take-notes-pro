import Logo from "@/shared/ui/logo/Logo";
import Button from "@/shared/ui/button/Button";
import { useAppDispatch } from "@/store/hooks";
import { FaGoogle } from "react-icons/fa";
import { Form, Formik } from "formik";
import { signInValidation } from "@/shared/validation/inputValidation";
import InputField from "@/shared/ui/input/InputField";
import { MdEmail } from "react-icons/md";
import { AiOutlineArrowRight } from "react-icons/ai";
import { CgLogIn } from "react-icons/cg";
import Link from "next/link";
import { signInWithEmail, signInWithGoogle } from "@/features/auth/api/auth.thunk";
import { FirebaseError } from "firebase/app";
import { showErrorToast, showSuccessToast } from "@/shared/ui/toast/toast";

const initialValues = {
  login_email: "",
  login_password: "",
};

const LoginForm = () => {
  const dispatch = useAppDispatch();

  const handleLogin = async (values: typeof initialValues) => {
    try {
      const email = values.login_email;
      const password = values.login_password;

      const result = await dispatch(signInWithEmail({ email, password }));
      if (signInWithEmail.rejected.match(result)) {
        showErrorToast({ title: "Login failed", message: result.payload || "Unknown error" });
      } else {
        showSuccessToast({ title: "Login successful", message: "Welcome back!" });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        showErrorToast({ title: "Login failed", message: error.message || "Unknown error" });
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await dispatch(signInWithGoogle());
      if (signInWithGoogle.rejected.match(result)) {
        showErrorToast({
          title: "Google sign-in failed",
          message: result.payload || "Unknown error",
        });
      } else {
        showSuccessToast({ title: "Google sign-in successful", message: "Welcome back!" });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        showErrorToast({
          title: "Google sign-in failed",
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
              <Logo
                size={48}
                showText={true}
              />
            </div>
            <h2 className="text-foreground text-lg md:text-2xl">Welcome Back</h2>
            <p className="text-foreground/50 mt-2">Sign in to continue your note-taking journey</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="primary"
              icon={FaGoogle}
              className="w-full"
              onClick={handleGoogleLogin}>
              Continue with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <hr className="border-muted/25" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-foreground/50 text-nowrap">
              or continue with email
            </span>
          </div>
          {/* Email Login Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={signInValidation}
            onSubmit={handleLogin}
            enableReinitialize>
            {({ values, isSubmitting, isValid, errors }) => (
              <Form className="flex flex-col items-center space-y-4 p-4 rounded-lg w-full max-w-lg">
                <InputField
                  type="email"
                  icon={MdEmail}
                  name="login_email"
                  value={values.login_email}
                  placeholder="Email address"
                />
                <InputField
                  type="password"
                  icon={AiOutlineArrowRight}
                  name="login_password"
                  value={values.login_password}
                  placeholder="Password"
                />
                <Button
                  size="md"
                  variant={isValid ? "success" : "danger"}
                  type="submit"
                  className="w-full"
                  disabled={
                    isSubmitting ||
                    errors.login_email !== undefined ||
                    errors.login_password !== undefined
                  }
                  icon={CgLogIn}>
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
          <div className="flex justify-center items-center">
            <div>
              <Link
                href="/auth/reset"
                className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          {/* End of Form  */}
          <p className="text-center text-sm text-foreground/90">
            {"Don't have an account? "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
