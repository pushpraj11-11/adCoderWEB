import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(email, password);
      notify("Welcome back", "success");
      navigate("/");
    } catch (error) {
      notify("Invalid credentials", "error");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <h1 className="text-3xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-500">Log in to access your account.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <Link to="/forgot-password" className="text-brand-500">
          Forgot password?
        </Link>
        <Link to="/signup" className="text-brand-500">
          Create account
        </Link>
      </div>
    </div>
  );
};
