"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-mint/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variant === "primary" &&
            "bg-navy text-white hover:bg-navy-light",
          variant === "secondary" &&
            "bg-mint text-white hover:bg-mint-dark",
          variant === "outline" &&
            "border border-border bg-white text-foreground hover:bg-muted",
          variant === "ghost" &&
            "text-foreground hover:bg-muted",
          variant === "destructive" &&
            "bg-destructive text-white hover:bg-red-600",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
