import { Button, Input } from "@christianai/ui";
import { Book, Heart, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../layouts/auth-layout";
import { useAuth } from "../../shared/hooks/use-auth";
import { AuthFeatureCard } from "./components/auth-feature-card";

function SignupContent() {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex flex-col justify-center text-white">
      <div className="max-w-md">
        <h1 className="font-bold text-4xl mb-6 leading-tight">
          Begin Your Spiritual Journey
          <span className="block text-indigo-200 text-2xl mt-2">
            Create Your ChristianAI Account
          </span>
        </h1>

        <div className="space-y-4 text-indigo-50">
          <p className="text-lg">
            Join thousands of believers deepening their faith through AI-powered biblical
            conversations.
          </p>

          <div className="space-y-3 pt-4">
            <AuthFeatureCard
              icon={<Heart className="h-6 w-6 flex-shrink-0 mt-0.5" />}
              title="Divine Conversations"
              description="Experience meaningful dialogue with Moses, Joshua, Jesus, and more"
            />
            <AuthFeatureCard
              icon={<Zap className="h-6 w-6 flex-shrink-0 mt-0.5" />}
              title="Always Available"
              description="Access spiritual wisdom and guidance anytime, anywhere"
            />
            <AuthFeatureCard
              icon={<Book className="h-6 w-6 flex-shrink-0 mt-0.5" />}
              title="Biblically Grounded"
              description="Every conversation rooted in Scripture and authentic Christian teachings"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-12 max-w-md w-full">
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  aria-label="Check mark icon"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  role="img"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="mb-2 font-bold text-2xl text-gray-900">Check Your Email</h1>
              <p className="text-gray-600">
                We've sent a confirmation link to <strong>{email}</strong>
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout content={<SignupContent />}>
      <div className="mb-8">
        <h2 className="font-bold text-2xl text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Start your spiritual journey today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Create a password (min 6 characters)"
            required
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-medium text-gray-700 text-sm mb-2">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
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
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
