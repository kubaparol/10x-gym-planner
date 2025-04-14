import { AuthForm } from "./AuthForm";
import { loginFormSchema, type LoginFormData } from "@/lib/auth/validation";
import { toast } from "sonner";

export function LoginForm() {
  const handleSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid email or password");
      }

      toast.success("Login successful", {
        description: "Redirecting to dashboard...",
      });

      // Redirect to dashboard after successful login
      window.location.href = "/dashboard";
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthForm<LoginFormData>
      title="Welcome Back"
      description="Sign in to your account to continue"
      schema={loginFormSchema}
      onSubmit={handleSubmit}
      submitText="Sign In"
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      ]}
      footer={
        <div className="text-sm text-center space-y-2">
          <p className="text-blue-100/90">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-300 hover:text-blue-200">
              Sign up
            </a>
          </p>
          <p>
            <a href="/reset-password" className="text-blue-300 hover:text-blue-200">
              Forgot your password?
            </a>
          </p>
        </div>
      }
    />
  );
}
