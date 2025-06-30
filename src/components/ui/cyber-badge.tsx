import * as React from "react";
import { cn } from "@/lib/utils";

interface CyberBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
  glow?: boolean;
}

const CyberBadge = React.forwardRef<HTMLDivElement, CyberBadgeProps>(
  ({ className, variant = "default", glow = false, ...props }, ref) => {
    const variants = {
      default: "bg-gradient-to-r from-cyber-accent-pink to-cyber-accent-purple shadow-[0_0_15px_rgba(255,0,128,0.4)]",
      secondary: "bg-gradient-to-r from-cyber-accent-blue to-cyber-accent-green shadow-[0_0_15px_rgba(0,212,255,0.4)]",
      success: "bg-gradient-to-r from-cyber-accent-green to-emerald-400 shadow-[0_0_15px_rgba(0,255,136,0.4)]",
      warning: "bg-gradient-to-r from-yellow-400 to-orange-400 shadow-[0_0_15px_rgba(255,193,7,0.4)]",
      danger: "bg-gradient-to-r from-red-500 to-pink-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
    };
    
    const glowClass = glow ? "animate-pulse" : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white uppercase tracking-wide transition-all duration-300",
          variants[variant],
          glowClass,
          className
        )}
        {...props}
      />
    );
  }
);

CyberBadge.displayName = "CyberBadge";

export { CyberBadge };