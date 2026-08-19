import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/home/hero";
import { FeaturedProducts } from "@/components/home/featured-products";
import {
  CategoriesSection,
  CollectionsSection,
  // InstagramSection,
  // NewsletterSection,
  TestimonialsSection,
  WhyChooseUs,
} from "@/components/home/sections";

const title = "TRINI INTERNATIONAL — Premium Imported Toys, RC Cars & Lifestyle";
const description =
  "Shop imported RC & drift cars, gel blasters, licensed die cast, soft toys, Korean stationery, jewellery, bags and gadgets. Same day dispatch from Trichy.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <CollectionsSection />
      <TestimonialsSection />
      {/* <InstagramSection /> */}
      {/* <NewsletterSection /> */}
    </>
  );
}
