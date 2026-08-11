import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginCustomer } from "@/services/customer.service";
import { useStore } from "@/store/store-provider";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Sign In — TRINI INTERNATIONAL" },
      { name: "description", content: "Sign in to your Trini International account to track orders and save favourites." },
      { property: "og:title", content: "Sign In — TRINI INTERNATIONAL" },
      { property: "og:description", content: "Sign in to track orders and save favourites." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useStore();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginCustomer({
  email,
  password,
});

signIn(res.user, res.token);

localStorage.setItem("customerToken", res.token);
      toast.success(`Welcome back, ${res.user.name}`);
      navigate({ to: "/account" });
    } catch (err: any) {
        toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your premium shopping."
      footer={
        <>
          New here?{" "}
          <Link to="/auth/signup" className="font-semibold text-primary">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="h-12 rounded-2xl border-border bg-surface/60" />
        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="h-12 rounded-2xl border-border bg-surface/60" />
        <div className="flex justify-between text-xs">
          {/* <Link to="/auth/otp" className="text-muted-foreground hover:text-primary">
            Sign in with OTP
          </Link> */}
          <Link to="/auth/forgot-password" className="text-muted-foreground hover:text-primary">
            Forgot password?
          </Link>
        </div>
        <Button variant="hero" size="lg" type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
