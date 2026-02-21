import { SidebarInset, SidebarProvider, SidebarTrigger } from "@christianai/ui";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/app-sidebar";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(0,0,0,0.4)]">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 md:hidden">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex flex-1 flex-col gap-4 min-h-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
