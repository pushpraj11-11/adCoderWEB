import React, { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { apiFetch } from "../utils/api";
import { useToast } from "../contexts/ToastContext";

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const { notify } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      notify("Reset email sent (mock)", "success");
    } catch (error) {
      notify("Unable to send reset email", "error");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="text-3xl font-semibold">Reset password</h1>
      <p className="mt-2 text-sm text-slate-500">
        We will email you a reset link.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button className="w-full" type="submit">
          Send reset link
        </Button>
      </form>
    </div>
  );
};
