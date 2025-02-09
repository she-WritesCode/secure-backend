import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);

  // Load items from localStorage on store initialization
  const savedItems = localStorage.getItem("cart-items");
  if (savedItems) {
    items.value = JSON.parse(savedItems);
  }

  // Watch for changes and save to localStorage
  watch(
    items,
    (newItems) => {
      localStorage.setItem("cart-items", JSON.stringify(newItems));
    },
    { deep: true }
  );

  const total = computed(() => {
    return items.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  });

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = items.value.find(
      (item) => item.product._id === product._id
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({ product, quantity });
    }
  };

  const removeFromCart = (productId: string) => {
    items.value = items.value.filter((item) => item.product._id !== productId);
  };

  const clearCart = () => {
    items.value = [];
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = items.value.find((item) => item.product._id === productId);
    if (item && newQuantity > 0) {
      item.quantity = newQuantity;
    }
  };

  return { items, total, addToCart, removeFromCart, clearCart, updateQuantity };
});
