import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authService } from "@/services/auth.service";
import { useStore } from "@/store/store-provider";

export const Route = createFileRoute("/auth/otp")({
  head: () => ({
    meta: [
      { title: "OTP Verification — TRINI INTERNATIONAL" },
      { name: "description", content: "Verify your phone number with a one-time password." },
      { property: "og:title", content: "OTP Verification — TRINI INTERNATIONAL" },
      { property: "og:description", content: "Verify your phone with a one-time password." },
    ],
  }),
  component: OtpPage,
});

function OtpPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const { signIn } = useStore();
  const navigate = useNavigate();

  const send = async () => {
    if (phone.length < 10) return toast.error("Enter a valid phone number");
    const res = await authService.sendOtp(phone);
    setStage("otp");
    toast.success(res.message);
  };

  const verify = async () => {
    if (otp.length < 6) return toast.error("Enter the 6-digit code");
    const session = await authService.verifyOtp({ phone, otp });
    signIn(session.user, session.token);
    toast.success("Verified");
    navigate({ to: "/account" });
  };

  return (
    <AuthShell
      title={stage === "phone" ? "Sign in with OTP" : "Enter your code"}
      subtitle={stage === "phone" ? "We'll text you a 6-digit verification code." : `Sent to ${phone}`}
      footer={
        <Link to="/auth/login" className="font-semibold text-primary">
          Use password instead
        </Link>
      }
    >
      {stage === "phone" ? (
        <>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 90000 00000"
            className="h-12 rounded-2xl border-border bg-surface/60"
          />
          <Button variant="hero" size="lg" className="w-full" onClick={send}>
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="size-12 border-border text-lg" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button variant="hero" size="lg" className="w-full" onClick={verify}>
            Verify &amp; continue
          </Button>
          <button onClick={send} className="w-full text-xs text-muted-foreground hover:text-primary">
            Resend code
          </button>
        </>
      )}
    </AuthShell>
  );
}
