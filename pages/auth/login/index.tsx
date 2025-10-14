import { LoginFormComponent } from "@/components/forms/login.form.component";
import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <LoginFormComponent />
    </div>
  );
};

export default LoginPage;
