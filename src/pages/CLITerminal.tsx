import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Maximize2, Minimize2, Terminal, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cliCommands } from '@/data/demo';

type TerminalTheme = 'dark' | 'light' | 'solarized';

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success' | 'warning';
  content: string;
  timestamp?: string;
}

export default function CLITerminal() {
  const { terminalHistory, addTerminalCommand, addTerminalOutput, clearTerminal } = useAppStore();
  const [currentCommand, setCurrentCommand] = useState('');
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to HardenTool CLI v2.1.0' },
    { type: 'output', content: 'Type "help" for available commands or use tab for auto-completion' },
    { type: 'output', content: '' }
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<TerminalTheme>('dark');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Focus terminal input
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const terminalElement = terminalRef.current;
    if (terminalElement) {
      terminalElement.addEventListener('click', handleClick);
      return () => terminalElement.removeEventListener('click', handleClick);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Command autocomplete
  const getCommandSuggestions = useCallback((input: string) => {
    if (!input.trim()) return [];
    
    const commands = Object.keys(cliCommands);
    const currentParts = input.trim().split(' ');
    const baseCommand = currentParts[0];
    
    if (currentParts.length === 1) {
      return commands.filter(cmd => cmd.startsWith(input.toLowerCase()));
    }
    
    const commandConfig = cliCommands[baseCommand as keyof typeof cliCommands];
    if (!commandConfig) return [];
    
    const lastPart = currentParts[currentParts.length - 1];
    const suggestions: string[] = [];
    
    // Flag suggestions
    if (lastPart.startsWith('--')) {
      const availableFlags = commandConfig.flags || [];
      suggestions.push(...availableFlags.filter(flag => flag.startsWith(lastPart)));
    } else if (currentParts.includes('--profile')) {
      const profiles = (commandConfig as any).profiles || [];
      suggestions.push(...profiles.filter((p: string) => p.startsWith(lastPart)));
    } else if (currentParts.includes('--format')) {
      const formats = (commandConfig as any).formats || [];
      suggestions.push(...formats.filter((f: string) => f.startsWith(lastPart)));
    }
    
    return suggestions;
  }, []);

  const handleInputChange = (value: string) => {
    setCurrentCommand(value);
    const suggestions = getCommandSuggestions(value);
    setSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0 && value.trim().length > 0);
  };

  const typewriterEffect = async (text: string, type: TerminalLine['type'] = 'output') => {
    setIsTyping(true);
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];
      setTerminalLines(prev => {
        const newLines = [...prev];
        if (newLines[newLines.length - 1]?.type === type && !newLines[newLines.length - 1]?.content.includes('\n')) {
          newLines[newLines.length - 1] = { type, content: currentText + '█' };
        } else {
          newLines.push({ type, content: currentText + '█' });
        }
        return newLines;
      });
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
    }
    
    // Remove cursor
    setTerminalLines(prev => {
      const newLines = [...prev];
      newLines[newLines.length - 1] = { type, content: currentText };
      return newLines;
    });
    setIsTyping(false);
  };

  const simulateProgress = async (taskName: string, duration: number = 3000) => {
    const steps = 20;
    const stepDuration = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      const percentage = Math.round((i / steps) * 100);
      const progress = '█'.repeat(Math.floor(i / 2)) + '░'.repeat(10 - Math.floor(i / 2));
      const progressText = `${taskName}: [${progress}] ${percentage}%`;
      
      setTerminalLines(prev => {
        const newLines = [...prev];
        if (newLines[newLines.length - 1]?.content.includes('[')) {
          newLines[newLines.length - 1] = { type: 'output', content: progressText };
        } else {
          newLines.push({ type: 'output', content: progressText });
        }
        return newLines;
      });
      
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  };

  const executeCommand = async (command: string) => {
    const timestamp = new Date().toLocaleTimeString();
    
    // Add command to terminal
    setTerminalLines(prev => [...prev, { 
      type: 'command', 
      content: `$ ${command}`,
      timestamp 
    }]);
    
    // Add to history
    addTerminalCommand(command);
    
    const parts = command.trim().split(' ');
    const baseCommand = parts[0];
    
    await new Promise(resolve => setTimeout(resolve, 100));

    switch (baseCommand) {
      case 'help':
        await typewriterEffect('Available commands:');
        await new Promise(resolve => setTimeout(resolve, 500));
        Object.entries(cliCommands).forEach(async ([cmd, config]) => {
          setTerminalLines(prev => [...prev, { 
            type: 'output', 
            content: `  ${cmd.padEnd(20)} - ${config.description}` 
          }]);
        });
        break;

      case 'hardentool':
        const subCommand = parts[1];
        
        switch (subCommand) {
          case 'audit':
            const profile = parts.find((p, i) => parts[i-1] === '--profile') || 'basic';
            await typewriterEffect(`Starting security audit with profile: ${profile}`);
            await simulateProgress('Scanning system', 3000);
            setTerminalLines(prev => [...prev, { type: 'success', content: '✓ Audit completed successfully' }]);
            setTerminalLines(prev => [...prev, { type: 'output', content: `Found 5 rules, 2 passed, 2 failed, 1 warning` }]);
            setTerminalLines(prev => [...prev, { type: 'output', content: `Overall compliance: 73%` }]);
            break;
            
          case 'enforce':
            const isDryRun = parts.includes('--dry-run');
            await typewriterEffect(`${isDryRun ? 'Simulating' : 'Applying'} security configurations...`);
            await simulateProgress('Processing rules', 2500);
            if (isDryRun) {
              setTerminalLines(prev => [...prev, { type: 'warning', content: '⚠ Dry run mode - no changes made' }]);
            } else {
              setTerminalLines(prev => [...prev, { type: 'success', content: '✓ Security configurations applied' }]);
            }
            setTerminalLines(prev => [...prev, { type: 'output', content: 'Backup created: backup-2024-09-24-1430' }]);
            break;
            
          case 'report':
            const format = parts.find((p, i) => parts[i-1] === '--format') || 'pdf';
            await typewriterEffect(`Generating ${format.toUpperCase()} report...`);
            await simulateProgress('Compiling data', 2000);
            setTerminalLines(prev => [...prev, { type: 'success', content: `✓ Report generated: security-report-${Date.now()}.${format}` }]);
            break;
            
          case 'rollback':
            const backupId = parts.find((p, i) => parts[i-1] === '--id') || 'latest';
            await typewriterEffect(`Rolling back to backup: ${backupId}`);
            await simulateProgress('Restoring configuration', 2500);
            setTerminalLines(prev => [...prev, { type: 'success', content: '✓ Rollback completed successfully' }]);
            break;
            
          case 'list-rules':
            await typewriterEffect('Available security rules:');
            const mockRules = [
              'WIN-001  Password Minimum Length        [CRITICAL] [FAIL]',
              'WIN-002  Account Lockout Policy         [MEDIUM]   [PASS]', 
              'WIN-003  Windows Firewall Status        [HIGH]     [FAIL]',
              'LNX-001  SSH Root Login                 [CRITICAL] [PASS]',
              'LNX-002  File System Permissions        [HIGH]     [WARN]'
            ];
            mockRules.forEach(rule => {
              setTerminalLines(prev => [...prev, { type: 'output', content: `  ${rule}` }]);
            });
            break;
            
          default:
            setTerminalLines(prev => [...prev, { 
              type: 'error', 
              content: `Unknown subcommand: ${subCommand}. Type "help" for available commands.` 
            }]);
        }
        break;
        
      case 'clear':
        setTerminalLines([]);
        break;
        
      case 'history':
        setTerminalLines(prev => [...prev, { type: 'output', content: 'Command history:' }]);
        terminalHistory.slice(-10).forEach((cmd, i) => {
          setTerminalLines(prev => [...prev, { type: 'output', content: `  ${i + 1}: ${cmd}` }]);
        });
        break;
        
      default:
        setTerminalLines(prev => [...prev, { 
          type: 'error', 
          content: `Command not found: ${baseCommand}. Type "help" for available commands.` 
        }]);
    }
    
    setTerminalLines(prev => [...prev, { type: 'output', content: '' }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isTyping) {
      e.preventDefault();
      return;
    }

    switch (e.key) {
      case 'Enter':
        if (currentCommand.trim()) {
          executeCommand(currentCommand.trim());
          setCurrentCommand('');
          setHistoryIndex(-1);
          setShowSuggestions(false);
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (terminalHistory.length > 0) {
          const newIndex = historyIndex + 1;
          if (newIndex < terminalHistory.length) {
            setHistoryIndex(newIndex);
            setCurrentCommand(terminalHistory[terminalHistory.length - 1 - newIndex]);
          }
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setCurrentCommand(terminalHistory[terminalHistory.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        }
        break;
        
      case 'Tab':
        e.preventDefault();
        if (suggestions.length > 0) {
          const suggestion = suggestions[0];
          const parts = currentCommand.split(' ');
          parts[parts.length - 1] = suggestion;
          setCurrentCommand(parts.join(' ') + ' ');
          setShowSuggestions(false);
        }
        break;
        
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const copyTerminalOutput = () => {
    const output = terminalLines.map(line => line.content).join('\n');
    navigator.clipboard.writeText(output);
  };

  const downloadTerminalOutput = () => {
    const output = terminalLines.map(line => 
      `[${line.timestamp || new Date().toLocaleTimeString()}] ${line.content}`
    ).join('\n');
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terminal-output-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white text-gray-900 border-gray-200';
      case 'solarized':
        return 'bg-[#002b36] text-[#839496] border-[#073642]';
      default:
        return 'terminal border-border';
    }
  };

  const getLineClass = (type: TerminalLine['type']) => {
    const baseClass = 'font-mono text-sm leading-relaxed';
    switch (type) {
      case 'command':
        return `${baseClass} text-terminal-accent font-medium`;
      case 'error':
        return `${baseClass} text-destructive`;
      case 'success':
        return `${baseClass} text-success`;
      case 'warning':
        return `${baseClass} text-warning`;
      default:
        return `${baseClass} text-terminal-text`;
    }
  };

  return (
    <div className={cn("p-6", isFullscreen && "fixed inset-0 z-50 bg-background")}>
      <Card className={cn("glass-card border-border/50", isFullscreen && "h-full")}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              CLI Terminal
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Select value={theme} onValueChange={(value: TerminalTheme) => setTheme(value)}>
                <SelectTrigger className="w-32">
                  <Palette className="h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="solarized">Solarized</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="ghost" size="icon-sm" onClick={copyTerminalOutput}>
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon-sm" onClick={downloadTerminalOutput}>
                <Download className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="relative">
            <div 
              ref={terminalRef}
              className={cn(
                "p-6 rounded-b-lg overflow-auto custom-scrollbar relative",
                getThemeClasses(),
                isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[600px]"
              )}
              onClick={() => inputRef.current?.focus()}
            >
              {/* Terminal Output */}
              <div className="space-y-1 mb-4">
                {terminalLines.map((line, index) => (
                  <div key={index} className={getLineClass(line.type)}>
                    {line.content}
                  </div>
                ))}
              </div>
              
              {/* Current Input Line */}
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-terminal-accent">$</span>
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentCommand}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent border-none outline-none text-terminal-text placeholder-terminal-text/50"
                    placeholder="Type command or 'help' for assistance..."
                    disabled={isTyping}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  
                  {/* Suggestions dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg z-10 max-w-xs">
                      {suggestions.slice(0, 5).map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 text-sm hover:bg-muted cursor-pointer font-mono"
                          onClick={() => {
                            const parts = currentCommand.split(' ');
                            parts[parts.length - 1] = suggestion;
                            setCurrentCommand(parts.join(' ') + ' ');
                            setShowSuggestions(false);
                            inputRef.current?.focus();
                          }}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="typing-cursor text-terminal-accent">█</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Command Reference */}
      {!isFullscreen && (
        <Card className="mt-6 glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Common Commands</h4>
                <div className="space-y-1 text-sm font-mono">
                  <div>hardentool audit --profile strict</div>
                  <div>hardentool enforce --dry-run</div>
                  <div>hardentool report --format pdf</div>
                  <div>hardentool list-rules --severity critical</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                <div className="space-y-1 text-sm">
                  <div><Badge variant="outline" className="mr-2">Tab</Badge> Auto-complete</div>
                  <div><Badge variant="outline" className="mr-2">↑/↓</Badge> Command history</div>
                  <div><Badge variant="outline" className="mr-2">Ctrl+C</Badge> Copy output</div>
                  <div><Badge variant="outline" className="mr-2">Esc</Badge> Close suggestions</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}