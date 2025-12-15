import { supabase } from "./lib/supabase";

const server = Bun.serve({
  port: process.env.PORT || 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // Determine allowed origin
    const origin = req.headers.get("origin") || "";
    const allowedOrigins = [
      "http://localhost:5173",
      "https://christianai.world",
      "https://www.christianai.world",
    ];
    const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Add CORS headers to all responses
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    if (url.pathname === "/api/waitlist" && req.method === "POST") {
      try {
        const body = (await req.json()) as { email?: string; source?: string };
        const { email, source } = body;

        // Validate email
        if (!email || typeof email !== "string") {
          return new Response(JSON.stringify({ error: "Email is required" }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return new Response(JSON.stringify({ error: "Invalid email format" }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          });
        }

        // Insert into Supabase (duplicate emails will be handled by unique constraint)
        const { error } = await supabase
          .from("waitlist")
          .insert({ email: email.toLowerCase().trim(), source });

        // Return success even if email already exists (don't reveal existence)
        if (error && !error.message.includes("duplicate")) {
          console.error("Waitlist insert error:", error);
          return new Response(JSON.stringify({ error: "Failed to join waitlist" }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      } catch (error) {
        console.error("Waitlist endpoint error:", error);
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }
    }

    return new Response("ChristianAI API", {
      headers: {
        "Content-Type": "text/plain",
        ...corsHeaders,
      },
    });
  },
});

console.log(`🚀 API server running at http://localhost:${server.port}`);
