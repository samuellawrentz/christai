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
  const { signUp, signInWithGoogle } = useAuth();

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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
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

      <Button
        onClick={handleGoogleSignIn}
        variant="outline"
        className="w-full mb-4"
        disabled={loading}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" role="img" aria-label="Google logo">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with email</span>
        </div>
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
