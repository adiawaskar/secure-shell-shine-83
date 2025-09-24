import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Eye, 
  Share2, 
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { cn } from '@/lib/utils';

// Demo data for report visualizations
const complianceByCategory = [
  { category: 'Network Security', compliance: 85, issues: 12 },
  { category: 'Access Control', compliance: 92, issues: 6 },
  { category: 'Data Protection', compliance: 78, issues: 18 },
  { category: 'System Hardening', compliance: 88, issues: 9 },
  { category: 'Monitoring', compliance: 95, issues: 3 }
];

const severityDistribution = [
  { name: 'Critical', value: 8, color: '#e11d48' },
  { name: 'High', value: 15, color: '#f97316' },
  { name: 'Medium', value: 23, color: '#eab308' },
  { name: 'Low', value: 12, color: '#22c55e' }
];

const trendsData = [
  { month: 'Jan', compliance: 82, resolved: 45 },
  { month: 'Feb', compliance: 85, resolved: 52 },
  { month: 'Mar', compliance: 88, resolved: 48 },
  { month: 'Apr', compliance: 91, resolved: 55 },
  { month: 'May', compliance: 89, resolved: 49 },
  { month: 'Jun', compliance: 93, resolved: 58 }
];

const reportTemplates = [
  {
    id: 'executive',
    name: 'Executive Summary',
    description: 'High-level security overview for leadership',
    icon: TrendingUp,
    pages: 3,
    lastGenerated: '2024-01-20'
  },
  {
    id: 'detailed',
    name: 'Detailed Technical Report',
    description: 'Comprehensive technical analysis and findings',
    icon: FileText,
    pages: 24,
    lastGenerated: '2024-01-19'
  },
  {
    id: 'compliance',
    name: 'Compliance Scorecard',
    description: 'Regulatory compliance status and gaps',
    icon: CheckCircle,
    pages: 8,
    lastGenerated: '2024-01-18'
  }
];

export default function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState('executive');
  const [timeRange, setTimeRange] = useState('30d');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const handleDownloadSample = (templateId: string) => {
    // In a real app, this would download a sample PDF
    console.log(`Downloading sample for ${templateId}`);
  };

  return (
    <div className="page-container space-y-4 md:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">SecureShell Reports</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Generate comprehensive security reports and analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7d</SelectItem>
              <SelectItem value="30d">Last 30d</SelectItem>
              <SelectItem value="90d">Last 90d</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="default" 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="glow-primary"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="lg:col-span-2 mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Compliance by Category
            </CardTitle>
            <CardDescription>Security compliance across different domains</CardDescription>
          </CardHeader>
          <CardContent className="chart-container">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceByCategory}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="category" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="compliance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Issue Severity
            </CardTitle>
            <CardDescription>Distribution of security issues</CardDescription>
          </CardHeader>
          <CardContent className="chart-container">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={severityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
                  >
                    {severityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Security Trends Over Time
          </CardTitle>
          <CardDescription>Compliance improvement and issue resolution trends</CardDescription>
        </CardHeader>
        <CardContent className="chart-container">
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
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
                  name="Compliance %"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                  name="Issues Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Report Templates
          </CardTitle>
          <CardDescription>Choose from pre-configured report formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <div 
                key={template.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200 cursor-pointer hover-lift",
                  selectedTemplate === template.id 
                    ? "border-primary bg-primary/5 glow-primary" 
                    : "border-border bg-card hover:border-primary/50"
                )}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start gap-3">
                  <template.icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>{template.pages} pages</span>
                      <span>Last: {template.lastGenerated}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSample(template.id);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSample(template.id);
                        }}
                      >
                        <Download className="h-3 w-3" />
                        Sample
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Reports
          </CardTitle>
          <CardDescription>Previously generated security reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover-lift">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Executive Summary - Q1 2024</p>
                    <p className="text-sm text-muted-foreground">Generated on Jan 20, 2024 • 3 pages</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-success border-success/20">
                    PDF
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Share2 className="h-3 w-3" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}