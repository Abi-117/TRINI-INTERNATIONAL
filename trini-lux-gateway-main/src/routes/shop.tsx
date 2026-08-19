import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { ProductCard } from "@/components/product/product-card";
import { productService } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { categoryService } from "@/services/category.service";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/types";
import type { Category } from "@/types";

const title = "Shop All Products — TRINI INTERNATIONAL";
const description =
  "Filter premium imported RC cars, gel blasters, die cast, soft toys, jewellery, bags, gadgets and Korean stationery by category, brand, price, rating and age.";

interface ShopSearch {
  q?: string;
  category?: string;
  page?: number;
}


export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    page: search.page ? Number(search.page) : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

const MAX_PRICE = 30000;

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data: categories = [] } = useQuery({
  queryKey: ["categories"],
  queryFn: categoryService.getAll,
});

  const [term, setTerm] = useState(search.q ?? "");
  const [selectedCats, setSelectedCats] = useState<string[]>(search.category ? [search.category] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, MAX_PRICE]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("relevance");
  const [view, setView] = useState<"grid" | "list">("grid");

  const page = search.page ?? 1;

  const query = useMemo(() => ({
  search: term,
  categories: selectedCats.join(","),
  brands: selectedBrands.join(","),
  ageGroups: selectedAges.join(","),
  minPrice: price[0],
  maxPrice: price[1],
  minRating,
  inStockOnly,
  sort,
  page,
  pageSize: 9,
}), [
  term,
  selectedCats,
  selectedBrands,
  selectedAges,
  price,
  minRating,
  inStockOnly,
  sort,
  page,
]);

  const { data, isLoading } = useQuery({
    queryKey: ["products", query],
    queryFn: () => productService.listProducts(query),
  });
const brands = [
  ...new Set(
    (data?.items ?? [])
      .map((p: any) => p.brand)
      .filter(Boolean)
  ),
];

const ageGroups = [
  ...new Set(
    (data?.items ?? [])
      .map((p: any) => p.ageGroup)
      .filter(Boolean)
  ),
];
  const setPage = (p: number) => navigate({ to: ".", search: { ...search, page: p } });

  const toggle = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    setPage(1);
  };

  const clearAll = () => {
    setTerm("");
    setSelectedCats([]);
    setSelectedBrands([]);
    setSelectedAges([]);
    setPrice([0, MAX_PRICE]);
    setMinRating(0);
    setInStockOnly(false);
    navigate({ to: ".", search: {} });
  };

  const activeCount =
    selectedCats.length + selectedBrands.length + selectedAges.length + (minRating ? 1 : 0) + (inStockOnly ? 1 : 0);

  const Filters = (
    <div className="space-y-8">
      <FilterBlock title="Category">
        {categories.map((c) => (
          <CheckRow
            key={c.slug}
            label={`${c.name}`}
            hint={`${c.productCount}`}
            checked={selectedCats.includes(c.slug)}
            onChange={() => toggle(selectedCats, c.slug, setSelectedCats)}
          />
        ))}
      </FilterBlock>

      <FilterBlock title="Brand">
        {brands.map((b) => (
          <CheckRow
            key={b}
            label={b}
            checked={selectedBrands.includes(b)}
            onChange={() => toggle(selectedBrands, b, setSelectedBrands)}
          />
        ))}
      </FilterBlock>

      <FilterBlock title="Price range">
        <Slider
          value={price}
          min={0}
          max={MAX_PRICE}
          step={500}
          onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
          className="mt-3"
        />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{inr(price[0])}</span>
          <span>{inr(price[1])}</span>
        </div>
      </FilterBlock>

      {/* <FilterBlock title="Age group">
        <div className="flex flex-wrap gap-2">
          {ageGroups.map((a) => (
            <button
              key={a}
              onClick={() => toggle(selectedAges, a, setSelectedAges)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                selectedAges.includes(a)
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </FilterBlock> */}

      <FilterBlock title="Rating">
        <div className="flex flex-wrap gap-2">
          {[4.5, 4, 3.5, 0].map((r) => (
            <button
              key={r}
              onClick={() => {
                setMinRating(r);
                setPage(1);
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                minRating === r
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              {r === 0 ? "All" : `${r}★ & up`}
            </button>
          ))}
        </div>
      </FilterBlock>

      <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
        <span className="text-sm font-medium">In stock only</span>
        <Switch checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(Boolean(v))} />
      </div>

      <Button variant="outline" className="w-full" onClick={clearAll}>
        <X className="size-4" /> Clear filters
      </Button>
    </div>
  );

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title={
          <>
            Everything premium, <span className="text-gold">in one place</span>
          </>
        }
        subtitle="Filter by category, brand, price, rating and age group to find your next favourite."
        breadcrumb={[{ label: "Shop" }]}
      />

      <section className="container-x grid gap-10 py-12 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto rounded-3xl glass p-6">
            {Filters}
          </div>
        </aside>

        <div>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products…"
                className="h-11 rounded-full border-border bg-surface/60 pl-11"
              />
            </div>

            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="h-11 w-48 rounded-full border-border bg-surface/60">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most popular</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="discount">Biggest discount</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex rounded-full border border-border p-1">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={cn("rounded-full p-2", view === "grid" ? "bg-secondary text-primary" : "text-muted-foreground")}
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={cn("rounded-full p-2", view === "list" ? "bg-secondary text-primary" : "text-muted-foreground")}
              >
                <List className="size-4" />
              </button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="glass" className="lg:hidden">
                  <SlidersHorizontal className="size-4" /> Filters {activeCount > 0 && `(${activeCount})`}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto border-border bg-surface p-6 pt-14">
                {Filters}
              </SheetContent>
            </Sheet>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">
            {isLoading ? "Loading products…" : `${data?.total ?? 0} products found`}
          </p>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-3xl" />
              ))}
            </div>
          ) : data && data.items.length > 0 ? (
            <div
              className={cn(
                view === "grid" ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-5",
              )}
            >
              {data.items.map((p, i) => (
                <ProductCard
    key={p._id}
    product={p}
    index={i}
    view={view}
/>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl glass p-16 text-center">
              <p className="text-lg font-semibold">No products match those filters</p>
              <p className="mt-2 text-sm text-muted-foreground">Try widening your price range or clearing filters.</p>
              <Button variant="hero" className="mt-6" onClick={clearAll}>
                Reset filters
              </Button>
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={data.page === 1} onClick={() => setPage(data.page - 1)}>
                Previous
              </Button>
              {Array.from({ length: data.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "size-9 rounded-full text-sm font-semibold transition-colors",
                    data.page === i + 1
                      ? "bg-gradient-gold text-primary-foreground"
                      : "border border-border text-muted-foreground hover:border-primary/50",
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={data.page === data.totalPages}
                onClick={() => setPage(data.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span className="flex-1">{label}</span>
      {hint && <span className="text-xs opacity-60">{hint}</span>}
    </label>
  );
}
