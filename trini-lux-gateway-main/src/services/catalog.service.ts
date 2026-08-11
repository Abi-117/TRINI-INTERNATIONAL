import { apiClient } from "./api/client";
import { endpoints } from "./api/endpoints";
import type { Category, Paginated, Product, ProductQuery } from "@/types";

export const catalogService = {
  // Products List
  listProducts: async (query: ProductQuery = {}) => {
    const res = await apiClient.get(endpoints.products.list, {
      params: query,
    });

    return {
      items: res.data.products,
      total: res.data.total,
      page: 1,
      pageSize: res.data.products.length,
      totalPages: 1,
    } as Paginated<Product>;
  },

  // Single Product
  getProduct: async (slug: string) => {
    const res = await apiClient.get(endpoints.products.detail(slug));
    return res.data.product;
  },

  // Related Products
  getRelated: async (slug: string, limit = 4) => {
    const productRes = await apiClient.get(
      endpoints.products.detail(slug)
    );

    const product = productRes.data.product;

    const listRes = await apiClient.get(endpoints.products.list);

    return listRes.data.products
      .filter(
        (p: any) =>
          p.slug !== slug &&
          p.category._id === product.category.name._id
      )
      .slice(0, limit);
  },

  // Search Suggestions
  suggestions: async (term: string, limit = 6) => {
    const res = await apiClient.get(endpoints.products.list);

    return res.data.products
      .filter((p: any) =>
        p.name.toLowerCase().includes(term.toLowerCase())
      )
      .slice(0, limit);
  },

  // Categories
  listCategories: async () => {
    const res = await apiClient.get(endpoints.categories.list);
    return res.data.categories as Category[];
  },

  // Collections
  listCollections: async () => {
    return [];
  },
};