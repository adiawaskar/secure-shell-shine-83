import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Download, 
  Upload,
  RefreshCw,
  Save,
  AlertTriangle,
  Moon,
  Sun,
  Globe,
  Clock,
  Key,
  Users,
  Building
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface SettingsState {
  // General Settings
  organizationName: string;
  administratorEmail: string;
  timezone: string;
  language: string;
  
  // Security Settings
  sessionTimeout: number;
  passwordPolicy: string;
  mfaRequired: boolean;
  auditLogRetention: number;
  
  // Notification Settings
  emailNotifications: boolean;
  alertThreshold: string;
  reportSchedule: string;
  notificationRecipients: string;
  
  // System Settings
  autoBackup: boolean;
  backupRetention: number;
  scanSchedule: string;
  updateNotifications: boolean;
  
  // Integration Settings
  syslogEnabled: boolean;
  syslogServer: string;
  apiRateLimit: number;
  webhookUrl: string;
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsState>({
    // General Settings
    organizationName: 'Acme Corporation',
    administratorEmail: 'admin@company.com',
    timezone: 'America/New_York',
    language: 'en-US',
    
    // Security Settings
    sessionTimeout: 3600,
    passwordPolicy: 'strict',
    mfaRequired: true,
    auditLogRetention: 90,
    
    // Notification Settings
    emailNotifications: true,
    alertThreshold: 'medium',
    reportSchedule: 'weekly',
    notificationRecipients: 'admin@company.com, security@company.com',
    
    // System Settings
    autoBackup: true,
    backupRetention: 30,
    scanSchedule: 'daily',
    updateNotifications: true,
    
    // Integration Settings
    syslogEnabled: false,
    syslogServer: '',
    apiRateLimit: 1000,
    webhookUrl: ''
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Settings saved:', settings);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setSettings({
      organizationName: 'Acme Corporation',
      administratorEmail: 'admin@company.com',
      timezone: 'America/New_York',
      language: 'en-US',
      sessionTimeout: 3600,
      passwordPolicy: 'strict',
      mfaRequired: true,
      auditLogRetention: 90,
      emailNotifications: true,
      alertThreshold: 'medium',
      reportSchedule: 'weekly',
      notificationRecipients: 'admin@company.com, security@company.com',
      autoBackup: true,
      backupRetention: 30,
      scanSchedule: 'daily',
      updateNotifications: true,
      syslogEnabled: false,
      syslogServer: '',
      apiRateLimit: 1000,
      webhookUrl: ''
    });
    setHasChanges(true);
  };

  const handleExportSettings = () => {
    const exportData = {
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hardentool-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and security options</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportSettings}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          {hasChanges && (
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* General Settings */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            General Settings
          </CardTitle>
          <CardDescription>Basic system configuration and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                value={settings.organizationName}
                onChange={(e) => updateSetting('organizationName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="administratorEmail">Administrator Email</Label>
              <Input
                id="administratorEmail"
                type="email"
                value={settings.administratorEmail}
                onChange={(e) => updateSetting('administratorEmail', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (UTC-6)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (UTC-7)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Choose between light and dark mode
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Security Settings
          </CardTitle>
          <CardDescription>Authentication and access control configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min="300"
                max="86400"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <Select value={settings.passwordPolicy} onValueChange={(value) => updateSetting('passwordPolicy', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                  <SelectItem value="standard">Standard (10+ chars, mixed case)</SelectItem>
                  <SelectItem value="strict">Strict (12+ chars, complexity required)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="auditLogRetention">Audit Log Retention (days)</Label>
              <Input
                id="auditLogRetention"
                type="number"
                min="30"
                max="365"
                value={settings.auditLogRetention}
                onChange={(e) => updateSetting('auditLogRetention', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Multi-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Require MFA for all administrator accounts
              </p>
            </div>
            <Switch
              checked={settings.mfaRequired}
              onCheckedChange={(checked) => updateSetting('mfaRequired', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-warning" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure alerts and reporting preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send security alerts and reports via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alertThreshold">Alert Threshold</Label>
              <Select value={settings.alertThreshold} onValueChange={(value) => updateSetting('alertThreshold', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (All issues)</SelectItem>
                  <SelectItem value="medium">Medium (High+ issues)</SelectItem>
                  <SelectItem value="high">High (Critical only)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportSchedule">Report Schedule</Label>
              <Select value={settings.reportSchedule} onValueChange={(value) => updateSetting('reportSchedule', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationRecipients">Notification Recipients</Label>
            <Textarea
              id="notificationRecipients"
              placeholder="Enter email addresses, one per line or separated by commas"
              value={settings.notificationRecipients}
              onChange={(e) => updateSetting('notificationRecipients', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-success" />
            System Settings
          </CardTitle>
          <CardDescription>Backup, scanning, and maintenance configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">
                Create daily backups of system configuration
              </p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backupRetention">Backup Retention (days)</Label>
              <Input
                id="backupRetention"
                type="number"
                min="7"
                max="365"
                value={settings.backupRetention}
                onChange={(e) => updateSetting('backupRetention', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scanSchedule">Scan Schedule</Label>
              <Select value={settings.scanSchedule} onValueChange={(value) => updateSetting('scanSchedule', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Update Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Notify when software updates are available
              </p>
            </div>
            <Switch
              checked={settings.updateNotifications}
              onCheckedChange={(checked) => updateSetting('updateNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Integration Settings */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Integration Settings
          </CardTitle>
          <CardDescription>External system integrations and API configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Syslog Integration</Label>
              <p className="text-sm text-muted-foreground">
                Send audit logs to external syslog server
              </p>
            </div>
            <Switch
              checked={settings.syslogEnabled}
              onCheckedChange={(checked) => updateSetting('syslogEnabled', checked)}
            />
          </div>

          {settings.syslogEnabled && (
            <div className="space-y-2">
              <Label htmlFor="syslogServer">Syslog Server</Label>
              <Input
                id="syslogServer"
                placeholder="syslog.company.com:514"
                value={settings.syslogServer}
                onChange={(e) => updateSetting('syslogServer', e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiRateLimit">API Rate Limit (per hour)</Label>
              <Input
                id="apiRateLimit"
                type="number"
                min="100"
                max="10000"
                value={settings.apiRateLimit}
                onChange={(e) => updateSetting('apiRateLimit', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
              <Input
                id="webhookUrl"
                placeholder="https://webhook.company.com/hardentool"
                value={settings.webhookUrl}
                onChange={(e) => updateSetting('webhookUrl', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="glass-card border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Reset to Defaults</h4>
              <p className="text-sm text-muted-foreground">
                Reset all settings to their default values. This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" onClick={handleResetSettings}>
              <RefreshCw className="h-4 w-4" />
              Reset Settings
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Clear All Data</h4>
              <p className="text-sm text-muted-foreground">
                Remove all audit logs, backups, and configuration data. This is permanent.
              </p>
            </div>
            <Button variant="destructive">
              <Database className="h-4 w-4" />
              Clear Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <Card className="glass-card border-warning/30 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <h4 className="font-medium text-foreground">Unsaved Changes</h4>
                  <p className="text-sm text-muted-foreground">
                    You have unsaved changes that will be lost if you navigate away.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setHasChanges(false)}>
                  Discard
                </Button>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}