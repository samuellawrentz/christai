import { SidebarProvider } from "@christianai/ui";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/app-sidebar";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
