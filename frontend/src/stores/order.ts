import { defineStore } from "pinia";
import { ref } from "vue";
import type { CartItem } from ".";

export interface Order {
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
      const data = await response?.json();
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
