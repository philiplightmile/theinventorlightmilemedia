import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { to, subject, message, senderEmail, senderName } = await req.json();

    // Validate inputs
    if (!to || !subject || !message || !senderEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, message, senderEmail' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to) || !emailRegex.test(senderEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limit input lengths
    if (subject.length > 200 || message.length > 5000 || senderEmail.length > 255 || to.length > 255) {
      return new Response(
        JSON.stringify({ error: 'Input exceeds maximum length' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const displayName = senderName || senderEmail;
    const sanitize = (str: string) => str.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Your Colleague at eos Products <eos@lightmilemedia.com>`,
        to: [to],
        reply_to: senderEmail,
        subject: subject,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #E91E8C 0%, #FF6B9D 100%); border-radius: 16px; padding: 24px 28px; margin-bottom: 28px;">
              <p style="font-size: 14px; color: rgba(255,255,255,0.85); margin: 0 0 4px 0;">A note of appreciation from</p>
              <p style="font-size: 22px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0;">${sanitize(displayName)}</p>
              <p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 0;">${sanitize(senderEmail)}</p>
            </div>
            <p style="font-size: 16px; line-height: 1.7; color: #333; white-space: pre-wrap; margin: 0 0 28px 0;">${sanitize(message)}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="font-size: 12px; color: #aaa; margin: 0; text-align: center;">
              Sent via <strong style="color: #E91E8C;">eos Products</strong> ✨ · Reply directly to ${sanitize(displayName)}
            </p>
          </div>
        `,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend API error:', resendData);
      throw new Error(`Resend API error [${resendRes.status}]: ${JSON.stringify(resendData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
