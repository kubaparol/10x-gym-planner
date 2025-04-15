import { AuthForm } from "./AuthForm";
import { newPasswordFormSchema, type NewPasswordFormData } from "@/lib/auth/validation";
import { toast } from "sonner";

interface NewPasswordFormProps {
  token: string;
}

export function NewPasswordForm({ token }: NewPasswordFormProps) {
  const handleSubmit = async (data: NewPasswordFormData) => {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        token,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reset password");
    }

    toast.success("Password reset successful", {
      description: "You can now sign in with your new password.",
    });

    // Redirect to login page after successful password reset
    window.location.href = "/login";
  };

  return (
    <AuthForm<NewPasswordFormData>
      title="Set New Password"
      description="Create a new password for your account"
      schema={newPasswordFormSchema}
      onSubmit={handleSubmit}
      submitText="Reset Password"
      fields={[
        {
          name: "password",
          label: "New Password",
          type: "password",
          placeholder: "Enter your new password",
        },
        {
          name: "confirmPassword",
          label: "Confirm New Password",
          type: "password",
          placeholder: "Confirm your new password",
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
