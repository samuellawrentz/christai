import { Button, Input } from "@christianai/ui";
import { Book, MessageCircle, Shield } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/auth-layout";
import { useAuth } from "../../shared/hooks/use-auth";
import { AuthFeatureCard } from "./components/auth-feature-card";

function LoginContent() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex flex-col justify-center text-white">
      <div className="max-w-md">
        <h1 className="font-bold text-4xl mb-6 leading-tight">
          Login to ChristianAI
          <span className="block text-blue-200 text-2xl mt-2">
            Your AI-Powered Spiritual Companion
          </span>
        </h1>

        <div className="space-y-4 text-blue-50">
          <p className="text-lg">
            Welcome back! Sign in to continue your sacred journey of faith and spiritual growth.
          </p>

          <div className="space-y-3 pt-4">
            <AuthFeatureCard
              icon={<MessageCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />}
              title="Connect with Biblical Figures"
              description="Engage in meaningful conversations with Moses, Joshua, Jesus, and more"
            />
            <AuthFeatureCard
              icon={<Book className="h-6 w-6 flex-shrink-0 mt-0.5" />}
              title="Access Biblical Wisdom"
              description="Receive Scripture-based guidance and spiritual insights 24/7"
            />
            <AuthFeatureCard
              icon={<Shield className="h-6 w-6 flex-shrink-0 mt-0.5" />}
              title="Private & Secure"
              description="Your spiritual conversations are confidential and protected"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Navigate to home on successful sign in
      navigate("/home", { replace: true });
    }
  };

  return (
    <AuthLayout content={<LoginContent />}>
      <div className="mb-8">
        <h2 className="font-bold text-2xl text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium text-gray-700 text-sm mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium text-gray-700 text-sm mb-2">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full"
          />
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
