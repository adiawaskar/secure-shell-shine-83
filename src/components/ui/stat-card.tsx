import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  children?: ReactNode;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  children
}: StatCardProps) {
  return (
    <div className={cn(
      "glass-card hover-lift border border-border/50 bg-card/50 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {Icon && (
              <Icon className="h-4 w-4 text-muted-foreground" />
            )}
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <span className={cn(
                "text-sm font-medium flex items-center",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
          </div>
          
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
}