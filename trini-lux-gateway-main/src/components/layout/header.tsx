import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";

import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchDialog } from "@/components/layout/search-dialog";
import { useStore } from "@/store/store-provider";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Contact", to: "/contact" },
] as const;

const ticker = [
  "Delivery Across India",
  "Same Day Dispatch",
  "100% Genuine Imported Products",
  "Secure Online Payments",
  "Fast Customer Support",
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, wishlist, user, hydrated } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <div className="relative overflow-hidden border-b border-border bg-gradient-brand/10">
        <div className="flex w-max animate-marquee gap-10 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90">
          {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => (
            <span key={i} className="whitespace-nowrap">
              ✦ {t}
            </span>
          ))}
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          scrolled ? "glass-strong shadow-soft" : "bg-transparent",
        )}
      >
        <div className="container-x flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="TRINI INTERNATIONAL logo"
              width={48}
              height={48}
              className="size-16 object-cover"
            />
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-lg font-bold tracking-[0.08em] text-gold">
                TRINI INTERNATIONAL
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                Premium Lifestyle Store
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-secondary/70 data-[status=active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Wishlist" asChild>
              <Link to="/wishlist" className="relative">
                <Heart className="size-5" />
                {hydrated && wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Account" asChild>
              <Link to={user ? "/account" : "/auth/login"}>
                <User className="size-5" />
              </Link>
            </Button>
            <Button variant="hero" size="sm" className="hidden sm:inline-flex" asChild>
              <Link to="/cart" className="relative">
                <ShoppingBag className="size-4" />
                Bag {hydrated && cartCount > 0 ? `(${cartCount})` : ""}
              </Link>
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                  {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-border bg-surface p-0">
                <div className="flex flex-col gap-1 p-6 pt-14">
                  {nav.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="rounded-2xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    to="/account"
                    className="rounded-2xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-primary"
                  >
                    My Account
                  </Link>
                  <Button variant="hero" className="mt-4" asChild>
                    <Link to="/cart">View Bag</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AnimatePresence>{searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}</AnimatePresence>
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground"
    >
      {children}
    </motion.span>
  );
}
