import { Button, ButtonGroup, Input } from "@christianai/ui";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://api.christianai.world";

async function submitWaitlist(email: string, source: string) {
  const response = await fetch(`${API_URL}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });

  if (!response.ok) {
    throw new Error(`Failed to join waitlist: ${response.statusText}`);
  }

  return response.json();
}

function WaitlistForm({ source, className }: { source: string; className?: string }) {
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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="p-6 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-gray-900 text-xl">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </article>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <article className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 font-bold text-2xl text-white">
        {number}
      </div>
      <h3 className="mb-3 font-semibold text-gray-900 text-xl">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </article>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="flex gap-4">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h3 className="mb-2 font-semibold text-gray-900 text-xl">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </article>
  );
}

function FAQCard({ question, answer }: { question: string; answer: string }) {
  return (
    <article className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-start gap-4">
        <svg
          aria-hidden="true"
          className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="mb-2 font-semibold text-gray-900 text-xl">{question}</h3>
          <p className="text-gray-600">{answer}</p>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative w-full">
        <div
          className="relative w-full bg-center bg-cover bg-no-repeat px-4 py-6 pb-24"
          style={{ backgroundImage: "url(/images/moses.png)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent-30" />

          <header className="container relative mx-auto">
            <nav className="flex items-center justify-between">
              <div>
                <img
                  src="/images/logo.svg"
                  alt="ChristianAI Logo"
                  className="size-[300px] invert absolute -top-[100px] left-0"
                />
              </div>
              <div className="space-x-4">
                <Button variant="ghost" className="text-white hover:bg-white/20" asChild>
                  <a href="https://app.christianai.world">Launch App</a>
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() =>
                    document.getElementById("final-cta")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Join Waitlist
                </Button>
              </div>
            </nav>
          </header>

          <div className="relative mx-auto mt-32 max-w-4xl text-center">
            <h1 className="mb-6 font-bold text-5xl text-white md:text-6xl">
              Chat with <span className="text-white">Biblical Figures</span>
            </h1>
            <div className="mx-auto mb-8 max-w-2xl bg-gradient-radial from-black/15 via-black/10 to-transparent p-4 backdrop-blur-[2px]">
              <p className="text-white text-xl drop-shadow-lg">
                Experience meaningful conversations with Christian figures like Moses, Joshua, and
                Jesus. Gain spiritual wisdom and biblical insights through advanced AI technology.
              </p>
            </div>
            <WaitlistForm source="hero" className="mx-auto max-w-md" />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Features Section */}
        <section className="mx-auto mt-20 grid max-w-6xl gap-8 md:grid-cols-3">
          <FeatureCard
            icon={
              <svg
                aria-hidden="true"
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
            title="Moses"
            description="Receive guidance inspired by the wisdom of Moses, the great leader and lawgiver who led Israel from Egypt."
          />
          <FeatureCard
            icon={
              <svg
                aria-hidden="true"
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="Joshua"
            description="Connect with the courage and faith of Joshua, conqueror of Jericho and faithful successor to Moses."
          />
          <FeatureCard
            icon={
              <svg
                aria-hidden="true"
                className="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            }
            title="Jesus"
            description="Experience the love, teachings, and wisdom of Jesus Christ through meaningful dialogue rooted in the Gospels."
          />
        </section>

        {/* How It Works Section */}
        <section className="mx-auto mt-32 max-w-5xl">
          <h2 className="mb-4 text-center font-bold text-4xl text-gray-900">How It Works</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600 text-lg">
            Start your spiritual journey in three simple steps
          </p>
          <div className="grid gap-12 md:grid-cols-3">
            <StepCard
              number={1}
              title="Choose Your Guide"
              description="Select from biblical figures including Moses, Joshua, Jesus, and many more to come"
            />
            <StepCard
              number={2}
              title="Ask Questions"
              description="Engage in meaningful dialogue about faith, life challenges, or biblical teachings"
            />
            <StepCard
              number={3}
              title="Grow Spiritually"
              description="Receive wisdom and guidance inspired by Scripture to strengthen your faith journey"
            />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mx-auto mt-32 max-w-6xl rounded-2xl bg-white p-12 shadow-lg">
          <h2 className="mb-12 text-center font-bold text-4xl text-gray-900">
            Why Choose ChristianAI?
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <BenefitCard
              icon={
                <svg
                  aria-hidden="true"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
              title="Biblically Grounded"
              description="Every conversation is rooted in Scripture and authentic Christian teachings, providing spiritually sound guidance"
            />
            <BenefitCard
              icon={
                <svg
                  aria-hidden="true"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
              title="Safe & Private"
              description="Your conversations are completely private and secure. We respect your spiritual journey and protect your data"
            />
            <BenefitCard
              icon={
                <svg
                  aria-hidden="true"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              title="Available 24/7"
              description="Access spiritual guidance whenever you need it, day or night, from anywhere in the world"
            />
            <BenefitCard
              icon={
                <svg
                  aria-hidden="true"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
              title="Growing Community"
              description="Join thousands of believers using AI to deepen their understanding of faith and Scripture"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mx-auto mt-32 max-w-4xl">
          <h2 className="mb-4 text-center font-bold text-4xl text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mb-12 text-center text-gray-600 text-lg">
            Common questions about ChristianAI
          </p>
          <div className="space-y-6">
            <FAQCard
              question="Is this theologically accurate?"
              answer="Our AI is trained on biblical texts and Christian teachings. While it provides meaningful insights, we encourage users to verify guidance with Scripture and consult spiritual leaders for important decisions."
            />
            <FAQCard
              question="Can this replace my church or pastor?"
              answer="No. ChristianAI is a supplementary tool for spiritual reflection and learning. It's designed to enhance your faith journey, not replace fellowship, worship, or pastoral care."
            />
            <FAQCard
              question="Which biblical figures will be available?"
              answer="We're launching with Moses, Joshua, and Jesus. More figures from both Old and New Testament will be added based on community feedback and demand."
            />
            <FAQCard
              question="How much does it cost?"
              answer="Pricing details will be announced at launch. We're committed to keeping ChristianAI accessible to believers worldwide with free and premium tiers."
            />
          </div>
        </section>

        {/* Technology Section */}
        <section className="mx-auto mt-32 max-w-3xl text-center">
          <h2 className="mb-6 font-bold text-3xl text-gray-900">Powered by Advanced AI</h2>
          <p className="mb-8 text-gray-600 text-lg">
            Our conversations are powered by state-of-the-art large language models trained on
            biblical texts and Christian teachings, ensuring authentic and spiritually enriching
            experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-sm">
            <span className="flex items-center gap-2">✨ Authentic Biblical Wisdom</span>
            <span className="flex items-center gap-2">🔒 Private & Secure</span>
            <span className="flex items-center gap-2">📱 Available Everywhere</span>
          </div>
        </section>

        {/* Final CTA */}
        <section
          id="final-cta"
          className="mx-auto mt-32 max-w-4xl rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center text-white shadow-xl"
        >
          <h2 className="mb-4 font-bold text-4xl">Ready to Begin Your Journey?</h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands on the waitlist for early access to ChristianAI
          </p>
          <WaitlistForm source="final_cta" className="mx-auto max-w-md" />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-gray-200 border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 ChristianAI. Bringing faith and technology together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
