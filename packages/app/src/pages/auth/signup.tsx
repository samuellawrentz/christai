import { Button, Input } from "@christianai/ui";
import { Heart, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../layouts/auth-layout";
import { useAuth } from "../../shared/hooks/use-auth";
import { AuthFeatureCard } from "./components/auth-feature-card";

const isDev = window.location.hostname === "localhost";

function SignupContent() {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex flex-col justify-center text-white">
      <div className="max-w-md">
        <h1 className="font-bold text-4xl mb-6 leading-tight">Connect with Biblical Wisdom</h1>

        <p className="text-lg text-indigo-50 mb-8">
          Join a growing community of believers deepening their faith through meaningful
          conversations with biblical figures.
        </p>

        <div className="space-y-4">
          <AuthFeatureCard
            icon={<Heart className="h-6 w-6 flex-shrink-0 mt-0.5" />}
            title="Free to Use"
            description="Start your journey at no cost"
          />
          <AuthFeatureCard
            icon={<Zap className="h-6 w-6 flex-shrink-0 mt-0.5" />}
            title="Always Available"
            description="Guidance anytime, anywhere"
          />
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

  useEffect(() => {
    document.title = "Sign Up Free - ChristianAI | Chat with Biblical Figures";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Create your free ChristianAI account. Chat with Moses, Joshua, and Jesus through AI-powered biblical conversations.",
      );
    }
  }, []);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-12 max-w-md w-full text-center">
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
          <p className="text-gray-600 mb-6">
            We've sent a confirmation link to <strong>{email}</strong>
          </p>
          <Link to="/">
            <Button variant="outline" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout content={<SignupContent />}>
      <div className="mb-8">
        <h2 className="font-bold text-2xl text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Free forever</p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={loading}>
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
        {loading ? "Creating account..." : "Continue with Google"}
      </Button>

      {isDev && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Dev only</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </Button>
          </form>
        </>
      )}

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
