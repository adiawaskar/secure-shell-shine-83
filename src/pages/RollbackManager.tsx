import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RotateCcw, 
  Search, 
  Calendar, 
  Database, 
  Eye, 
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  FileText,
  Shield,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackupSnapshot {
  id: string;
  name: string;
  timestamp: string;
  size: string;
  rulesCount: number;
  changesCount: number;
  type: 'manual' | 'automatic' | 'pre-enforcement';
  status: 'complete' | 'partial' | 'corrupted';
  description: string;
  profile: string;
}

const mockBackups: BackupSnapshot[] = [
  {
    id: 'backup-2024-09-24-1430',
    name: 'Pre-Enforcement Backup',
    timestamp: '2024-09-24T14:30:00Z',
    size: '2.4 MB',
    rulesCount: 45,
    changesCount: 8,
    type: 'pre-enforcement',
    status: 'complete',
    description: 'Automatic backup created before applying Strict security profile',
    profile: 'Basic'
  },
  {
    id: 'backup-2024-09-24-0900',
    name: 'Daily System Backup',
    timestamp: '2024-09-24T09:00:00Z',
    size: '2.1 MB',
    rulesCount: 45,
    changesCount: 0,
    type: 'automatic',
    status: 'complete',
    description: 'Scheduled daily backup of system configuration',
    profile: 'Basic'
  },
  {
    id: 'backup-2024-09-23-1615',
    name: 'Manual Backup - Critical Updates',
    timestamp: '2024-09-23T16:15:00Z',
    size: '2.3 MB',
    rulesCount: 43,
    changesCount: 12,
    type: 'manual',
    status: 'complete',
    description: 'Manual backup before applying critical security updates',
    profile: 'Basic'
  },
  {
    id: 'backup-2024-09-22-1200',
    name: 'Weekly Checkpoint',
    timestamp: '2024-09-22T12:00:00Z',
    size: '1.9 MB',
    rulesCount: 40,
    changesCount: 5,
    type: 'automatic',
    status: 'complete',
    description: 'Weekly automatic checkpoint backup',
    profile: 'Basic'
  },
  {
    id: 'backup-2024-09-20-0830',
    name: 'Pre-Audit Backup',
    timestamp: '2024-09-20T08:30:00Z',
    size: '1.8 MB',
    rulesCount: 38,
    changesCount: 3,
    type: 'manual',
    status: 'partial',
    description: 'Manual backup created before security audit',
    profile: 'Basic'
  }
];

