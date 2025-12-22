import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F5F0E6]">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <h1 className="text-3xl font-serif mb-6">Profile</h1>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-gray-600">Profile page coming soon...</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
