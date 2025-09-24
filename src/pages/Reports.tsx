import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Calendar,
  BarChart3,
  Shield,
  Clock,
  Users,
  Building,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ComplianceReport } from '@/data/demo';

type ReportType = 'executive' | 'detailed' | 'scorecard';
type ReportTemplate = 'standard' | 'custom';

export default function Reports() {
  const { reports, generateReport, complianceMetrics } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [newReportType, setNewReportType] = useState<ReportType>('executive');
  const [reportTemplate, setReportTemplate] = useState<ReportTemplate>('standard');
  const [customReportName, setCustomReportName] = useState('');

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate generation
      const report = generateReport(newReportType);
      console.log('Generated report:', report);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewReport = (report: ComplianceReport) => {
    // Simulate opening report preview
    const blob = new Blob([
      `<!DOCTYPE html>
      <html>
        <head><title>${report.name}</title></head>
        <body>
          <h1>${report.name}</h1>
          <div>
            <h2>Executive Summary</h2>
            <p>Compliance Score: ${report.summary.complianceScore}%</p>
            <p>Total Rules: ${report.summary.totalRules}</p>
            <p>Passed: ${report.summary.passed}</p>
            <p>Failed: ${report.summary.failed}</p>
            <p>Warnings: ${report.summary.warnings}</p>
          </div>
        </body>
      </html>`
    ], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownloadReport = (report: ComplianceReport) => {
    // Simulate PDF download
    const content = `${report.name}\n\nCompliance Score: ${report.summary.complianceScore}%\nGenerated: ${new Date(report.generatedAt).toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'executive':
        return <Users className="h-4 w-4" />;
      case 'detailed':
        return <FileText className="h-4 w-4" />;
      case 'scorecard':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'executive':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'detailed':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'scorecard':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance Reports</h1>
          <p className="text-muted-foreground">Generate and manage security compliance reports</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">{complianceMetrics.overall}%</div>
                <p className="text-xs text-muted-foreground">Current Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold text-foreground">{reports.length}</div>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {reports.length > 0 ? new Date(reports[0].generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">Last Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold text-foreground">{complianceMetrics.totalRules}</div>
                <p className="text-xs text-muted-foreground">Rules Audited</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate New Report */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Generate New Report
          </CardTitle>
          <CardDescription>Create a new compliance report with current data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={newReportType} onValueChange={(value: ReportType) => setNewReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="detailed">Detailed Report</SelectItem>
                  <SelectItem value="scorecard">Compliance Scorecard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={reportTemplate} onValueChange={(value: ReportTemplate) => setReportTemplate(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Template</SelectItem>
                  <SelectItem value="custom">Custom Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Custom Name (Optional)</Label>
              <Input
                placeholder="Enter custom report name..."
                value={customReportName}
                onChange={(e) => setCustomReportName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="min-w-[140px]"
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
            
            <div className="text-sm text-muted-foreground">
              Report will include current compliance data from {complianceMetrics.totalRules} security rules
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Reports */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generated Reports
          </CardTitle>
          <CardDescription>Previously generated compliance reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div 
                key={report.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border bg-card/50 hover-lift stagger-item",
                  "hover:bg-card/80 transition-all duration-200"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-muted/30">
                    {getReportIcon(report.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{report.name}</h3>
                      <Badge className={getReportTypeColor(report.type)}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(report.generatedAt)}
                        </span>
                      </div>
                      <div>Size: {report.size}</div>
                      <div>Score: {report.summary.complianceScore}%</div>
                      <div>Rules: {report.summary.totalRules}</div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-success">✓ {report.summary.passed} passed</span>
                      <span className="text-destructive">✗ {report.summary.failed} failed</span>
                      <span className="text-warning">⚠ {report.summary.warnings} warnings</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => handlePreviewReport(report)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => handleDownloadReport(report)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No reports generated yet</h3>
                <p className="text-muted-foreground">
                  Generate your first compliance report to get started with security documentation.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              High-level overview perfect for leadership and stakeholders.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Overall compliance score</li>
              <li>• Key risk areas</li>
              <li>• Recommendations</li>
              <li>• Trending analysis</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-warning" />
              Detailed Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Comprehensive technical report for IT teams and auditors.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Complete rule details</li>
              <li>• Remediation steps</li>
              <li>• Technical findings</li>
              <li>• Implementation guide</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-success" />
              Compliance Scorecard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Visual scorecard showing compliance metrics and trends.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Scoring breakdown</li>
              <li>• Category analysis</li>
              <li>• Historical trends</li>
              <li>• Benchmark comparison</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
