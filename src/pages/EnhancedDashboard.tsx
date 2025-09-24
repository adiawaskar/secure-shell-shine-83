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
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Users,
  Server,
  Database,
  Network,
  Lock,
  Eye,
  Zap,
  Globe,
  Cpu,
  HardDrive
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { cn } from '@/lib/utils';
import { demoChartData, type ActivityLogEntry } from '@/data/demo';

const SEVERITY_COLORS = {
  critical: '#e11d48',
  high: '#f97316', 
  medium: '#eab308',
  low: '#22c55e'
};

const CHART_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#a855f7', '#06b6d4'];

// Additional demo data for enhanced visualizations
const severityDistribution = [
  { name: 'Critical', value: 12, color: '#e11d48' },
  { name: 'High', value: 28, color: '#f97316' },
  { name: 'Medium', value: 45, color: '#eab308' },
  { name: 'Low', value: 15, color: '#22c55e' }
];

const systemMetrics = [
  { name: 'CPU', value: 68, color: '#3b82f6' },
  { name: 'Memory', value: 82, color: '#ef4444' },
  { name: 'Disk', value: 45, color: '#f59e0b' },
  { name: 'Network', value: 73, color: '#22c55e' }
];

const weeklyData = [
  { day: 'Mon', scans: 24, threats: 3, blocked: 18 },
  { day: 'Tue', scans: 31, threats: 5, blocked: 22 },
  { day: 'Wed', scans: 28, threats: 2, blocked: 15 },
  { day: 'Thu', scans: 35, threats: 7, blocked: 28 },
  { day: 'Fri', scans: 42, threats: 4, blocked: 31 },
  { day: 'Sat', scans: 18, threats: 1, blocked: 12 },
  { day: 'Sun', scans: 15, threats: 2, blocked: 8 }
];

const threatTypes = [
  { name: 'Malware', value: 35, color: '#e11d48' },
  { name: 'Phishing', value: 28, color: '#f97316' },
  { name: 'Vulnerabilities', value: 22, color: '#eab308' },
  { name: 'Policy Violations', value: 15, color: '#06b6d4' }
];

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
    <div className="page-container space-y-4 md:space-y-6 min-h-screen bg-background w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">SecureShell Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Comprehensive security monitoring and management</p>
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
            variant="default" 
            size="lg"
            onClick={handleQuickAudit}
            disabled={isScanning}
            className="min-w-[140px] glow-primary"
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

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        <StatCard
          title="Overall Compliance"
          value={`${complianceMetrics.overall}%`}
          subtitle="Security posture"
          icon={Shield}
          trend={{ value: 5.2, isPositive: true }}
          className="glow-primary"
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
          subtitle="Need attention"
          icon={AlertTriangle}
          className={cn(criticalIssues > 0 ? "border-destructive/30 bg-destructive/5 glow-critical" : "glow-success")}
        />

        <StatCard
          title="Active Threats"
          value="7"
          subtitle="Blocked today"
          icon={Zap}
          className="glow-warning"
        />

        <StatCard
          title="Systems Online"
          value="24/26"
          subtitle="Network status"
          icon={Server}
          trend={{ value: 1.2, isPositive: true }}
        />

        <StatCard
          title="Last Scan"
          value="2m ago"
          subtitle="Auto scan"
          icon={Clock}
        />

        <StatCard
          title="Data Protected"
          value="2.4TB"
          subtitle="Encrypted"
          icon={Database}
          trend={{ value: 8.1, isPositive: true }}
        />
      </div>

      {/* Enhanced Visualization Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Main Compliance Chart */}
        <Card className="xl:col-span-2 mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Security Trends & Analytics
            </CardTitle>
            <CardDescription>Real-time security metrics and compliance tracking</CardDescription>
          </CardHeader>
          <CardContent className="chart-container">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demoChartData}>
                  <defs>
                    <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area 
                    type="monotone" 
                    dataKey="compliance" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1}
                    fill="url(#complianceGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Metrics Radial Chart */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              System Health
            </CardTitle>
            <CardDescription>Resource utilization metrics</CardDescription>
          </CardHeader>
          <CardContent className="chart-container">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart data={systemMetrics} innerRadius="30%" outerRadius="90%">
                  <RadialBar dataKey="value" cornerRadius={10} fill="#3b82f6" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Threat Distribution */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Threat Distribution
            </CardTitle>
            <CardDescription>Security threat categories</CardDescription>
          </CardHeader>
          <CardContent className="chart-container">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={threatTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {threatTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Scans and threat detection</CardDescription>
          </CardHeader>
          <CardContent className="chart-container">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="scans" fill="#3b82f6" />
                  <Bar dataKey="threats" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Enhanced */}
        <Card className="mobile-card glow-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Essential security operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start hover:glow-primary" asChild>
              <a href="/cli">
                <Search className="h-4 w-4" />
                Full System Audit
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start hover:glow-success" asChild>
              <a href="/audit">
                <Wrench className="h-4 w-4" />
                Apply Security Fixes
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start hover:glow-warning" asChild>
              <a href="/reports">
                <FileText className="h-4 w-4" />
                Generate Report
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/rollback">
                <RotateCcw className="h-4 w-4" />
                System Restore
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/profiles">
                <Lock className="h-4 w-4" />
                Security Profiles
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Enhanced Top Issues */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Critical Security Issues
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
                    className={cn("flex items-start gap-3 p-3 rounded-lg border stagger-item hover-lift", 
                      rule.severity === 'critical' ? 'border-critical/20 bg-critical/5 glow-critical' :
                      rule.severity === 'high' ? 'border-destructive/20 bg-destructive/5 glow-warning' :
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
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/audit?rule=${rule.id}`}>
                        <Wrench className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Recent Activity */}
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>Real-time security events and system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={cn("flex items-start gap-3 stagger-item hover-lift p-2 rounded-lg transition-all duration-200")}
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