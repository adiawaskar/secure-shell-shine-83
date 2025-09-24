import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Shield,
  BarChart3,
  Terminal,
  Search,
  FileText,
  Settings,
  History,
  Users,
  HelpCircle,
  ChevronDown,
  Activity
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "CLI Terminal", url: "/cli", icon: Terminal },
  { title: "Audit Results", url: "/audit", icon: Search },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Activity Logs", url: "/logs", icon: Activity },
];

const managementItems = [
  { title: "Profiles", url: "/profiles", icon: Users },
  { title: "Rollback", url: "/rollback", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
];

const supportItems = [
  { title: "Help & Guide", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const { state: sidebarState } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [managementOpen, setManagementOpen] = useState(true);
  const [supportOpen, setSupportOpen] = useState(false);

  const isCollapsed = sidebarState === "collapsed";

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavClass = (path: string) => cn(
    "nav-link transition-all duration-200",
    isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
  );

  return (
    <Sidebar
      className={cn(
        "border-r border-border bg-card",
        isCollapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Shield className="h-8 w-8 text-primary" />
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-foreground">HardenTool</h1>
            <p className="text-xs text-muted-foreground">System Security</p>
          </div>
        )}
      </div>

      <SidebarContent className="px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn("text-xs font-medium text-muted-foreground mb-2", isCollapsed && "sr-only")}>
            MAIN
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        {!isCollapsed && (
          <Collapsible open={managementOpen} onOpenChange={setManagementOpen}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded px-2 py-1 text-xs font-medium text-muted-foreground">
                  MANAGEMENT
                  <ChevronDown className={cn("h-3 w-3 transition-transform", managementOpen && "rotate-180")} />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {managementItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={item.url} className={getNavClass(item.url)}>
                            <item.icon className="h-4 w-4" />
                            <span className="ml-3">{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Support Section */}
        {!isCollapsed && (
          <Collapsible open={supportOpen} onOpenChange={setSupportOpen}>
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded px-2 py-1 text-xs font-medium text-muted-foreground">
                  SUPPORT
                  <ChevronDown className={cn("h-3 w-3 transition-transform", supportOpen && "rotate-180")} />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {supportItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={item.url} className={getNavClass(item.url)}>
                            <item.icon className="h-4 w-4" />
                            <span className="ml-3">{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Collapsed state management icons */}
        {isCollapsed && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="sr-only">Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {managementItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <NavLink to={item.url} className={getNavClass(item.url)}>
                          <item.icon className="h-4 w-4" />
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="sr-only">Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {supportItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <NavLink to={item.url} className={getNavClass(item.url)}>
                          <item.icon className="h-4 w-4" />
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer - only show when expanded */}
      {!isCollapsed && (
        <div className="mt-auto p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <div className="font-medium">Version 2.1.0</div>
            <div>© 2024 HardenTool</div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}