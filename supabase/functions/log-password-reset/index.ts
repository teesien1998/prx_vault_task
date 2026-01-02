// Supabase Edge Function: log-password-reset
// Logs password reset events with user email and reset time

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  email: string;
  resetTime: string;
}

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    // Parse request body
    const { email, resetTime }: RequestBody = await req.json();

    // Log the password reset event
    console.log("Password reset logged:", {
      email,
      resetTime,
      timestamp: new Date().toISOString(),
    });

    // Return success response
    return new Response(JSON.stringify({ status: "logged" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error logging password reset:", error);
    return new Response(
      JSON.stringify({ error: "Failed to log password reset" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
