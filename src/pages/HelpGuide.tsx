import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Download,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  Shield,
  Terminal,
  Settings,
  BarChart3,
  Users,
  FileText,
  PlayCircle,
  Phone,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface GuideSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  articles: {
    title: string;
    description: string;
    readTime: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }[];
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I run my first security audit?',
    answer: 'Navigate to the CLI Terminal or Dashboard and click "Quick Audit". You can also use the command "hardentool audit --profile basic" in the terminal for a basic security scan.',
    category: 'Getting Started',
    tags: ['audit', 'cli', 'beginner']
  },
  {
    id: '2',
    question: 'What is the difference between security profiles?',
    answer: 'Basic profile includes essential security controls, Strict profile has comprehensive security measures for high-security environments, and Custom profiles can be tailored to your specific needs.',
    category: 'Profiles',
    tags: ['profiles', 'security', 'configuration']
  },
  {
    id: '3',
    question: 'How do I restore from a backup?',
    answer: 'Go to the Rollback Manager, select your backup, and click "Restore". The system will automatically create a new backup before restoration begins.',
    category: 'Backup & Recovery',
    tags: ['backup', 'restore', 'rollback']
  },
  {
    id: '4',
    question: 'Can I schedule automatic scans?',
    answer: 'Yes, go to Settings > System Settings and configure the "Scan Schedule" option. You can set it to hourly, daily, weekly, or manual only.',
    category: 'Automation',
    tags: ['scheduling', 'automation', 'scans']
  },
  {
    id: '5',
    question: 'How do I export compliance reports?',
    answer: 'In the Reports section, select your report and click the download button. Reports can be exported as PDF, HTML, or JSON formats.',
    category: 'Reporting',
    tags: ['reports', 'export', 'compliance']
  },
  {
    id: '6',
    question: 'What platforms are supported?',
    answer: 'HardenTool supports Windows Server 2016+, Windows 10/11, Ubuntu 18.04+, CentOS 7+, RHEL 7+, and Amazon Linux 2. More platforms are added regularly.',
    category: 'Compatibility',
    tags: ['platforms', 'windows', 'linux', 'compatibility']
  }
];

const guidesections: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of HardenTool and complete your first security audit',
    icon: Lightbulb,
    articles: [
      {
        title: 'Quick Start Guide',
        description: 'Get up and running with HardenTool in 5 minutes',
        readTime: '5 min',
        difficulty: 'beginner'
      },
      {
        title: 'Understanding Security Profiles',
        description: 'Learn about different security profiles and when to use them',
        readTime: '8 min',
        difficulty: 'beginner'
      },
      {
        title: 'Your First Security Audit',
        description: 'Step-by-step guide to running your first comprehensive audit',
        readTime: '12 min',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'cli-usage',
    title: 'CLI Usage',
    description: 'Master the command-line interface for advanced operations',
    icon: Terminal,
    articles: [
      {
        title: 'CLI Command Reference',
        description: 'Complete reference of all available CLI commands',
        readTime: '15 min',
        difficulty: 'intermediate'
      },
      {
        title: 'Automation with Scripts',
        description: 'Create automated workflows using CLI commands',
        readTime: '20 min',
        difficulty: 'advanced'
      },
      {
        title: 'Advanced CLI Features',
        description: 'Discover powerful CLI features for power users',
        readTime: '18 min',
        difficulty: 'advanced'
      }
    ]
  },
  {
    id: 'security-management',
    title: 'Security Management',
    description: 'Advanced security configuration and compliance management',
    icon: Shield,
    articles: [
      {
        title: 'Creating Custom Security Profiles',
        description: 'Build tailored security profiles for your environment',
        readTime: '25 min',
        difficulty: 'intermediate'
      },
      {
        title: 'Compliance Frameworks',
        description: 'Map security controls to industry compliance frameworks',
        readTime: '30 min',
        difficulty: 'advanced'
      },
      {
        title: 'Multi-Platform Deployment',
        description: 'Deploy consistent security policies across platforms',
        readTime: '35 min',
        difficulty: 'advanced'
      }
    ]
  },
  {
    id: 'reporting',
    title: 'Reporting & Analytics',
    description: 'Generate comprehensive reports and analyze security trends',
    icon: BarChart3,
    articles: [
      {
        title: 'Understanding Compliance Metrics',
        description: 'Interpret compliance scores and security metrics',
        readTime: '10 min',
        difficulty: 'beginner'
      },
      {
        title: 'Custom Report Templates',
        description: 'Create custom report templates for your organization',
        readTime: '22 min',
        difficulty: 'intermediate'
      },
      {
        title: 'Trend Analysis and Forecasting',
        description: 'Analyze security trends and predict future risks',
        readTime: '28 min',
        difficulty: 'advanced'
      }
    ]
  }
];

export default function HelpGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openSections, setOpenSections] = useState<string[]>(['getting-started']);

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success/10 text-success border-success/20';
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Help & Guide</h1>
          <p className="text-muted-foreground">Documentation, tutorials, and support resources</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4" />
            Video Tutorials
          </Button>
          <Button>
            <MessageCircle className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50 hover-lift cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Getting Started</h3>
                <p className="text-xs text-muted-foreground">5-minute quick start</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-border/50 hover-lift cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Video className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-semibold text-foreground">Video Tutorials</h3>
                <p className="text-xs text-muted-foreground">Step-by-step guides</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover-lift cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-warning" />
              <div>
                <h3 className="font-semibold text-foreground">Documentation</h3>
                <p className="text-xs text-muted-foreground">Complete reference</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50 hover-lift cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="font-semibold text-foreground">Support</h3>
                <p className="text-xs text-muted-foreground">Get help from experts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and FAQ */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Find quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <Collapsible key={faq.id}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 cursor-pointer transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-left">{faq.question}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                        {faq.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs bg-muted">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 mt-2 rounded-lg bg-muted/30">
                    <p className="text-sm text-foreground">{faq.answer}</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No FAQs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse by category.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Sections */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Documentation</h2>
        
        {guidesections.map(section => (
          <Card key={section.id} className="glass-card border-border/50">
            <Collapsible 
              open={openSections.includes(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <section.icon className="h-6 w-6 text-primary" />
                      <div className="text-left">
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      openSections.includes(section.id) && "rotate-180"
                    )} />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.articles.map((article, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 cursor-pointer transition-colors hover-lift"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground">{article.title}</h4>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{article.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{article.readTime} read</span>
                          <Badge className={getDifficultyColor(article.difficulty)}>
                            {article.difficulty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Contact Support */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Still Need Help?
          </CardTitle>
          <CardDescription>Get in touch with our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Get help via email with detailed responses
              </p>
              <Button variant="outline" size="sm">
                support@hardentool.com
              </Button>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Chat with our support team in real-time
              </p>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-warning" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Phone Support</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Speak directly with a support specialist
              </p>
              <Button variant="outline" size="sm">
                +1 (555) 123-4567
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}