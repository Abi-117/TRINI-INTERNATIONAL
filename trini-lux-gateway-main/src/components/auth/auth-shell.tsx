import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import logo from "@/assets/logo.png";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 py-20">
      <div className="absolute -left-40 top-0 size-[30rem] rounded-full bg-cyan/15 blur-[140px]" />
      <div className="absolute -right-40 bottom-0 size-[30rem] rounded-full bg-magenta/15 blur-[140px]" />
      <div className="relative w-full max-w-md rounded-[2rem] glass p-9 shadow-soft">
        <Link to="/" className="mb-7 flex items-center gap-3">
          <img src={logo} alt="TRINI INTERNATIONAL" width={44} height={44} className="size-11 rounded-xl object-cover" />
          <span className="font-display text-sm font-bold tracking-[0.08em] text-gradient-gold">
            TRINI INTERNATIONAL
          </span>
        </Link>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-7 space-y-4">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </section>
  );
}
