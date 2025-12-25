import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@christianai/ui";
import { LogOut, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/use-auth";

export function AppHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="!bg-transparent backdrop-blur-md border-b border-gray-900 sticky top-0 z-50 shadow-sm transition-all duration-300 mix-blend-difference">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex w-[180px] items-center gap-3 invert">
          <img
            src="/images/logo.svg"
            alt="ChristianAI Logo"
            className="h-[180px] absolute w-auto transition-all duration-300 hover:scale-105 hover:drop-shadow-md"
            loading="eager"
          />
        </Link>

        <div className="invert">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user?.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleProfile}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleProfile}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
