import * as React from "react";
import { cn } from "@/lib/utils";

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  variant?: "default" | "secondary" | "outline";
}

const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, glow = false, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-cyber-bg-secondary/80 border-cyber-accent-pink/30 shadow-[0_0_20px_rgba(255,0,128,0.3)]",
      secondary: "bg-cyber-bg-tertiary/80 border-cyber-accent-blue/30 shadow-[0_0_20px_rgba(0,212,255,0.3)]",
      outline: "bg-transparent border-cyber-accent-green/50 shadow-[0_0_15px_rgba(0,255,136,0.2)]"
    };
    
    const glowClass = glow ? "hover:shadow-[0_0_30px_rgba(255,0,128,0.6)] hover:-translate-y-1" : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          "border rounded-xl backdrop-blur-md transition-all duration-300",
          variants[variant],
          glowClass,
          className
        )}
        {...props}
      />
    );
  }
);

CyberCard.displayName = "CyberCard";

const CyberCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);

CyberCardHeader.displayName = "CyberCardHeader";

const CyberCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-bold leading-none tracking-tight text-cyber-text-primary", className)}
      {...props}
    />
  )
);

CyberCardTitle.displayName = "CyberCardTitle";

const CyberCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-cyber-text-secondary", className)}
      {...props}
    />
  )
);

CyberCardDescription.displayName = "CyberCardDescription";

const CyberCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);

CyberCardContent.displayName = "CyberCardContent";

const CyberCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);

CyberCardFooter.displayName = "CyberCardFooter";

export { CyberCard, CyberCardHeader, CyberCardFooter, CyberCardTitle, CyberCardDescription, CyberCardContent };