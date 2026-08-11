import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Search, TrendingUp, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { popularSearches, products } from "@/data/catalog";
import { inr } from "@/lib/format";

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const suggestions = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => `${p.title} ${p.brand} ${p.category}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [term]);

  const trending = products.filter((p) => p.tags.includes("trending")).slice(0, 4);

  const submit = (value: string) => {
    onClose();
    navigate({ to: "/shop", search: { q: value } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/85 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -24, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="container-x pt-24"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl glass-strong shadow-soft">
          <form
            className="flex items-center gap-3 border-b border-border px-5 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (term.trim()) submit(term.trim());
            }}
          >
            <Search className="size-5 text-primary" />
            <Input
              autoFocus
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search RC cars, drones, jewellery, gadgets…"
              className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
            />
            <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close search">
              <X className="size-5" />
            </Button>
          </form>

          <div className="max-h-[60vh] overflow-y-auto p-5">
            {suggestions.length > 0 ? (
              <ul className="space-y-1">
                {suggestions.map((p) => (
                  <li key={p._id}>
                    <Link
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      onClick={onClose}
                      className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-secondary/60"
                    >
                      <img src={p.images[0]} alt={p.title} loading="lazy" className="size-14 rounded-xl object-cover" />
                      <span className="flex-1">
                        <span className="block text-sm font-medium">{p.title}</span>
                        <span className="text-xs text-muted-foreground">{p.category}</span>
                      </span>
                      <span className="text-sm font-semibold text-primary">{inr(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-7">
                <div>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Popular searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => submit(s)}
                        className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    <TrendingUp className="size-3.5 text-accent" /> Trending products
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {trending.map((p) => (
                      <Link
                        key={p._id}
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-2xl border border-border p-3 transition-colors hover:border-primary/50"
                      >
                        <img src={p.images[0]} alt={p.title} loading="lazy" className="size-12 rounded-lg object-cover" />
                        <span className="line-clamp-2 text-xs font-medium">{p.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