export default function RollbackManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBackup, setSelectedBackup] = useState<BackupSnapshot | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showPreview, setShowPreview] = useState<BackupSnapshot | null>(null);

  const filteredBackups = mockBackups.filter(backup =>
    backup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    backup.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    backup.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'manual':
        return <Shield className="h-4 w-4 text-primary" />;
      case 'automatic':
        return <Clock className="h-4 w-4 text-success" />;
      case 'pre-enforcement':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Database className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'manual':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'automatic':
        return 'bg-success/10 text-success border-success/20';
      case 'pre-enforcement':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'corrupted':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-success/10 text-success border-success/20';
      case 'partial':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'corrupted':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleRestoreBackup = async (backup: BackupSnapshot) => {
    setIsRestoring(true);
    setSelectedBackup(backup);
    
    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Restored backup:', backup.id);
    } finally {
      setIsRestoring(false);
      setSelectedBackup(null);
    }
  };

  const handleDownloadBackup = (backup: BackupSnapshot) => {
    // Simulate backup download
    const content = JSON.stringify({
      backupId: backup.id,
      timestamp: backup.timestamp,
      rulesCount: backup.rulesCount,
      profile: backup.profile,
      description: backup.description,
      data: 'Mock backup data would be here...'
    }, null, 2);

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${backup.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const RestoreDialog = ({ backup }: { backup: BackupSnapshot }) => (
    <Dialog open={!!selectedBackup} onOpenChange={(open) => !open && setSelectedBackup(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-warning" />
            Confirm Restore Operation
          </DialogTitle>
          <DialogDescription>
            This will restore your system to the state captured in the selected backup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This action will overwrite your current security configuration.
              A new backup will be created automatically before restoration.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Backup Details:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Backup ID:</span>
                <span className="ml-2 font-mono text-foreground">{backup.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2 text-foreground">{formatDate(backup.timestamp)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rules Count:</span>
                <span className="ml-2 text-foreground">{backup.rulesCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Changes:</span>
                <span className="ml-2 text-foreground">{backup.changesCount}</span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Description:</span>
              <p className="text-sm text-foreground mt-1">{backup.description}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSelectedBackup(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleRestoreBackup(backup)}
              disabled={isRestoring}
              className="min-w-[120px]"
            >
              {isRestoring ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Restoring...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" />
                  Restore
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rollback Manager</h1>
          <p className="text-muted-foreground">Manage system backups and restore previous configurations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            Create Backup
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">{mockBackups.length}</div>
                <p className="text-xs text-muted-foreground">Total Backups</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <HardDrive className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold text-foreground">12.5 MB</div>
                <p className="text-xs text-muted-foreground">Total Size</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <div className="text-2xl font-bold text-foreground">2d ago</div>
                <p className="text-xs text-muted-foreground">Latest Backup</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {mockBackups.filter(b => b.status === 'complete').length}
                </div>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass-card border-border/50">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search backups by name, description, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Backups List */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Available Backups
          </CardTitle>
          <CardDescription>System configuration snapshots and restore points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBackups.map((backup, index) => (
              <div 
                key={backup.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border bg-card/50 hover-lift transition-all duration-200",
                  "hover:bg-card/80",
                  backup.status === 'corrupted' && "border-destructive/20 bg-destructive/5",
                  backup.status === 'partial' && "border-warning/20 bg-warning/5"
                )}
              >
                {/* Type Icon */}
                <div className="flex-shrink-0 p-2 rounded-lg bg-muted/30">
                  {getTypeIcon(backup.type)}
                </div>

                {/* Backup Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{backup.name}</h3>
                        <Badge className={getTypeBadgeClass(backup.type)}>
                          {backup.type.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getStatusBadgeClass(backup.status)}>
                          {backup.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{backup.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(backup.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {backup.size}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {backup.rulesCount} rules
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {backup.profile} profile
                        </div>
                      </div>

                      {backup.changesCount > 0 && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {backup.changesCount} changes from previous
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon-sm"
                        onClick={() => setShowPreview(backup)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon-sm"
                        onClick={() => handleDownloadBackup(backup)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => setSelectedBackup(backup)}
                        disabled={backup.status === 'corrupted' || isRestoring}
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon-sm" 
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredBackups.length === 0 && (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No backups found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or create your first backup.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Backup Best Practices */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Backup Best Practices</CardTitle>
          <CardDescription>Guidelines for effective backup management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Automatic Backups</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Daily automated backups during off-peak hours</li>
                <li>• Pre-enforcement backups before major changes</li>
                <li>• Weekly checkpoint backups for long-term recovery</li>
                <li>• Retention policy: 30 days for automatic backups</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Manual Backups</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Create manual backups before testing new policies</li>
                <li>• Label backups with descriptive names and purposes</li>
                <li>• Regular backup integrity verification</li>
                <li>• Export critical backups for off-site storage</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restore Dialog */}
      {selectedBackup && <RestoreDialog backup={selectedBackup} />}

      {/* Preview Dialog */}
      <Dialog open={!!showPreview} onOpenChange={(open) => !open && setShowPreview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Backup Preview</DialogTitle>
            <DialogDescription>
              Details and contents of the selected backup snapshot
            </DialogDescription>
          </DialogHeader>
          
          {showPreview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Backup ID:</span>
                  <p className="font-mono text-foreground">{showPreview.id}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Created:</span>
                  <p className="text-foreground">{formatDate(showPreview.timestamp)}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Size:</span>
                  <p className="text-foreground">{showPreview.size}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Status:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(showPreview.status)}
                    <span className="text-foreground">{showPreview.status}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-muted-foreground">Description:</span>
                <p className="text-sm text-foreground mt-1">{showPreview.description}</p>
              </div>

              <div className="pt-2 border-t">
                <h4 className="font-medium text-foreground mb-2">Configuration Summary</h4>
                <div className="text-sm space-y-1">
                  <div>Security Rules: {showPreview.rulesCount}</div>
                  <div>Profile: {showPreview.profile}</div>
                  <div>Changes: {showPreview.changesCount} modifications</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}