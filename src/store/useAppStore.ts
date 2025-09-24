import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  demoSecurityRules, 
  demoComplianceMetrics, 
  demoActivityLog, 
  demoProfiles,
  demoReports,
  type SecurityRule,
  type ComplianceMetrics,
  type ActivityLogEntry,
  type SecurityProfile,
  type ComplianceReport
} from '@/data/demo';

interface AppState {
  // Data
  securityRules: SecurityRule[];
  complianceMetrics: ComplianceMetrics;
  activityLog: ActivityLogEntry[];
  profiles: SecurityProfile[];
  reports: ComplianceReport[];
  
  // UI State
  sidebarCollapsed: boolean;
  currentProfile: string;
  terminalHistory: string[];
  terminalOutput: string[];
  isScanning: boolean;
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentProfile: (profile: string) => void;
  addTerminalCommand: (command: string) => void;
  addTerminalOutput: (output: string) => void;
  clearTerminal: () => void;
  setIsScanning: (scanning: boolean) => void;
  updateRuleStatus: (ruleId: string, status: 'pass' | 'fail' | 'warning') => void;
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  generateReport: (type: 'executive' | 'detailed' | 'scorecard') => ComplianceReport;
  runAudit: (profile: string) => Promise<void>;
  applyRemediation: (ruleId: string) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial data
      securityRules: demoSecurityRules,
      complianceMetrics: demoComplianceMetrics,
      activityLog: demoActivityLog,
      profiles: demoProfiles,
      reports: demoReports,
      
      // Initial UI state
      sidebarCollapsed: false,
      currentProfile: 'basic',
      terminalHistory: [],
      terminalOutput: ['Welcome to HardenTool CLI v2.1.0', 'Type "help" for available commands', ''],
      isScanning: false,
      
      // Actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      setCurrentProfile: (profile) => set({ currentProfile: profile }),
      
      addTerminalCommand: (command) => set((state) => ({
        terminalHistory: [...state.terminalHistory, command]
      })),
      
      addTerminalOutput: (output) => set((state) => ({
        terminalOutput: [...state.terminalOutput, output]
      })),
      
      clearTerminal: () => set({
        terminalOutput: ['Welcome to HardenTool CLI v2.1.0', 'Type "help" for available commands', '']
      }),
      
      setIsScanning: (scanning) => set({ isScanning: scanning }),
      
      updateRuleStatus: (ruleId, status) => set((state) => ({
        securityRules: state.securityRules.map(rule =>
          rule.id === ruleId ? { ...rule, status } : rule
        )
      })),
      
      addActivityLog: (entry) => set((state) => ({
        activityLog: [
          {
            ...entry,
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString()
          },
          ...state.activityLog
        ]
      })),
      
      generateReport: (type) => {
        const state = get();
        const now = new Date().toISOString();
        const report: ComplianceReport = {
          id: `rpt-${Date.now()}`,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
          generatedAt: now,
          type,
          size: type === 'detailed' ? '8.5 MB' : type === 'executive' ? '1.1 MB' : '2.3 MB',
          downloadUrl: `/reports/${type}-${Date.now()}.pdf`,
          summary: {
            totalRules: state.securityRules.length,
            passed: state.securityRules.filter(r => r.status === 'pass').length,
            failed: state.securityRules.filter(r => r.status === 'fail').length,
            warnings: state.securityRules.filter(r => r.status === 'warning').length,
            complianceScore: state.complianceMetrics.overall
          }
        };
        
        set((state) => ({
          reports: [report, ...state.reports]
        }));
        
        return report;
      },
      
      runAudit: async (profile) => {
        const state = get();
        set({ isScanning: true });
        
        // Simulate audit process
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Add activity log entry
        state.addActivityLog({
          action: 'Audit Completed',
          status: 'success',
          message: `System audit completed using ${profile} profile. ${state.securityRules.length} rules checked.`,
          user: 'admin'
        });
        
        set({ isScanning: false });
      },
      
      applyRemediation: async (ruleId) => {
        const state = get();
        const rule = state.securityRules.find(r => r.id === ruleId);
        
        if (!rule) return;
        
        // Simulate remediation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update rule status
        state.updateRuleStatus(ruleId, 'pass');
        
        // Add activity log entry
        state.addActivityLog({
          action: 'Remediation Applied',
          ruleId,
          ruleName: rule.name,
          severity: rule.severity,
          status: 'success',
          message: `Successfully applied remediation for ${rule.name}`,
          user: 'admin'
        });
      }
    }),
    {
      name: 'hardentool-storage',
      partialize: (state) => ({
        currentProfile: state.currentProfile,
        sidebarCollapsed: state.sidebarCollapsed,
        terminalHistory: state.terminalHistory
      })
    }
  )
);