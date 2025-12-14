import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
  MessageCircle,
  CheckCircle,
  Heart,
  BookOpen,
  Shield,
  Zap,
  HelpCircle,
  Users,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import "./index.css";

function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement waitlist signup
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ChristianAI</h1>
          <div className="space-x-4">
            <Button variant="ghost">Login</Button>
            <Button>Join Waitlist</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Chat with Biblical Figures
            <span className="block text-blue-600">Through AI</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience meaningful conversations with Christian figures like
            Moses, Joshua, and Jesus. Gain spiritual wisdom and biblical
            insights through advanced AI technology.
          </p>

          {/* CTA Form */}
          <div className="max-w-md mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1"
                  required
                />
                <Button type="submit" size="lg">
                  Join Waitlist
                </Button>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  Thank you for joining our waitlist!
                </p>
                <p className="text-green-600 text-sm">
                  We'll notify you when we launch.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <article className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Moses</h3>
            <p className="text-gray-600">
              Receive guidance inspired by the wisdom of Moses, the great leader
              and lawgiver who led Israel from Egypt.
            </p>
          </article>

          <article className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Joshua</h3>
            <p className="text-gray-600">
              Connect with the courage and faith of Joshua, conqueror of Jericho
              and faithful successor to Moses.
            </p>
          </article>

          <article className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Jesus</h3>
            <p className="text-gray-600">
              Experience the love, teachings, and wisdom of Jesus Christ through
              meaningful dialogue rooted in the Gospels.
            </p>
          </article>
        </section>

        {/* How It Works Section */}
        <section className="mt-32 max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Start your spiritual journey in three simple steps
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            <article className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Choose Your Guide
              </h3>
              <p className="text-gray-600">
                Select from biblical figures including Moses, Joshua, Jesus, and
                many more to come
              </p>
            </article>
            <article className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Ask Questions
              </h3>
              <p className="text-gray-600">
                Engage in meaningful dialogue about faith, life challenges, or
                biblical teachings
              </p>
            </article>
            <article className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Grow Spiritually
              </h3>
              <p className="text-gray-600">
                Receive wisdom and guidance inspired by Scripture to strengthen
                your faith journey
              </p>
            </article>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mt-32 bg-white rounded-2xl shadow-lg p-12 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose ChristianAI?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <article className="flex gap-4">
              <div className="flex-shrink-0">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Biblically Grounded
                </h3>
                <p className="text-gray-600">
                  Every conversation is rooted in Scripture and authentic
                  Christian teachings, providing spiritually sound guidance
                </p>
              </div>
            </article>
            <article className="flex gap-4">
              <div className="flex-shrink-0">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Safe & Private
                </h3>
                <p className="text-gray-600">
                  Your conversations are completely private and secure. We
                  respect your spiritual journey and protect your data
                </p>
              </div>
            </article>
            <article className="flex gap-4">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Available 24/7
                </h3>
                <p className="text-gray-600">
                  Access spiritual guidance whenever you need it, day or night,
                  from anywhere in the world
                </p>
              </div>
            </article>
            <article className="flex gap-4">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Growing Community
                </h3>
                <p className="text-gray-600">
                  Join thousands of believers using AI to deepen their
                  understanding of faith and Scripture
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-32 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Common questions about ChristianAI
          </p>
          <div className="space-y-6">
            <article className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Is this theologically accurate?
                  </h3>
                  <p className="text-gray-600">
                    Our AI is trained on biblical texts and Christian teachings.
                    While it provides meaningful insights, we encourage users to
                    verify guidance with Scripture and consult spiritual leaders
                    for important decisions.
                  </p>
                </div>
              </div>
            </article>
            <article className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can this replace my church or pastor?
                  </h3>
                  <p className="text-gray-600">
                    No. ChristianAI is a supplementary tool for spiritual
                    reflection and learning. It's designed to enhance your faith
                    journey, not replace fellowship, worship, or pastoral care.
                  </p>
                </div>
              </div>
            </article>
            <article className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Which biblical figures will be available?
                  </h3>
                  <p className="text-gray-600">
                    We're launching with Moses, Joshua, and Jesus. More figures
                    from both Old and New Testament will be added based on
                    community feedback and demand.
                  </p>
                </div>
              </div>
            </article>
            <article className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How much does it cost?
                  </h3>
                  <p className="text-gray-600">
                    Pricing details will be announced at launch. We're committed
                    to keeping ChristianAI accessible to believers worldwide
                    with free and premium tiers.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Technology Section */}
        <section className="mt-32 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Powered by Advanced AI
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our conversations are powered by state-of-the-art large language
            models trained on biblical texts and Christian teachings, ensuring
            authentic and spiritually enriching experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              ✨ Authentic Biblical Wisdom
            </span>
            <span className="flex items-center gap-2">🔒 Private & Secure</span>
            <span className="flex items-center gap-2">
              📱 Available Everywhere
            </span>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-center max-w-4xl mx-auto text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands on the waitlist for early access to ChristianAI
          </p>
          <div className="max-w-md mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white text-gray-900"
                  required
                />
                <Button type="submit" size="lg" variant="secondary">
                  Join Waitlist
                </Button>
              </form>
            ) : (
              <div className="bg-white/10 border border-white/20 rounded-lg p-4 backdrop-blur">
                <p className="font-medium">
                  Thank you for joining our waitlist!
                </p>
                <p className="text-sm opacity-90">
                  We'll notify you when we launch.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>
              &copy; 2024 ChristianAI. Bringing faith and technology together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LandingPage />
    </React.StrictMode>
  );
}
