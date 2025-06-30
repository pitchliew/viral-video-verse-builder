import * as React from "react";
import { cn } from "@/lib/utils";

interface CyberProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  animated?: boolean;
  showValue?: boolean;
}

const CyberProgress = React.forwardRef<HTMLDivElement, CyberProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", animated = false, showValue = false, ...props }, ref) => {
    const percentage = Math.min((value / max) * 100, 100);
    
    const variants = {
      default: "from-cyber-accent-pink to-cyber-accent-purple",
      success: "from-cyber-accent-green to-emerald-400",
      warning: "from-yellow-400 to-orange-400",
      danger: "from-red-500 to-pink-500"
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full h-3 bg-cyber-bg-secondary/60 rounded-full overflow-hidden border border-cyber-accent-pink/20",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r",
            variants[variant],
            animated && "animate-pulse"
          )}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Glow effect */}
        <div
          className={cn(
            "absolute top-0 h-full rounded-full bg-gradient-to-r opacity-50 blur-sm",
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
        
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    );
  }
);

CyberProgress.displayName = "CyberProgress";

export { CyberProgress };