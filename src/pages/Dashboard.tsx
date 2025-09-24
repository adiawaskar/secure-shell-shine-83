import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ComplianceRing } from '@/components/ui/compliance-ring';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Search, 
  Wrench, 
  FileText, 
  RotateCcw, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { demoChartData, type ActivityLogEntry } from '@/data/demo';

const SEVERITY_COLORS = {
  critical: '#e11d48',
  high: '#f97316', 
  medium: '#eab308',
  low: '#22c55e'
};

export default function Dashboard() {
  const { 
    complianceMetrics, 
    securityRules, 
    activityLog, 
    isScanning,
    runAudit,
    setIsScanning 
  } = useAppStore();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Calculate quick stats
  const criticalIssues = securityRules.filter(rule => 
    rule.severity === 'critical' && rule.status === 'fail'
  ).length;

  const recentActivity = activityLog.slice(0, 5);

  const pieData = [
    { name: 'Passing', value: complianceMetrics.passingRules, color: '#22c55e' },
    { name: 'Failing', value: complianceMetrics.failingRules, color: '#ef4444' },
    { name: 'Warnings', value: securityRules.filter(r => r.status === 'warning').length, color: '#f59e0b' },
  ];

  const handleQuickAudit = async () => {
    await runAudit('basic');
  };

  const getSeverityBadgeClass = (severity: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full border";
    switch (severity) {
      case 'critical':
        return cn(baseClasses, "severity-critical");
      case 'high':
        return cn(baseClasses, "severity-high"); 
      case 'medium':
        return cn(baseClasses, "severity-medium");
      case 'low':
        return cn(baseClasses, "severity-low");
      default:
        return baseClasses;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Activity className="h-4 w-4 text-primary" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your system security posture</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setTimeRange(timeRange === '7d' ? '30d' : timeRange === '30d' ? '90d' : '7d')}
          >
            <Clock className="h-4 w-4" />
            Last {timeRange}
          </Button>
          <Button 
            variant="gradient" 
            size="lg"
            onClick={handleQuickAudit}
            disabled={isScanning}
            className="min-w-[140px]"
          >
            {isScanning ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Quick Audit
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Compliance"
          value={`${complianceMetrics.overall}%`}
          subtitle="Security posture score"
          icon={Shield}
          trend={{ value: 5.2, isPositive: true }}
        >
          <ComplianceRing 
            percentage={complianceMetrics.overall} 
            size="sm"
            showLabel={false}
          />
        </StatCard>

        <StatCard
          title="Critical Issues"
          value={criticalIssues}
          subtitle={`${criticalIssues > 0 ? 'Requires attention' : 'All clear'}`}
          icon={AlertTriangle}
          className={criticalIssues > 0 ? "border-destructive/30 bg-destructive/5" : ""}
        />

        <StatCard
          title="Rules Checked"
          value={complianceMetrics.totalRules}
          subtitle={`${complianceMetrics.passingRules} passing`}
          icon={CheckCircle}
          trend={{ value: 2.1, isPositive: true }}
        />

        <StatCard
          title="Last Scan"
          value="2m ago"
          subtitle="Automated daily scan"
          icon={Clock}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Overview */}
        <Card className="lg:col-span-2 glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Compliance Trends
            </CardTitle>
            <CardDescription>
              Security posture over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demoChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="compliance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common security tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/cli">
                <Search className="h-4 w-4" />
                Run Full Audit
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/audit">
                <Wrench className="h-4 w-4" />
                Apply Fixes
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/reports">
                <FileText className="h-4 w-4" />
                Generate Report
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/rollback">
                <RotateCcw className="h-4 w-4" />
                View Backups
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Issues */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Top Security Issues
            </CardTitle>
            <CardDescription>Issues requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityRules
                .filter(rule => rule.status === 'fail')
                .sort((a, b) => {
                  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                  return severityOrder[b.severity] - severityOrder[a.severity];
                })
                .slice(0, 5)
                .map((rule, index) => (
                  <div 
                    key={rule.id} 
                    className={cn("flex items-start gap-3 p-3 rounded-lg border stagger-item", 
                      rule.severity === 'critical' ? 'border-critical/20 bg-critical/5' :
                      rule.severity === 'high' ? 'border-destructive/20 bg-destructive/5' :
                      'border-border bg-muted/30'
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm text-foreground truncate">{rule.name}</p>
                        <Badge className={getSeverityBadgeClass(rule.severity)}>
                          {rule.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{rule.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Current: <span className="text-warning">{rule.currentValue}</span> → 
                        Target: <span className="text-success">{rule.desiredValue}</span>
                      </p>
                    </div>
                    <Button variant="ghost" size="icon-sm" asChild>
                      <a href={`/audit?rule=${rule.id}`}>
                        <Wrench className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest security events and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={cn("flex items-start gap-3 stagger-item")}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {getStatusIcon(entry.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">{entry.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(entry.timestamp)}</span>
                      {entry.severity && (
                        <Badge className={getSeverityBadgeClass(entry.severity)}>
                          {entry.severity}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}