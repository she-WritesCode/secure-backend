import { defineStore } from "pinia";
import { ref } from "vue";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const useProductStore = defineStore("products", () => {
  const products = ref<Product[]>([
    {
      id: "1",
      name: "Product 1",
      description: "test",
      price: 50,
      image: "https://picsum.photos/600/300",
    },
    {
      id: "2",
      name: "Product 2",
      description: "test 1",
      price: 150,
      image: "https://picsum.photos/seed/600/300",
    },
  ]);
  const product = ref<Product | null>(products.value[0]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const totalPages = ref(1);

  const fetchProducts = async (page = 1) => {
    loading.value = true;
    try {
      const response = await fetch(`/api/products?page=${page}`);
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
  const getOneProduct = async (id: string) => {
    loading.value = true;
    try {
      const response = await fetch(`/api/products/${id}`);
      product.value = await response.json();
    } catch (err) {
      error.value = "Failed to fetch product";
    } finally {
      loading.value = false;
    }
  };

  return {
    product,
    products,
    loading,
    error,
    currentPage,
    totalPages,
    fetchProducts,
    getOneProduct,
  };
});
