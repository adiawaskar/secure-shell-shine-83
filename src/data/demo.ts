// Demo data for Multi-Platform System Hardening Tool

export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: 'pass' | 'fail' | 'warning';
  currentValue: string;
  desiredValue: string;
  remediationCommand: string;
  lastChecked: string;
  profile: string;
}

export interface ComplianceMetrics {
  overall: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  totalRules: number;
  passingRules: number;
  failingRules: number;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  ruleId?: string;
  ruleName?: string;
  severity?: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  user: string;
}

export interface SecurityProfile {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  rulesCount: number;
  lastModified: string;
  settings: {
    passwordMinLength: number;
    passwordComplexity: boolean;
    accountLockoutThreshold: number;
    sessionTimeout: number;
    auditingEnabled: boolean;
  };
}

export interface ComplianceReport {
  id: string;
  name: string;
  generatedAt: string;
  type: 'executive' | 'detailed' | 'scorecard';
  size: string;
  downloadUrl: string;
  summary: {
    totalRules: number;
    passed: number;
    failed: number;
    warnings: number;
    complianceScore: number;
  };
}

// Mock data
export const demoSecurityRules: SecurityRule[] = [
  {
    id: 'WIN-001',
    name: 'Password Minimum Length',
    description: 'Ensures password minimum length meets security requirements',
    severity: 'high',
    category: 'Authentication',
    status: 'fail',
    currentValue: '6 characters',
    desiredValue: '12 characters',
    remediationCommand: 'Set-ADDefaultDomainPasswordPolicy -MinPasswordLength 12',
    lastChecked: '2024-09-24T10:30:00Z',
    profile: 'Strict'
  },
  {
    id: 'WIN-002',
    name: 'Account Lockout Policy',
    description: 'Configures account lockout after failed login attempts',
    severity: 'medium',
    category: 'Authentication',
    status: 'pass',
    currentValue: '5 attempts',
    desiredValue: '5 attempts',
    remediationCommand: 'Set-ADDefaultDomainPasswordPolicy -LockoutThreshold 5',
    lastChecked: '2024-09-24T10:30:00Z',
    profile: 'Strict'
  },
  {
    id: 'WIN-003',
    name: 'Windows Firewall Status',
    description: 'Ensures Windows Firewall is enabled for all profiles',
    severity: 'critical',
    category: 'Network Security',
    status: 'fail',
    currentValue: 'Disabled on Public',
    desiredValue: 'Enabled on All',
    remediationCommand: 'Set-NetFirewallProfile -Profile Public -Enabled True',
    lastChecked: '2024-09-24T10:30:00Z',
    profile: 'Basic'
  },
  {
    id: 'LNX-001',
    name: 'SSH Root Login',
    description: 'Disables direct SSH root login for security',
    severity: 'critical',
    category: 'Access Control',
    status: 'pass',
    currentValue: 'no',
    desiredValue: 'no',
    remediationCommand: 'sed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config',
    lastChecked: '2024-09-24T10:30:00Z',
    profile: 'Basic'
  },
  {
    id: 'LNX-002',
    name: 'File System Permissions',
    description: 'Ensures critical system files have proper permissions',
    severity: 'high',
    category: 'File System',
    status: 'warning',
    currentValue: '644',
    desiredValue: '600',
    remediationCommand: 'chmod 600 /etc/shadow',
    lastChecked: '2024-09-24T10:30:00Z',
    profile: 'Strict'
  }
];

export const demoComplianceMetrics: ComplianceMetrics = {
  overall: 73,
  critical: 50, // 1 out of 2 critical rules passing
  high: 50,    // 1 out of 2 high rules passing  
  medium: 100, // 1 out of 1 medium rule passing
  low: 100,    // All low rules passing
  totalRules: 5,
  passingRules: 2,
  failingRules: 2
};

export const demoActivityLog: ActivityLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2024-09-24T10:30:00Z',
    action: 'Audit Completed',
    status: 'success',
    message: 'Full system audit completed successfully. 5 rules checked.',
    user: 'admin'
  },
  {
    id: 'log-002',
    timestamp: '2024-09-24T10:25:00Z',
    action: 'Rule Failed',
    ruleId: 'WIN-001',
    ruleName: 'Password Minimum Length',
    severity: 'high',
    status: 'error',
    message: 'Password minimum length requirement not met',
    user: 'system'
  },
  {
    id: 'log-003',
    timestamp: '2024-09-24T10:20:00Z',
    action: 'Profile Applied',
    status: 'success',
    message: 'Applied "Strict" security profile with 15 rules',
    user: 'admin'
  },
  {
    id: 'log-004',
    timestamp: '2024-09-24T10:15:00Z',
    action: 'Remediation Applied',
    ruleId: 'LNX-001',
    ruleName: 'SSH Root Login',
    severity: 'critical',
    status: 'success',
    message: 'Successfully disabled SSH root login',
    user: 'admin'
  },
  {
    id: 'log-005',
    timestamp: '2024-09-24T10:10:00Z',
    action: 'Report Generated',
    status: 'info',
    message: 'Executive summary report generated',
    user: 'admin'
  }
];

