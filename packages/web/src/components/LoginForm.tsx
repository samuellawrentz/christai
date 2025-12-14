import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-3xl text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your ChristianAI account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block font-medium text-gray-700 text-sm"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              className="w-full"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label
              className="mb-2 block font-medium text-gray-700 text-sm"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              className="w-full"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => (window.location.hash = "#signup")}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
