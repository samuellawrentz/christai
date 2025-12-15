import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { Button } from "./ui/button";

export function ChatsPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  // Example: Test API connection
  const testApi = async () => {
    try {
      const health = await api.health();
      console.log("API is healthy:", health);
    } catch (error) {
      console.error("API connection failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-gray-200 border-b bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="font-bold text-2xl text-blue-600">ChristianAI</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.email}</span>
            <Button onClick={testApi} variant="ghost">
              Test API
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="rounded-lg bg-white p-8 text-center shadow-lg">
          <h2 className="mb-4 font-bold text-3xl text-gray-900">
            Welcome to ChristianAI
          </h2>
          <p className="mb-8 text-gray-600 text-xl">
            Your spiritual journey begins here. Chat with biblical figures and
            gain wisdom from Scripture.
          </p>
          <div className="mx-auto max-w-2xl rounded-lg border border-blue-200 bg-blue-50 p-6">
            <p className="text-blue-800">
              🚧 <strong>Chats feature coming soon!</strong> This is a
              placeholder page for the authenticated user experience.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
