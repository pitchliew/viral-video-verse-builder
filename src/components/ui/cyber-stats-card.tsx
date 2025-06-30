import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CyberProgress } from "./cyber-progress";

interface CyberStatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  progress?: number;
  variant?: "default" | "success" | "warning" | "danger";
  animated?: boolean;
}

const CyberStatsCard = React.forwardRef<HTMLDivElement, CyberStatsCardProps>(
  ({ 
    className, 
    title, 
    value, 
    subtitle, 
    icon, 
    trend, 
    trendValue, 
    progress, 
    variant = "default",
    animated = true,
    ...props 
  }, ref) => {
    const variants = {
      default: "from-cyber-accent-pink/20 to-cyber-accent-purple/20 border-cyber-accent-pink/30",
      success: "from-cyber-accent-green/20 to-emerald-400/20 border-cyber-accent-green/30",
      warning: "from-yellow-400/20 to-orange-400/20 border-yellow-400/30",
      danger: "from-red-500/20 to-pink-500/20 border-red-500/30"
    };

    const iconColors = {
      default: "from-cyber-accent-pink to-cyber-accent-purple",
      success: "from-cyber-accent-green to-emerald-400",
      warning: "from-yellow-400 to-orange-400",
      danger: "from-red-500 to-pink-500"
    };

    const trendColors = {
      up: "text-cyber-accent-green",
      down: "text-red-400",
      neutral: "text-cyber-text-muted"
    };
    
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative p-6 rounded-xl bg-gradient-to-br backdrop-blur-md border transition-all duration-300",
          variants[variant],
          "hover:shadow-[0_0_30px_rgba(255,0,128,0.3)]",
          className
        )}
        {...props}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        </div>
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-cyber-text-secondary">
              {title}
            </div>
            {icon && (
              <div className={cn(
                "w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center",
                iconColors[variant]
              )}>
                {icon}
              </div>
            )}
          </div>
          
          {/* Value */}
          <div className="mb-2">
            {animated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-bold text-cyber-text-primary"
              >
                {value}
              </motion.div>
            ) : (
              <div className="text-3xl font-bold text-cyber-text-primary">
                {value}
              </div>
            )}
          </div>
          
          {/* Subtitle and Trend */}
          <div className="flex items-center justify-between">
            {subtitle && (
              <div className="text-xs text-cyber-text-muted">
                {subtitle}
              </div>
            )}
            {trend && trendValue && (
              <div className={cn("text-xs font-medium", trendColors[trend])}>
                {trend === "up" && "↗"} {trend === "down" && "↘"} {trendValue}
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="mt-4">
              <CyberProgress 
                value={progress} 
                variant={variant} 
                animated={animated}
                className="h-2"
              />
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

CyberStatsCard.displayName = "CyberStatsCard";

export { CyberStatsCard };