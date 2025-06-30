import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  glow?: boolean;
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, glow = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wide";
    
    const variants = {
      primary: "bg-gradient-to-r from-cyber-accent-pink to-cyber-accent-purple text-white border-0 shadow-[0_0_20px_rgba(255,0,128,0.5)] hover:shadow-[0_0_30px_rgba(255,0,128,0.8)] hover:-translate-y-0.5",
      secondary: "bg-gradient-to-r from-cyber-accent-blue to-cyber-accent-green text-white border-0 shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:shadow-[0_0_30px_rgba(0,212,255,0.8)] hover:-translate-y-0.5",
      outline: "border border-cyber-accent-pink text-cyber-accent-pink bg-transparent hover:bg-cyber-accent-pink hover:text-white hover:shadow-[0_0_20px_rgba(255,0,128,0.5)]",
      ghost: "text-cyber-text-secondary hover:text-cyber-accent-pink hover:bg-cyber-bg-tertiary"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm rounded-md",
      md: "px-6 py-3 text-sm rounded-lg",
      lg: "px-8 py-4 text-base rounded-lg"
    };
    
    const glowClass = glow ? "animate-pulse" : "";
    
    return (
      <Comp
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          glowClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CyberButton.displayName = "CyberButton";

export { CyberButton };