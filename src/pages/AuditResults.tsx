import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Wrench, 
  Download, 
  RefreshCw, 
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SecurityRule } from '@/data/demo';

type FilterType = 'all' | 'critical' | 'high' | 'medium' | 'low';
type StatusFilter = 'all' | 'pass' | 'fail' | 'warning';

export default function AuditResults() {
  const { securityRules, applyRemediation, updateRuleStatus } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [isApplyingRemediation, setIsApplyingRemediation] = useState<string | null>(null);

  // Filter and search rules
  const filteredRules = useMemo(() => {
    return securityRules.filter(rule => {
      const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rule.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || rule.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
      
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [securityRules, searchTerm, severityFilter, statusFilter]);

  const handleApplyRemediation = async (ruleId: string) => {
    setIsApplyingRemediation(ruleId);
    try {
      await applyRemediation(ruleId);
    } finally {
      setIsApplyingRemediation(null);
    }
  };

  const handleBulkRemediation = async () => {
    for (const ruleId of selectedRules) {
      await handleApplyRemediation(ruleId);
    }
    setSelectedRules([]);
  };

  const toggleRuleSelection = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const selectAllFiltered = () => {
    const failingRules = filteredRules.filter(rule => rule.status === 'fail').map(rule => rule.id);
    setSelectedRules(failingRules);
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
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pass':
        return "bg-success/10 text-success border-success/20";
      case 'fail':
        return "bg-destructive/10 text-destructive border-destructive/20";
      case 'warning':
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const stats = {
    total: filteredRules.length,
    passing: filteredRules.filter(r => r.status === 'pass').length,
    failing: filteredRules.filter(r => r.status === 'fail').length,
    warnings: filteredRules.filter(r => r.status === 'warning').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Results</h1>
          <p className="text-muted-foreground">Review and remediate security rule violations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Rules</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{stats.passing}</div>
            <p className="text-xs text-muted-foreground">Passing</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{stats.failing}</div>
            <p className="text-xs text-muted-foreground">Failing</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{stats.warnings}</div>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rules by name, description, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={severityFilter} onValueChange={(value: FilterType) => setSeverityFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pass">Passing</SelectItem>
                <SelectItem value="fail">Failing</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedRules.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="text-sm text-foreground">
                {selectedRules.length} rule{selectedRules.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedRules([])}>
                  Clear
                </Button>
                <Button size="sm" onClick={handleBulkRemediation}>
                  <Wrench className="h-4 w-4" />
                  Apply Fixes
                </Button>
              </div>
            </div>
          )}

          {stats.failing > 0 && selectedRules.length === 0 && (
            <div className="mt-4">
              <Button size="sm" variant="outline" onClick={selectAllFiltered}>
                Select All Failing Rules
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule, index) => (
          <Card 
            key={rule.id} 
            className={cn(
              "glass-card border-border/50 hover-lift transition-all duration-200",
              rule.status === 'fail' && "border-destructive/20 bg-destructive/5",
              rule.status === 'warning' && "border-warning/20 bg-warning/5",
              selectedRules.includes(rule.id) && "ring-2 ring-primary/50"
            )}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* Selection checkbox for failing rules */}
                {rule.status === 'fail' && (
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={selectedRules.includes(rule.id)}
                      onChange={() => toggleRuleSelection(rule.id)}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                  </div>
                )}

                {/* Status Icon */}
                <div className="flex-shrink-0 pt-1">
                  {getStatusIcon(rule.status)}
                </div>

                {/* Rule Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{rule.name}</h3>
                        <Badge className={getSeverityBadgeClass(rule.severity)}>
                          {rule.severity.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusBadgeClass(rule.status)}>
                          {rule.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Rule ID:</span>
                          <span className="ml-2 font-mono text-foreground">{rule.id}</span>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Category:</span>
                          <span className="ml-2 text-foreground">{rule.category}</span>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Current Value:</span>
                          <span className={cn("ml-2", rule.status === 'fail' ? 'text-destructive' : 'text-foreground')}>
                            {rule.currentValue}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Target Value:</span>
                          <span className="ml-2 text-success">{rule.desiredValue}</span>
                        </div>
                      </div>

                      {rule.status === 'fail' && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm font-medium text-foreground mb-1">Remediation Command:</p>
                          <code className="text-xs font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded">
                            {rule.remediationCommand}
                          </code>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" size="icon-sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {rule.status === 'fail' && (
                        <Button 
                          size="sm"
                          onClick={() => handleApplyRemediation(rule.id)}
                          disabled={isApplyingRemediation === rule.id}
                          className="min-w-[100px]"
                        >
                          {isApplyingRemediation === rule.id ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Fixing...
                            </>
                          ) : (
                            <>
                              <Wrench className="h-4 w-4" />
                              Fix Now
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRules.length === 0 && (
          <Card className="glass-card border-border/50">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No rules found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find the rules you're looking for.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}