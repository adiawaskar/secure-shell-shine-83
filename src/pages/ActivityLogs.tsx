import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  User,
  Calendar,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ActivityLogEntry } from '@/data/demo';

type StatusFilter = 'all' | 'success' | 'error' | 'warning' | 'info';
type TimeFilter = 'all' | '1h' | '24h' | '7d' | '30d';

export default function ActivityLogs() {
  const { activityLog } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return activityLog.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (log.ruleName && log.ruleName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      
      let matchesTime = true;
      if (timeFilter !== 'all') {
        const logTime = new Date(log.timestamp).getTime();
        const now = Date.now();
        const timeRanges = {
          '1h': 60 * 60 * 1000,
          '24h': 24 * 60 * 60 * 1000,
          '7d': 7 * 24 * 60 * 60 * 1000,
          '30d': 30 * 24 * 60 * 60 * 1000
        };
        matchesTime = (now - logTime) <= timeRanges[timeFilter];
      }
      
      return matchesSearch && matchesStatus && matchesTime;
    });
  }, [activityLog, searchTerm, statusFilter, timeFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'error':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'severity-critical';
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return 'bg-muted text-muted-foreground';
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

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const toggleLogSelection = (logId: string) => {
    setSelectedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const handleExportLogs = () => {
    const logsToExport = selectedLogs.length > 0 
      ? filteredLogs.filter(log => selectedLogs.includes(log.id))
      : filteredLogs;
    
    const csvContent = [
      'Timestamp,Action,Status,Message,User,Rule ID,Rule Name,Severity',
      ...logsToExport.map(log => [
        log.timestamp,
        log.action,
        log.status,
        `"${log.message}"`,
        log.user,
        log.ruleId || '',
        log.ruleName || '',
        log.severity || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: filteredLogs.length,
    success: filteredLogs.filter(log => log.status === 'success').length,
    errors: filteredLogs.filter(log => log.status === 'error').length,
    warnings: filteredLogs.filter(log => log.status === 'warning').length,
    info: filteredLogs.filter(log => log.status === 'info').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor security events and system activities</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportLogs}>
            <Download className="h-4 w-4" />
            Export ({selectedLogs.length > 0 ? selectedLogs.length : filteredLogs.length})
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">{stats.success}</div>
                <p className="text-xs text-muted-foreground">Success</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">{stats.errors}</div>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-warning" />
              <div>
                <div className="text-2xl font-bold text-warning">{stats.warnings}</div>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Info className="h-6 w-6 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.info}</div>
                <p className="text-xs text-muted-foreground">Info</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs by action, message, user, or rule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
              <SelectTrigger className="w-[120px]">
                <Clock className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7d</SelectItem>
                <SelectItem value="30d">Last 30d</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedLogs.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="text-sm text-foreground">
                {selectedLogs.length} log{selectedLogs.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedLogs([])}>
                  Clear
                </Button>
                <Button size="sm" onClick={handleExportLogs}>
                  <Download className="h-4 w-4" />
                  Export Selected
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest security events and system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log, index) => (
              <div 
                key={log.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover-lift transition-all duration-200",
                  "hover:bg-card/80",
                  selectedLogs.includes(log.id) && "ring-2 ring-primary/50",
                  log.status === 'error' && "border-destructive/20 bg-destructive/5",
                  log.status === 'warning' && "border-warning/20 bg-warning/5"
                )}
              >
                {/* Selection checkbox */}
                <div className="flex items-center pt-1">
                  <input
                    type="checkbox"
                    checked={selectedLogs.includes(log.id)}
                    onChange={() => toggleLogSelection(log.id)}
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0 pt-1">
                  {getStatusIcon(log.status)}
                </div>

                {/* Log Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{log.action}</h3>
                        <Badge className={getStatusBadgeClass(log.status)}>
                          {log.status.toUpperCase()}
                        </Badge>
                        {log.severity && (
                          <Badge className={getSeverityBadgeClass(log.severity)}>
                            {log.severity.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-foreground mb-3">{log.message}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateTime(log.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.user}
                        </span>
                        {log.ruleId && (
                          <span className="font-mono bg-muted/50 px-2 py-1 rounded">
                            {log.ruleId}
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          {formatTimeAgo(log.timestamp)}
                        </span>
                      </div>

                      {log.ruleName && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Rule: </span>
                          <span className="text-foreground">{log.ruleName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No activity logs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find the logs you're looking for.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}