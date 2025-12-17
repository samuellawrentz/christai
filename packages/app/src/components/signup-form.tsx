import { Button, Input } from "@christianai/ui";
import { useState } from "react";
import { useAuth } from "../contexts/auth-context";

export function SignupForm() {
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
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
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h1 className="mb-2 font-bold text-2xl text-gray-900">Check Your Email</h1>
            <p className="text-gray-600">
              We've sent a confirmation link to <strong>{email}</strong>
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              window.location.hash = "#login";
            }}
            variant="outline"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-3xl text-gray-900">Create Account</h1>
          <p className="text-gray-600">Join ChristianAI to start your spiritual journey</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block font-medium text-gray-700 text-sm" htmlFor="email">
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
            <label className="mb-2 block font-medium text-gray-700 text-sm" htmlFor="password">
              Password
            </label>
            <Input
              className="w-full"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min 6 characters)"
              required
              type="password"
              value={password}
            />
          </div>

          <div>
            <label
              className="mb-2 block font-medium text-gray-700 text-sm"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <Input
              className="w-full"
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              type="password"
              value={confirmPassword}
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => {
                window.location.hash = "#login";
              }}
              type="button"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
