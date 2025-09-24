import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Shield, 
  Lock, 
  Settings, 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Save,
  BarChart3,
  PieChart,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

// Demo data
const profilesData = [
  {
    id: 'basic',
    name: 'Basic Security',
    description: 'Essential security controls for standard environments',
    rulesCount: 45,
    activeRules: 42,
    compliance: 93,
    severity: { critical: 2, high: 8, medium: 18, low: 17 },
    lastModified: '2024-01-15',
    isActive: true
  },
  {
    id: 'strict',
    name: 'Strict Security',
    description: 'Advanced security controls for high-risk environments',
    rulesCount: 78,
    activeRules: 75,
    compliance: 96,
    severity: { critical: 12, high: 22, medium: 28, low: 16 },
    lastModified: '2024-01-18',
    isActive: true
  },
  {
    id: 'custom',
    name: 'Custom Enterprise',
    description: 'Tailored security profile for enterprise requirements',
    rulesCount: 62,
    activeRules: 58,
    compliance: 91,
    severity: { critical: 8, high: 15, medium: 22, low: 17 },
    lastModified: '2024-01-20',
    isActive: false
  }
];

const ruleCategories = [
  { name: 'Authentication', count: 18, color: '#3b82f6' },
  { name: 'Network Security', count: 24, color: '#ef4444' },
  { name: 'Data Protection', count: 16, color: '#f59e0b' },
  { name: 'System Hardening', count: 22, color: '#22c55e' },
  { name: 'Monitoring', count: 12, color: '#a855f7' }
];

const complianceMetrics = [
  { profile: 'Basic', compliance: 93, issues: 3 },
  { profile: 'Strict', compliance: 96, issues: 2 },
  { profile: 'Custom', compliance: 91, issues: 5 }
];

export default function SecurityProfiles() {
  const [selectedProfile, setSelectedProfile] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const currentProfile = profilesData.find(p => p.id === selectedProfile);

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return 'text-success';
    if (compliance >= 90) return 'text-warning';
    return 'text-destructive';
  };

  const getSeverityData = (severity: any) => [
    { name: 'Critical', value: severity.critical, color: '#e11d48' },
    { name: 'High', value: severity.high, color: '#f97316' },
    { name: 'Medium', value: severity.medium, color: '#eab308' },
    { name: 'Low', value: severity.low, color: '#22c55e' }
  ];

  return (
    <div className="page-container space-y-4 md:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">SecureShell Profiles</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage security configurations and compliance profiles</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit Mode'}
          </Button>
          <Button variant="default" onClick={() => setShowCreateForm(true)} className="glow-primary">
            <Plus className="h-4 w-4" />
            New Profile
          </Button>
        </div>
      </div>

      {/* Profile Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Card className="lg:col-span-2 mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Profile Compliance Comparison
            </CardTitle>
            <CardDescription>Security compliance across different profiles</CardDescription>
          </CardHeader>
          <CardContent className="chart-container">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="profile" fontSize={12} />
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
              Rule Categories
            </CardTitle>
            <CardDescription>Distribution of security rules</CardDescription>
          </CardHeader>
          <CardContent className="chart-container">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={ruleCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(Number(percent) * 100).toFixed(0)}%`}
                  >
                    {ruleCategories.map((entry, index) => (
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

      {/* Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {profilesData.map((profile) => (
          <Card 
            key={profile.id}
            className={cn(
              "mobile-card cursor-pointer hover-lift transition-all duration-200",
              selectedProfile === profile.id ? "ring-2 ring-primary glow-primary" : "",
              profile.isActive ? "" : "opacity-60"
            )}
            onClick={() => setSelectedProfile(profile.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{profile.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {profile.isActive ? (
                    <Badge variant="outline" className="text-success border-success/20">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>{profile.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Compliance Ring */}
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        data={[{ compliance: profile.compliance }]} 
                        innerRadius="60%" 
                        outerRadius="90%"
                        startAngle={90}
                        endAngle={450}
                      >
                        <RadialBar 
                          dataKey="compliance" 
                          cornerRadius={10} 
                          fill="hsl(var(--primary))" 
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={cn("text-xl font-bold", getComplianceColor(profile.compliance))}>
                        {profile.compliance}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Rules</p>
                    <p className="font-semibold">{profile.activeRules}/{profile.rulesCount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Modified</p>
                    <p className="font-semibold">{profile.lastModified}</p>
                  </div>
                </div>

                {/* Severity Distribution Mini Chart */}
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Severity Distribution</p>
                  <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={getSeverityData(profile.severity)}
                          cx="50%"
                          cy="50%"
                          innerRadius={15}
                          outerRadius={30}
                          dataKey="value"
                        >
                          {getSeverityData(profile.severity).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Actions */}
                {isEditing && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline">
                      <Copy className="h-3 w-3" />
                      Clone
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Details */}
      {currentProfile && (
        <Card className="mobile-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {currentProfile.name} Configuration
            </CardTitle>
            <CardDescription>Security rules and settings for this profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-name">Profile Name</Label>
                  <Input id="profile-name" value={currentProfile.name} readOnly={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="profile-description">Description</Label>
                  <Textarea 
                    id="profile-description" 
                    value={currentProfile.description} 
                    readOnly={!isEditing}
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="profile-active">Profile Active</Label>
                  <Switch id="profile-active" checked={currentProfile.isActive} disabled={!isEditing} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Rule Categories</h4>
                <div className="space-y-3">
                  {ruleCategories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{category.count} rules</Badge>
                        {isEditing && (
                          <Switch defaultChecked />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                <Button className="glow-success">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}