import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@christianai/ui";
import { MessageCircle, Moon, Settings, Sun, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useConversations } from "@/hooks/use-conversations";
import { useTheme } from "@/hooks/use-theme";
import { useUser } from "@/hooks/use-user";
import { useAuth } from "@/shared/hooks/use-auth";
import { groupConversationsByDate } from "@/utils/chat-utils";

export function AppSidebar() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const { data: conversations = [] } = useConversations();
  const { resolvedTheme, setTheme } = useTheme(user?.preferences);

  const handleSignOut = async () => {
    await signOut();
  };

  // Get last 20 conversations sorted by last_message_at or created_at
  const recentConversations = conversations
    .sort((a, b) => {
      const aDate = a.last_message_at || a.updated_at;
      const bDate = b.last_message_at || b.updated_at;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    })
    .slice(0, 20);

  const groupedChats = groupConversationsByDate(recentConversations);

  return (
    <Sidebar className="backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
      <SidebarHeader>
        <Link to="/home" className="flex w-full h-14 items-center gap-3 px-4 py-4">
          <img
            src="/images/logo.svg"
            alt="ChristianAI Logo"
            className="h-[180px] w-auto transition-all duration-300 hover:scale-105 hover:drop-shadow-md dark:invert"
            loading="eager"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {recentConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <SidebarMenu>
                {Object.entries(groupedChats).map(([dateGroup, chats]) => (
                  <div key={dateGroup}>
                    <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                      {dateGroup}
                    </div>
                    {chats.map((chat) => {
                      const isActive = location.pathname === `/chats/${chat.id}`;
                      const figureName = chat.figures?.display_name || "Unknown";
                      const title = chat.title || `Chat with ${figureName}`;

                      return (
                        <SidebarMenuItem key={chat.id}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link to={`/chats/${chat.id}`} className="flex items-center gap-2">
                              <span className="truncate">{title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </div>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-full"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user?.email || "User"}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