export const demoProfiles: SecurityProfile[] = [
  {
    id: 'basic',
    name: 'Basic Security',
    description: 'Essential security controls for general environments',
    isDefault: true,
    rulesCount: 25,
    lastModified: '2024-09-20T14:30:00Z',
    settings: {
      passwordMinLength: 8,
      passwordComplexity: false,
      accountLockoutThreshold: 10,
      sessionTimeout: 3600,
      auditingEnabled: true
    }
  },
  {
    id: 'strict',
    name: 'Strict Security',
    description: 'Comprehensive security controls for high-security environments',
    isDefault: false,
    rulesCount: 45,
    lastModified: '2024-09-22T09:15:00Z',
    settings: {
      passwordMinLength: 12,
      passwordComplexity: true,
      accountLockoutThreshold: 5,
      sessionTimeout: 1800,
      auditingEnabled: true
    }
  },
  {
    id: 'custom',
    name: 'Custom Profile',
    description: 'User-defined security controls',
    isDefault: false,
    rulesCount: 32,
    lastModified: '2024-09-24T08:45:00Z',
    settings: {
      passwordMinLength: 10,
      passwordComplexity: true,
      accountLockoutThreshold: 7,
      sessionTimeout: 2400,
      auditingEnabled: true
    }
  }
];

export const demoReports: ComplianceReport[] = [
  {
    id: 'rpt-001',
    name: 'Executive Summary - September 2024',
    generatedAt: '2024-09-24T10:30:00Z',
    type: 'executive',
    size: '1.2 MB',
    downloadUrl: '/reports/executive-sep-2024.pdf',
    summary: {
      totalRules: 45,
      passed: 33,
      failed: 8,
      warnings: 4,
      complianceScore: 73
    }
  },
  {
    id: 'rpt-002',
    name: 'Detailed Audit Report - September 2024',
    generatedAt: '2024-09-24T10:30:00Z',
    type: 'detailed',
    size: '8.7 MB',
    downloadUrl: '/reports/detailed-sep-2024.pdf',
    summary: {
      totalRules: 45,
      passed: 33,
      failed: 8,
      warnings: 4,
      complianceScore: 73
    }
  },
  {
    id: 'rpt-003',
    name: 'Compliance Scorecard - Q3 2024',
    generatedAt: '2024-09-22T16:00:00Z',
    type: 'scorecard',
    size: '2.1 MB',
    downloadUrl: '/reports/scorecard-q3-2024.pdf',
    summary: {
      totalRules: 45,
      passed: 30,
      failed: 12,
      warnings: 3,
      complianceScore: 67
    }
  }
];

// Command templates for CLI simulator
export const cliCommands = {
  'hardentool audit': {
    description: 'Run security audit with specified profile',
    flags: ['--profile', '--output', '--format'],
    profiles: ['basic', 'strict', 'custom'],
    formats: ['json', 'xml', 'csv']
  },
  'hardentool enforce': {
    description: 'Apply security configurations',
    flags: ['--profile', '--dry-run', '--rule-id', '--backup'],
    profiles: ['basic', 'strict', 'custom']
  },
  'hardentool report': {
    description: 'Generate compliance reports',
    flags: ['--format', '--output', '--template'],
    formats: ['pdf', 'html', 'json'],
    templates: ['executive', 'detailed', 'scorecard']
  },
  'hardentool rollback': {
    description: 'Rollback to previous configuration',
    flags: ['--id', '--preview', '--confirm']
  },
  'hardentool list-rules': {
    description: 'List available security rules',
    flags: ['--severity', '--category', '--profile'],
    severities: ['critical', 'high', 'medium', 'low'],
    categories: ['Authentication', 'Network Security', 'Access Control', 'File System']
  }
};

// Mock chart data for trends
export const demoChartData = [
  { date: '2024-09-17', compliance: 65, critical: 8, high: 12, medium: 3, low: 2 },
  { date: '2024-09-18', compliance: 68, critical: 7, high: 11, medium: 3, low: 2 },
  { date: '2024-09-19', compliance: 71, critical: 6, high: 10, medium: 4, low: 1 },
  { date: '2024-09-20', compliance: 69, critical: 7, high: 11, medium: 3, low: 1 },
  { date: '2024-09-21', compliance: 72, critical: 5, high: 9, medium: 4, low: 1 },
  { date: '2024-09-22', compliance: 75, critical: 4, high: 8, medium: 4, low: 1 },
  { date: '2024-09-23', compliance: 73, critical: 5, high: 9, medium: 3, low: 1 }
];