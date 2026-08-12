import { Link } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

import logo from "@/assets/logo.png";
import { categories } from "@/data/catalog";

const quickLinks = [
  { label: "Shop All", to: "/shop" },
  { label: "Collections", to: "/collections" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "My Orders", to: "/account/orders" },
  { label: "Contact Us", to: "/contact" },
] as const;

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/trini_international/",
    icon: Instagram,
  },
 
  {
    label: "YouTube",
    href: "https://www.youtube.com/@trinisourcing",
    icon: Youtube,
  },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border bg-surface/60">
      {/* Top Gradient Line */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-brand" />

      {/* ==================================================
          MAIN FOOTER
      ================================================== */}
      <div className="container-x py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-16">

          {/* ==================================================
              BRAND / CONTACT
          ================================================== */}
          <div className="max-w-md">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <img
                src={logo}
                alt="TRINI INTERNATIONAL"
                width={48}
                height={48}
                loading="lazy"
                className="size-12 rounded-xl object-cover"
              />

              <div>
                <span className="block font-display text-base font-bold tracking-[0.08em] text-gold">
                  TRINI INTERNATIONAL
                </span>

                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Premium Lifestyle Store
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              Imported toys, RC &amp; drift cars, drones, gel blasters,
              licensed die cast, soft toys, Korean stationery, fashion
              jewellery, bags and gadgets — curated for ages 3 to adults.
            </p>

            {/* Contact Information */}
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">

              {/* Address */}
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                <span className="leading-6">
                  No. 5/1 A, Aruna Nagar,
                  <br />
                  Opposite BurgerMan, Puthur,
                  <br />
                  Tiruchirappalli, Tamil Nadu 620021
                </span>
              </li>

              {/* Phone */}
              <li>
                <a
                  href="tel:+919363328177"
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  <span>+91 93633 28177</span>
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:Trinisourcing786@gmail.com"
                  className="flex items-center gap-3 break-all transition-colors hover:text-primary"
                >
                  <Mail className="size-4 shrink-0 text-primary" />
                  <span>Trinisourcing786@gmail.com</span>
                </a>
              </li>

            </ul>

            {/* Social Icons */}
            <div className="mt-7 flex gap-3">
              {socialLinks.map(
                ({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="
                      grid size-10 place-items-center
                      rounded-full
                      border border-border
                      bg-background/30
                      text-muted-foreground
                      transition-all duration-200
                      hover:-translate-y-1
                      hover:border-primary/60
                      hover:bg-primary/10
                      hover:text-primary
                    "
                  >
                    <Icon className="size-4" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* ==================================================
              CATEGORIES
          ================================================== */}
          <FooterColumn title="Categories">
            {categories.slice(0, 7).map((category) => (
              <li key={category.slug}>
                <Link
                  to="/shop"
                  search={{ category: category.slug }}
                  className="transition-colors hover:text-primary"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </FooterColumn>

          {/* ==================================================
              QUICK LINKS
          ================================================== */}
          <FooterColumn title="Quick Links">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

        </div>
      </div>

      {/* ==================================================
          MAP
      ================================================== */}
      <div className="container-x pb-12">
        <div className="overflow-hidden rounded-2xl border border-border">
          <iframe
            title="Trini International — Trichy Puthur store location"
            src="https://www.google.com/maps?q=Puthur,Tiruchirappalli,Tamil%20Nadu&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-64 w-full grayscale-[20%] sm:h-72"
          />
        </div>
      </div>

      {/* ==================================================
          BOTTOM BAR
      ================================================== */}
      <div className="border-t border-border">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} Trini International.
            All rights reserved.
          </p>

          <p>
            Secure payments powered by Razorpay · UPI · Cards · Netbanking
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ==================================================
   FOOTER COLUMN
================================================== */

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
        {title}
      </h3>

      <ul className="space-y-3 text-sm text-muted-foreground">
        {children}
      </ul>
    </div>
  );
}