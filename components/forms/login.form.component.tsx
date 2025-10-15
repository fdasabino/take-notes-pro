import { useState } from "react";
import LogoComponent from "@/components/ui/logo/logo.component";
import { ButtonComponent } from "@/components/ui/button/button.component";
import { useAppDispatch } from "@/store/hooks";
import { FaGoogle } from "react-icons/fa";
import { Form, Formik } from "formik";
import { signInValidation } from "@/components/ui/input/validation/input.validation";
import InputComponent from "@/components/ui/input/input.component";
import { MdEmail } from "react-icons/md";
import { AiOutlineArrowRight } from "react-icons/ai";
import { CgLogIn } from "react-icons/cg";
import Link from "next/link";
import { signInWithEmail, signInWithGoogle } from "@/store/thunk/auth.thunk";

const initialValues = {
  login_email: "",
  login_password: "",
};

const LoginFormComponent = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async (values: typeof initialValues) => {
    console.log("Login values:", values);
    const email = values.login_email;
    const password = values.login_password;
    await dispatch(signInWithEmail({ email, password }));
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
            <h2 className="text-foreground">Welcome Back</h2>
            <p className="text-foreground/50 mt-2">Sign in to continue your note-taking journey</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <ButtonComponent
              type="button"
              variant="primary"
              icon={FaGoogle}
              className="w-full"
              onClick={() => dispatch(signInWithGoogle())}>
              Continue with Google
            </ButtonComponent>
          </div>

          {/* Divider */}
          <div className="relative">
            <hr className="border-muted/25" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-foreground/50">
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
                <InputComponent
                  type="email"
                  icon={MdEmail}
                  name="login_email"
                  value={values.login_email}
                  placeholder="Email address"
                />
                <InputComponent
                  type="password"
                  icon={AiOutlineArrowRight}
                  name="login_password"
                  value={values.login_password}
                  placeholder="Password"
                />
                <ButtonComponent
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
                </ButtonComponent>
              </Form>
            )}
          </Formik>
          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="form-checkbox h-4 w-4 text-primary focus:ring-primary"
              />
              <p className="text-foreground/90">Remember me</p>
            </label>
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

export default LoginFormComponent;
