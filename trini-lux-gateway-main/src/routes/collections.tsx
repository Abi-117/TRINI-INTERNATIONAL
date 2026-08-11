import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/section";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";


const title = "Featured Collections — TRINI INTERNATIONAL";
const description =
  "RC Racing, Luxury Jewellery, Travel Bags, Gaming Gadgets, Korean Stationery and Premium Toys — curated collections from Trini International.";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const { data, isLoading } = useQuery({
  queryKey: ["categories"],
  queryFn: () => categoryService.getAll(),
});

const categories = data || [];

  return (
    <>
      <PageHeader
        eyebrow="Collections"
        title={<>Six curated <span className="text-gold">worlds</span></>}
        subtitle="Each collection is hand-assembled from our imported catalogue."
        breadcrumb={[{ label: "Collections" }]}
      />
      <section className="container-x grid gap-5 py-14 md:grid-cols-2">
        {categories.map((c: any, i: number) => (
          <Reveal key={c.slug} delay={i}>
            <Link
  to="/shop"
  search={{
    category: c.slug,
  }}
  className="group relative block aspect-16/10 overflow-hidden rounded-[2rem] hairline"
>
  <img
    src={c.image}
    alt={c.name}
    className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-110"
  />

  <div className="absolute inset-0 bg-veil opacity-15" />

  <div className="absolute inset-x-0 bottom-0 p-7">
    <h2 className="font-display text-2xl font-bold">
      {c.name}
    </h2>

    <p className="mt-1 text-sm text-muted-foreground">
      {c.description}
    </p>

    <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
      Shop Now
      <ArrowUpRight className="size-3.5" />
    </span>
  </div>
</Link>
          </Reveal>
        ))}
      </section>
    </>
  );
}
