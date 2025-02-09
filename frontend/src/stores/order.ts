import { defineStore } from "pinia";
import { ref } from "vue";
import type { CartItem } from ".";
import { BACKEND_URL } from "@/lib/constants";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: Date;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phoneNumber?: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  deliveryInstructions?: string;
}

export interface CheckoutDetails {
  items: {
    product: string;
    quantity: number;
  }[];
  shippingAddress: ShippingDetails;
  notes?: string;
}
export const useOrderStore = defineStore("orders", () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchOrders = async () => {
    loading.value = true;
    try {
      const response = await fetch(`${BACKEND_URL}/orders`);
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
    formValues: ShippingDetails
  ) => {
    loading.value = true;
    try {
      const payload: CheckoutDetails = {
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
        })),
        shippingAddress: formValues,
      };
      const response = await fetch(`${BACKEND_URL}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response?.json();
      fetchOrders();
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
