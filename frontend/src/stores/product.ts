import { defineStore } from "pinia";
import { computed, ref, shallowRef } from "vue";
import { BACKEND_URL } from "@/lib/constants";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export const useProductStore = defineStore("products", () => {
  const products = shallowRef<Product[]>([]);
  const product = ref<Product | null>(products.value[0]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const totalPages = ref(1);

  const fetchProducts = async (page = 1) => {
    loading.value = true;
    try {
      const response = await fetch(
        `${BACKEND_URL}/products?page=${page}&limit=10`
      );
      const data = await response.json();
      products.value = data.results;
      currentPage.value = data.pagination.page;
      totalPages.value = data.pagination.pages;
    } catch (err) {
      error.value = "Failed to fetch products";
    } finally {
      loading.value = false;
    }
  };

  const getOneProduct = async (id: string): Promise<Product | undefined> => {
    loading.value = true;
    try {
      const response = await fetch(`${BACKEND_URL}/products/${id}`);
      product.value = await response.json();
      return product.value ?? undefined;
    } catch (err) {
      error.value = "Failed to fetch product";
    } finally {
      loading.value = false;
    }
  };

  return {
    product: computed(() => product.value),
    products: computed(() => products.value),
    loading,
    error,
    currentPage,
    totalPages,
    fetchProducts,
    getOneProduct,
  };
});
