import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";

import {
  Clock,
  Heart,
  LogOut,
  MapPin,
  Package,
  User,
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/store-provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — TRINI INTERNATIONAL" },
      {
        name: "description",
        content:
          "Manage your Trini International profile, orders, addresses and wishlist.",
      },
      {
        property: "og:title",
        content: "My Account — TRINI INTERNATIONAL",
      },
      {
        property: "og:description",
        content: "Manage your profile, orders and addresses.",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),

  component: AccountLayout,
});

const links = [
  {
    to: "/account",
    label: "Profile",
    icon: User,
  },
  {
    to: "/account/orders",
    label: "Orders",
    icon: Package,
  },
  {
    to: "/account/addresses",
    label: "Address Book",
    icon: MapPin,
  },
  {
    to: "/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
] as const;

function AccountLayout() {
  const {
    user,
    signOut,
    recentlyViewed,
  } = useStore();

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title={
          user
            ? `Hello, ${user.name}`
            : "My Account"
        }
        subtitle={
          user?.email ??
          "Sign in to track orders and manage addresses."
        }
        breadcrumb={[
          {
            label: "Account",
          },
        ]}
      />

      <section className="container-x grid gap-8 py-14 lg:grid-cols-[260px_1fr]">

        {/* SIDEBAR */}
        <aside className="h-fit space-y-1 rounded-3xl glass p-4">

          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",

                pathname === l.to
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <l.icon className="size-4" />

              {l.label}
            </Link>
          ))}

          {/* SIGN OUT */}
          {user ? (
            <Button
              variant="ghost"
              className="w-full justify-start px-4"
              onClick={signOut}
            >
              <LogOut className="size-4" />

              Sign out
            </Button>
          ) : (
            <Button
              variant="hero"
              className="mt-2 w-full"
              asChild
            >
              <Link to="/auth/login">
                Sign in
              </Link>
            </Button>
          )}

        </aside>

        {/* CONTENT */}
        <div className="space-y-6">

          {pathname === "/account" ? (
            <>
              {/* PROFILE */}
              <div className="rounded-3xl glass p-7">

                <h2 className="text-lg font-bold">
                  Profile
                </h2>

                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">

                  <Info
                    label="Name"
                    value={
                      user?.name ?? "Guest"
                    }
                  />

                  <Info
                    label="Email"
                    value={
                      user?.email ?? "—"
                    }
                  />

                  <Info
                    label="Phone"
                    value={
                      user?.phone ?? "—"
                    }
                  />

                  <Info
                    label="Member since"
                    value={
                      user?.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "—"
                    }
                  />

                </dl>
              </div>

              {/* RECENTLY VIEWED */}
              <div className="rounded-3xl glass p-7">
  <h2 className="flex items-center gap-2 text-lg font-bold">
    <Clock className="size-4 text-primary" />
    Recently viewed
  </h2>

  {recentlyViewed.length > 0 ? (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {recentlyViewed.slice(0, 4).map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="rounded-2xl border border-border p-4"
        >
          <p className="text-sm font-medium capitalize">
            {item.replace(/-/g, " ")}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-3 text-sm text-muted-foreground">
      You haven't viewed any products yet.
    </p>
  )}
</div>
            </>
          ) : (
            <Outlet />
          )}

        </div>

      </section>
    </>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border p-4">

      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>

      <dd className="mt-1 font-medium">
        {value}
      </dd>

    </div>
  );
}