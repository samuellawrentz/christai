import {
  BookOpen,
  CheckCircle,
  Heart,
  HelpCircle,
  MessageCircle,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthPage } from "./components/auth-page";
import { ChatsPage } from "./components/chats-page";
import { Button } from "./components/ui/button";
import { ButtonGroup } from "./components/ui/button-group";
import { Input } from "./components/ui/input";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import "./index.css";

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

// Component to track page views on route changes (required for SPA routing)
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track route changes as page views for GA
    if (window.gtag) {
      window.gtag("config", "G-F2FVEHRW7E", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const isDev = import.meta.env.DEV;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement waitlist signup
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative w-full">
        <div
          className="relative w-full bg-center bg-cover bg-no-repeat px-4 py-6 pb-24"
          style={{ backgroundImage: "url(/images/moses.png)" }}
        >
          {/* Fade gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent-30" />

          {/* Header */}
          <header className="container relative mx-auto">
            <nav className="flex items-center justify-between">
              <h1 className="font-bold text-2xl text-white drop-shadow-lg">ChristianAI</h1>
              <div className="space-x-4">
                {user ? (
                  <Link to="/chats">
                    <Button>Go to Chats</Button>
                  </Link>
                ) : isDev ? (
                  <Link to="/auth">
                    <Button className="text-white hover:bg-white/20" variant="ghost">
                      Login
                    </Button>
                  </Link>
                ) : null}
                <Button>Join Waitlist</Button>
              </div>
            </nav>
          </header>

          {/* Content */}
          <div className="relative mx-auto mt-32 max-w-4xl text-center">
            <h2 className="mb-6 font-bold text-5xl text-white md:text-6xl">
              Chat with <span className="text-white">Biblical Figures</span>
            </h2>
            <div className="mx-auto mb-8 max-w-2xl bg-gradient-radial from-black/15 via-black/10 to-transparent p-4 backdrop-blur-[2px]">
              <p className="text-white text-xl drop-shadow-lg">
                Experience meaningful conversations with Christian figures like Moses, Joshua, and
                Jesus. Gain spiritual wisdom and biblical insights through advanced AI technology.
              </p>
            </div>

            {/* CTA Form */}
            <div className="mx-auto max-w-md">
              {submitted ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="font-medium text-green-800">Thank you for joining our waitlist!</p>
                  <p className="text-green-600 text-sm">We'll notify you when we launch.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <ButtonGroup>
                    <Input
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      type="email"
                      value={email}
                    />
                    <Button size="lg" type="submit">
                      Join Waitlist
                    </Button>
                  </ButtonGroup>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Features Section */}
        <section className="mx-auto mt-20 grid max-w-6xl gap-8 md:grid-cols-3">
          <article className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 text-xl">Moses</h3>
            <p className="text-gray-600">
              Receive guidance inspired by the wisdom of Moses, the great leader and lawgiver who
              led Israel from Egypt.
            </p>
          </article>

          <article className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 text-xl">Joshua</h3>
            <p className="text-gray-600">
              Connect with the courage and faith of Joshua, conqueror of Jericho and faithful
              successor to Moses.
            </p>
          </article>

          <article className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 text-xl">Jesus</h3>
            <p className="text-gray-600">
              Experience the love, teachings, and wisdom of Jesus Christ through meaningful dialogue
              rooted in the Gospels.
            </p>
          </article>
        </section>

        {/* How It Works Section */}
        <section className="mx-auto mt-32 max-w-5xl">
          <h2 className="mb-4 text-center font-bold text-4xl text-gray-900">How It Works</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600 text-lg">
            Start your spiritual journey in three simple steps
          </p>
          <div className="grid gap-12 md:grid-cols-3">
            <article className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 font-bold text-2xl text-white">
                1
              </div>
              <h3 className="mb-3 font-semibold text-gray-900 text-xl">Choose Your Guide</h3>
              <p className="text-gray-600">
                Select from biblical figures including Moses, Joshua, Jesus, and many more to come
              </p>
            </article>
            <article className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 font-bold text-2xl text-white">
                2
              </div>
              <h3 className="mb-3 font-semibold text-gray-900 text-xl">Ask Questions</h3>
              <p className="text-gray-600">
                Engage in meaningful dialogue about faith, life challenges, or biblical teachings
              </p>
            </article>
            <article className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 font-bold text-2xl text-white">
                3
              </div>
              <h3 className="mb-3 font-semibold text-gray-900 text-xl">Grow Spiritually</h3>
              <p className="text-gray-600">
                Receive wisdom and guidance inspired by Scripture to strengthen your faith journey
              </p>
            </article>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mx-auto mt-32 max-w-6xl rounded-2xl bg-white p-12 shadow-lg">
          <h2 className="mb-12 text-center font-bold text-4xl text-gray-900">
            Why Choose ChristianAI?
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <article className="flex gap-4">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 text-xl">Biblically Grounded</h3>
                <p className="text-gray-600">
                  Every conversation is rooted in Scripture and authentic Christian teachings,
                  providing spiritually sound guidance
                </p>
              </div>
            </article>
            <article className="flex gap-4">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 text-xl">Safe & Private</h3>
                <p className="text-gray-600">
                  Your conversations are completely private and secure. We respect your spiritual
                  journey and protect your data
                </p>
              </div>
            </article>
            <article className="flex gap-4">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 text-xl">Available 24/7</h3>
                <p className="text-gray-600">
                  Access spiritual guidance whenever you need it, day or night, from anywhere in the
                  world
                </p>
              </div>
            </article>
            <article className="flex gap-4">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 text-xl">Growing Community</h3>
                <p className="text-gray-600">
                  Join thousands of believers using AI to deepen their understanding of faith and
                  Scripture
                </p>
              </div>
            </article>
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
            <article className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-start gap-4">
                <HelpCircle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-xl">
                    Is this theologically accurate?
                  </h3>
                  <p className="text-gray-600">
                    Our AI is trained on biblical texts and Christian teachings. While it provides
                    meaningful insights, we encourage users to verify guidance with Scripture and
                    consult spiritual leaders for important decisions.
                  </p>
                </div>
              </div>
            </article>
            <article className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-start gap-4">
                <HelpCircle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-xl">
                    Can this replace my church or pastor?
                  </h3>
                  <p className="text-gray-600">
                    No. ChristianAI is a supplementary tool for spiritual reflection and learning.
                    It's designed to enhance your faith journey, not replace fellowship, worship, or
                    pastoral care.
                  </p>
                </div>
              </div>
            </article>
            <article className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-start gap-4">
                <HelpCircle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-xl">
                    Which biblical figures will be available?
                  </h3>
                  <p className="text-gray-600">
                    We're launching with Moses, Joshua, and Jesus. More figures from both Old and
                    New Testament will be added based on community feedback and demand.
                  </p>
                </div>
              </div>
            </article>
            <article className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-start gap-4">
                <HelpCircle className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-xl">
                    How much does it cost?
                  </h3>
                  <p className="text-gray-600">
                    Pricing details will be announced at launch. We're committed to keeping
                    ChristianAI accessible to believers worldwide with free and premium tiers.
                  </p>
                </div>
              </div>
            </article>
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
        <section className="mx-auto mt-32 max-w-4xl rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center text-white shadow-xl">
          <h2 className="mb-4 font-bold text-4xl">Ready to Begin Your Journey?</h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands on the waitlist for early access to ChristianAI
          </p>
          <div className="mx-auto max-w-md">
            {submitted ? (
              <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
                <p className="font-medium">Thank you for joining our waitlist!</p>
                <p className="text-sm opacity-90">We'll notify you when we launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <ButtonGroup>
                  <Input
                    className="bg-white text-gray-900"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    type="email"
                    value={email}
                  />
                  <Button size="lg" type="submit" variant="secondary">
                    Join Waitlist
                  </Button>
                </ButtonGroup>
              </form>
            )}
          </div>
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

function App() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-blue-600 border-b-2" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={user ? <Navigate replace to="/chats" /> : <AuthPage />} path="/auth" />
        <Route element={user ? <ChatsPage /> : <Navigate replace to="/" />} path="/chats" />
      </Routes>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
  );
}
