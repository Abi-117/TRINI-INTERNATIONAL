import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute(
  "/auth/forgot-password"
)({
  head: () => ({
    meta: [
      {
        title: "Reset Password — TRINI INTERNATIONAL",
      },
      {
        name: "description",
        content:
          "Reset the password for your Trini International account.",
      },
      {
        property: "og:title",
        content:
          "Reset Password — TRINI INTERNATIONAL",
      },
      {
        property: "og:description",
        content:
          "Reset your account password.",
      },
    ],
  }),

  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [step, setStep] = useState<
    "email" | "otp" | "password" | "success"
  >("email");

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     SEND OTP
  ========================================= */

  const sendOTP = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res =
        await authService.forgotPassword(
          email
        );

      toast.success(res.message);

      setStep("otp");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     VERIFY OTP
  ========================================= */

  const verifyOTP = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res =
        await authService.verifyOTP(
          email,
          otp
        );

      toast.success(res.message);

      setStep("password");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     RESET PASSWORD
  ========================================= */

  const resetPassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      const res =
        await authService.resetPassword(
          email,
          otp,
          password
        );

      toast.success(res.message);

      setStep("success");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={
        step === "email"
          ? "Forgot password"
          : step === "otp"
          ? "Verify OTP"
          : step === "password"
          ? "Create new password"
          : "Password reset"
      }
      subtitle={
        step === "email"
          ? "Enter your email to receive an OTP."
          : step === "otp"
          ? `Enter the OTP sent to ${email}`
          : step === "password"
          ? "Create a new password for your account."
          : "Your password has been reset successfully."
      }
      footer={
        <Link
          to="/auth/login"
          className="font-semibold text-primary"
        >
          Back to sign in
        </Link>
      }
    >
      {/* =====================================
          EMAIL
      ===================================== */}

      {step === "email" && (
        <form
          onSubmit={sendOTP}
          className="space-y-4"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Email"
            className="h-12 rounded-2xl border-border bg-surface/60"
            required
          />

          <Button
            variant="hero"
            size="lg"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send OTP"}
          </Button>
        </form>
      )}

      {/* =====================================
          OTP
      ===================================== */}

      {step === "otp" && (
        <form
          onSubmit={verifyOTP}
          className="space-y-4"
        >
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            placeholder="Enter 6 digit OTP"
            className="h-12 rounded-2xl border-border bg-surface/60 text-center text-lg tracking-[0.4em]"
            required
          />

          <Button
            variant="hero"
            size="lg"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </Button>

          <button
            type="button"
            onClick={() => setStep("email")}
            className="w-full text-sm font-semibold text-primary"
          >
            Change email
          </button>
        </form>
      )}

      {/* =====================================
          NEW PASSWORD
      ===================================== */}

      {step === "password" && (
        <form
          onSubmit={resetPassword}
          className="space-y-4"
        >
          <Input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="New password"
            className="h-12 rounded-2xl border-border bg-surface/60"
            required
          />

          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            placeholder="Confirm new password"
            className="h-12 rounded-2xl border-border bg-surface/60"
            required
          />

          <Button
            variant="hero"
            size="lg"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </Button>
        </form>
      )}

      {/* =====================================
          SUCCESS
      ===================================== */}

      {step === "success" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border p-5 text-center">
            <p className="text-sm text-muted-foreground">
              Your password has been reset
              successfully.
            </p>
          </div>

          <Link to="/auth/login">
            <Button
              variant="hero"
              size="lg"
              className="w-full"
            >
              Go to Sign In
            </Button>
          </Link>
        </div>
      )}
    </AuthShell>
  );
}