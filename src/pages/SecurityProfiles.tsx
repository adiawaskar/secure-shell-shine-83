import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Shield, 
  Settings,
  Check,
  Lock,
  Key,
  Clock,
  AlertTriangle,
  Download,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SecurityProfile } from '@/data/demo';

interface ProfileFormData {
  name: string;
  description: string;
  passwordMinLength: number;
  passwordComplexity: boolean;
  accountLockoutThreshold: number;
  sessionTimeout: number;
  auditingEnabled: boolean;
}

export default function SecurityProfiles() {
  const { profiles, currentProfile, setCurrentProfile } = useAppStore();
  const [editingProfile, setEditingProfile] = useState<SecurityProfile | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    description: '',
    passwordMinLength: 8,
    passwordComplexity: false,
    accountLockoutThreshold: 5,
    sessionTimeout: 3600,
    auditingEnabled: true
  });

  const formatLastModified = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProfileIcon = (profileId: string) => {
    switch (profileId) {
      case 'basic':
        return <Shield className="h-5 w-5 text-success" />;
      case 'strict':
        return <Lock className="h-5 w-5 text-destructive" />;
      default:
        return <Settings className="h-5 w-5 text-primary" />;
    }
  };

  const getProfileColor = (profileId: string) => {
    switch (profileId) {
      case 'basic':
        return 'border-success/30 bg-success/5';
      case 'strict':
        return 'border-destructive/30 bg-destructive/5';
      default:
        return 'border-primary/30 bg-primary/5';
    }
  };

  const handleEditProfile = (profile: SecurityProfile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      description: profile.description,
      passwordMinLength: profile.settings.passwordMinLength,
      passwordComplexity: profile.settings.passwordComplexity,
      accountLockoutThreshold: profile.settings.accountLockoutThreshold,
      sessionTimeout: profile.settings.sessionTimeout,
      auditingEnabled: profile.settings.auditingEnabled
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the profile
    console.log('Saving profile:', formData);
    setEditingProfile(null);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleCreateProfile = () => {
    // In a real app, this would create a new profile
    console.log('Creating profile:', formData);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      passwordMinLength: 8,
      passwordComplexity: false,
      accountLockoutThreshold: 5,
      sessionTimeout: 3600,
      auditingEnabled: true
    });
  };

  const handleDuplicateProfile = (profile: SecurityProfile) => {
    setFormData({
      name: `${profile.name} (Copy)`,
      description: `Copy of ${profile.description}`,
      passwordMinLength: profile.settings.passwordMinLength,
      passwordComplexity: profile.settings.passwordComplexity,
      accountLockoutThreshold: profile.settings.accountLockoutThreshold,
      sessionTimeout: profile.settings.sessionTimeout,
      auditingEnabled: profile.settings.auditingEnabled
    });
    setIsCreateDialogOpen(true);
  };

  const handleExportProfile = (profile: SecurityProfile) => {
    const exportData = {
      profile: {
        name: profile.name,
        description: profile.description,
        settings: profile.settings
      },
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.toLowerCase().replace(/\s+/g, '-')}-profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ProfileForm = ({ isEditing = false }: { isEditing?: boolean }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Profile Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter profile name..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this security profile..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="passwordMinLength">Password Min Length</Label>
          <Input
            id="passwordMinLength"
            type="number"
            min="4"
            max="32"
            value={formData.passwordMinLength}
            onChange={(e) => setFormData({ ...formData, passwordMinLength: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountLockoutThreshold">Account Lockout Threshold</Label>
          <Input
            id="accountLockoutThreshold"
            type="number"
            min="1"
            max="20"
            value={formData.accountLockoutThreshold}
            onChange={(e) => setFormData({ ...formData, accountLockoutThreshold: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
        <Input
          id="sessionTimeout"
          type="number"
          min="300"
          max="86400"
          value={formData.sessionTimeout}
          onChange={(e) => setFormData({ ...formData, sessionTimeout: parseInt(e.target.value) })}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Password Complexity</Label>
            <p className="text-sm text-muted-foreground">
              Require uppercase, lowercase, numbers, and special characters
            </p>
          </div>
          <Switch
            checked={formData.passwordComplexity}
            onCheckedChange={(checked) => setFormData({ ...formData, passwordComplexity: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auditing Enabled</Label>
            <p className="text-sm text-muted-foreground">
              Enable comprehensive security event logging
            </p>
          </div>
          <Switch
            checked={formData.auditingEnabled}
            onCheckedChange={(checked) => setFormData({ ...formData, auditingEnabled: checked })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            setEditingProfile(null);
            setIsCreateDialogOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button onClick={isEditing ? handleSaveProfile : handleCreateProfile}>
          {isEditing ? 'Save Changes' : 'Create Profile'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Profiles</h1>
          <p className="text-muted-foreground">Manage security configurations and compliance settings</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                New Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Security Profile</DialogTitle>
                <DialogDescription>
                  Define security settings and compliance requirements for your new profile.
                </DialogDescription>
              </DialogHeader>
              <ProfileForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Current Profile Card */}
      <Card className="glass-card border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Active Profile
          </CardTitle>
          <CardDescription>Currently applied security configuration</CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const active = profiles.find(p => p.id === currentProfile);
            return active ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getProfileIcon(active.id)}
                  <div>
                    <h3 className="font-semibold text-foreground">{active.name}</h3>
                    <p className="text-sm text-muted-foreground">{active.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Rules: {active.rulesCount}</span>
                      <span>Modified: {formatLastModified(active.lastModified)}</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">
                  <Check className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            ) : null;
          })()}
        </CardContent>
      </Card>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {profiles.map((profile, index) => (
          <Card 
            key={profile.id}
            className={cn(
              "glass-card border-border/50 hover-lift transition-all duration-200",
              getProfileColor(profile.id),
              profile.id === currentProfile && "ring-2 ring-primary/50"
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getProfileIcon(profile.id)}
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {profile.name}
                      {profile.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{profile.description}</CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => handleEditProfile(profile)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => handleDuplicateProfile(profile)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => handleExportProfile(profile)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {!profile.isDefault && (
                    <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Profile Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Rules Count:</span>
                  <span className="ml-2 font-medium text-foreground">{profile.rulesCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Modified:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {formatLastModified(profile.lastModified)}
                  </span>
                </div>
              </div>

              {/* Settings Summary */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuration
                </h4>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Key className="h-3 w-3" />
                      Password Min Length
                    </span>
                    <span className="font-medium text-foreground">
                      {profile.settings.passwordMinLength} chars
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <AlertTriangle className="h-3 w-3" />
                      Lockout Threshold
                    </span>
                    <span className="font-medium text-foreground">
                      {profile.settings.accountLockoutThreshold} attempts
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Session Timeout
                    </span>
                    <span className="font-medium text-foreground">
                      {Math.floor(profile.settings.sessionTimeout / 60)}m
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className={cn(
                    "flex items-center gap-1",
                    profile.settings.passwordComplexity ? "text-success" : "text-muted-foreground"
                  )}>
                    {profile.settings.passwordComplexity ? <Check className="h-3 w-3" /> : <span className="w-3" />}
                    Password Complexity
                  </span>
                  <span className={cn(
                    "flex items-center gap-1",
                    profile.settings.auditingEnabled ? "text-success" : "text-muted-foreground"
                  )}>
                    {profile.settings.auditingEnabled ? <Check className="h-3 w-3" /> : <span className="w-3" />}
                    Auditing Enabled
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                {profile.id !== currentProfile ? (
                  <Button 
                    size="sm"
                    onClick={() => setCurrentProfile(profile.id)}
                  >
                    <Shield className="h-4 w-4" />
                    Apply Profile
                  </Button>
                ) : (
                  <Badge className="bg-success/10 text-success border-success/20">
                    <Check className="h-3 w-3 mr-1" />
                    Currently Active
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={!!editingProfile} onOpenChange={(open) => !open && setEditingProfile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Security Profile</DialogTitle>
            <DialogDescription>
              Modify security settings and compliance requirements for {editingProfile?.name}.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm isEditing />
        </DialogContent>
      </Dialog>

      {/* Profile Templates Info */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Profile Templates</CardTitle>
          <CardDescription>Pre-configured security profiles for different compliance requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-success/5 border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-success" />
                <h3 className="font-medium text-foreground">Basic Security</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Essential security controls suitable for general business environments.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Moderate password requirements</li>
                <li>• Standard lockout policies</li>
                <li>• Basic auditing enabled</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border bg-destructive/5 border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-destructive" />
                <h3 className="font-medium text-foreground">Strict Security</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Comprehensive security controls for high-security environments.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Strong password requirements</li>
                <li>• Aggressive lockout policies</li>
                <li>• Enhanced auditing features</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-foreground">Custom Profile</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Tailored security controls based on specific organizational needs.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Customizable requirements</li>
                <li>• Flexible policy settings</li>
                <li>• Configurable audit levels</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}