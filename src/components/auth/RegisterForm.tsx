import { AuthForm } from "./AuthForm";
import { registerFormSchema, type RegisterFormData } from "@/lib/auth/validation";
import { toast } from "sonner";

export function RegisterForm() {
  const handleSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Registration failed");
        return;
      }

      // Redirect to success page with email parameter
      window.location.href = `/auth/register/success?email=${encodeURIComponent(data.email)}`;
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error); // Log error for debugging
    }
  };

  return (
    <AuthForm<RegisterFormData>
      title="Create Account"
      description="Sign up for a new account to get started"
      schema={registerFormSchema}
      onSubmit={handleSubmit}
      submitText="Sign Up"
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
          placeholder: "Create a password",
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          placeholder: "Confirm your password",
        },
      ]}
      footer={
        <p className="text-sm text-blue-100/90">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-300 hover:text-blue-200">
            Sign in
          </a>
        </p>
      }
    />
  );
}
