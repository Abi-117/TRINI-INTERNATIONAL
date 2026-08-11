import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupCustomer } from "@/services/customer.service";
import { useStore } from "@/store/store-provider";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — TRINI INTERNATIONAL" },
      { name: "description", content: "Create a Trini International account for faster checkout and member-only offers." },
      { property: "og:title", content: "Create Account — TRINI INTERNATIONAL" },
      { property: "og:description", content: "Create an account for faster checkout and member offers." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { signIn } = useStore();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.name || !form.email || form.password.length < 6)
    return toast.error("Fill all required fields");

  setLoading(true);

  try {
    const res = await signupCustomer(form);
    localStorage.setItem("customerToken", res.token);

    signIn(res.user, res.token);

    toast.success("Account Created");

    navigate({
      to: "/account",
    });

  } catch (err: any) {

    toast.error(err.message);

  } finally {
    setLoading(false);
  }
};
  

  return (
    <AuthShell
      title="Create your account"
      subtitle="Faster checkout, order tracking and insider drops."
      footer={
        <>
          Already a member?{" "}
          <Link to="/auth/login" className="font-semibold text-primary">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {(
          [
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
            ["password", "Password", "password"],
          ] as const
        ).map(([key, label, type]) => (
          <Input
            key={key}
            type={type}
            placeholder={label}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="h-12 rounded-2xl border-border bg-surface/60"
          />
        ))}
        <Button variant="hero" size="lg" type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
