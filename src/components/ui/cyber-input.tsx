import * as React from "react";
import { cn } from "@/lib/utils";

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  glow?: boolean;
}

const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, type, glow = false, ...props }, ref) => {
    const glowClass = glow ? "focus:shadow-[0_0_25px_rgba(0,212,255,0.6)]" : "";
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-cyber-accent-blue/30 bg-cyber-bg-secondary/60 px-4 py-3 text-sm text-cyber-text-primary placeholder:text-cyber-text-muted focus:border-cyber-accent-blue focus:shadow-[0_0_20px_rgba(0,212,255,0.5)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 backdrop-blur-sm",
          glowClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CyberInput.displayName = "CyberInput";

export { CyberInput };