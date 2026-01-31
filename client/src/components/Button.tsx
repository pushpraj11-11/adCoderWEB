import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const styles = {
  primary: "bg-slate-900 text-white hover:bg-slate-800",
  secondary: "bg-white text-slate-900 border border-slate-200 hover:border-slate-300",
  ghost: "bg-transparent text-slate-600 hover:text-slate-900"
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition",
        styles[variant],
        className
      )}
      {...props}
    />
  );
};
