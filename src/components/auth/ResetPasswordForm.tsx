import { AuthForm } from "./AuthForm";
import { resetPasswordFormSchema, type ResetPasswordFormData } from "@/lib/auth/validation";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const handleSubmit = async (data: ResetPasswordFormData) => {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send reset password email");
    }

    toast.success("Reset email sent", {
      description: "Please check your email for password reset instructions.",
    });

    // Redirect to login page after successful password reset request
    window.location.href = "/auth/login";
  };

  return (
    <AuthForm<ResetPasswordFormData>
      title="Reset Password"
      description="Enter your email to receive password reset instructions"
      schema={resetPasswordFormSchema}
      onSubmit={handleSubmit}
      submitText="Send Reset Link"
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
      ]}
      footer={
        <p className="text-sm text-blue-100/90">
          Remember your password?{" "}
          <a href="/login" className="text-blue-300 hover:text-blue-200">
            Sign in
          </a>
        </p>
      }
    />
  );
}
