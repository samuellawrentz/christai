import { Button, ButtonGroup, Input } from "@christianai/ui";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://api.christianai.world";

async function submitWaitlist(email: string, source: string) {
  const response = await fetch(`${API_URL}/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });

  if (!response.ok) {
    throw new Error(`Failed to join waitlist: ${response.statusText}`);
  }

  return response.json();
}

interface WaitlistFormProps {
  source: string;
  className?: string;
}

function WaitlistForm({ source, className }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      await submitWaitlist(email, source);
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`rounded-lg border border-green-200 bg-green-50 p-4 ${className}`}>
        <p className="font-medium text-green-800">Thank you for joining our waitlist!</p>
        <p className="text-green-600 text-sm">We'll notify you when we launch.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <ButtonGroup className="mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 text-background"
          />
          <Button type="submit" variant="secondary" disabled={loading}>
            {loading ? "Joining..." : "Join Waitlist"}
          </Button>
        </ButtonGroup>
      </form>
    </div>
  );
}

export default WaitlistForm;
