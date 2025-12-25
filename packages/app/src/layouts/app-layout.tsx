import { Outlet } from "react-router-dom";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";

export function AppLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
      <BottomNav />
    </>
  );
}
