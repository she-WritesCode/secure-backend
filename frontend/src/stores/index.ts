import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: Date;
}

export interface CheckoutDetails {
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
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

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);

  const total = computed(() => {
    return items.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  });

  const addToCart = (product: Product) => {
    const existingItem = items.value.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  };

  const removeFromCart = (productId: string) => {
    items.value = items.value.filter((item) => item.id !== productId);
  };

  const clearCart = () => {
    items.value = [];
  };

  return { items, total, addToCart, removeFromCart, clearCart };
});

export const useOrderStore = defineStore("orders", () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchOrders = async () => {
    loading.value = true;
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      orders.value = data.results;
    } catch (err) {
      error.value = "Failed to fetch orders";
    } finally {
      loading.value = false;
    }
  };

  const createOrder = async (
    items: CartItem[],
    formValues: CheckoutDetails
  ) => {
    loading.value = true;
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, ...formValues }),
      });
      const data = await response.json();
      orders.value.unshift(data);
      return data;
    } catch (err) {
      error.value = "Failed to create order";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { orders, loading, error, fetchOrders, createOrder };
});
