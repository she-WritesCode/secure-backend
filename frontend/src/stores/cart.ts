import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { Product } from "./product";

export interface CartItem extends Product {
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
