import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ComplianceRingProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ComplianceRing({ 
  percentage, 
  size = 'md', 
  showLabel = true,
  className 
}: ComplianceRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const sizeConfig = {
    sm: { 
      containerSize: 80, 
      strokeWidth: 4, 
      radius: 36,
      textSize: 'text-sm',
      labelSize: 'text-xs'
    },
    md: { 
      containerSize: 120, 
      strokeWidth: 6, 
      radius: 54,
      textSize: 'text-lg',
      labelSize: 'text-sm'
    },
    lg: { 
      containerSize: 160, 
      strokeWidth: 8, 
      radius: 72,
      textSize: 'text-2xl',
      labelSize: 'text-base'
    }
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);

    return () => clearTimeout(timer);
  }, [percentage]);

  // Color based on compliance score
  const getColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const colorClass = getColor(percentage);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={config.containerSize}
        height={config.containerSize}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.containerSize / 2}
          cy={config.containerSize / 2}
          r={config.radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={config.strokeWidth}
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx={config.containerSize / 2}
          cy={config.containerSize / 2}
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            colorClass,
            "transition-all duration-1000 ease-out drop-shadow-sm"
          )}
          style={{
            filter: 'drop-shadow(0 0 8px currentColor)'
          }}
        />
        
        {/* Glow effect */}
        <circle
          cx={config.containerSize / 2}
          cy={config.containerSize / 2}
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth * 0.5}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            colorClass,
            "transition-all duration-1000 ease-out opacity-30 pulse-ring"
          )}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", config.textSize, colorClass)}>
          {Math.round(animatedPercentage)}%
        </span>
        {showLabel && (
          <span className={cn("text-muted-foreground font-medium", config.labelSize)}>
            Compliance
          </span>
        )}
      </div>
    </div>
  );
}