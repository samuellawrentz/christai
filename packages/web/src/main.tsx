import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { MessageCircle, CheckCircle, Heart } from "lucide-react";
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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Chat with Biblical Figures
            <span className="block text-blue-600">Through AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience meaningful conversations with Christian figures like Moses, Joshua, and Jesus.
            Gain spiritual wisdom and biblical insights through advanced AI technology.
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
                <p className="text-green-800 font-medium">Thank you for joining our waitlist!</p>
                <p className="text-green-600 text-sm">We'll notify you when we launch.</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Moses</h3>
            <p className="text-gray-600">Receive guidance inspired by the wisdom of Moses, the great leader and lawgiver.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Joshua</h3>
            <p className="text-gray-600">Connect with the courage and faith of Joshua, conqueror of Jericho and successor to Moses.</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Jesus</h3>
            <p className="text-gray-600">Experience the love, teachings, and wisdom of Jesus Christ through meaningful dialogue.</p>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Powered by Advanced AI</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our conversations are powered by state-of-the-art large language models trained on biblical texts
            and Christian teachings, ensuring authentic and spiritually enriching experiences.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✨ Authentic Biblical Wisdom</span>
            <span>🔒 Private & Secure</span>
            <span>📱 Available Everywhere</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 ChristianAI. Bringing faith and technology together.</p>
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
