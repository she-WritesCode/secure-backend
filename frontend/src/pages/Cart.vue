<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCartStore } from "../stores";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const router = useRouter();
const cartStore = useCartStore();

const updateQuantity = (itemId: string, newQuantity: number) => {
  if (newQuantity < 1) return;
  cartStore.updateQuantity(itemId, newQuantity);
};

const removeItem = (itemId: string) => {
  cartStore.removeFromCart(itemId);
};

const continueShopping = () => {
  router.push("/");
};

const goToCheckout = () => {
  router.push("/checkout");
};
</script>

<template>
  <main class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-8">
      <p class="text-gray-600 mb-4">Your cart is empty</p>
      <Button @click="continueShopping">Continue Shopping</Button>
    </div>

    <div v-else>
      <Card>
        <CardHeader>
          <CardTitle>Cart Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item._id"
              class="flex items-center justify-between py-4 border-b last:border-0"
            >
              <div class="flex items-center space-x-4">
                <img
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 class="font-medium">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">
                    ${{ item.price.toFixed(2) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    @click="updateQuantity(item._id, item.quantity - 1)"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    :value="item.quantity"
                    class="w-16 text-center"
                    min="1"
                    @change="
                      (e) => updateQuantity(item._id, parseInt(e.target.value))
                    "
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    @click="updateQuantity(item._id, item.quantity + 1)"
                  >
                    +
                  </Button>
                </div>
                <div class="text-right">
                  <p class="font-medium">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    @click="removeItem(item._id)"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex flex-col space-y-4">
          <div
            class="flex justify-between items-center w-full text-lg font-bold"
          >
            <span>Total</span>
            <span>${{ cartStore.total.toFixed(2) }}</span>
          </div>
          <div class="flex space-x-4 w-full">
            <Button variant="outline" class="flex-1" @click="continueShopping">
              Continue Shopping
            </Button>
            <Button class="flex-1" @click="goToCheckout"
              >Proceed to Checkout</Button
            >
          </div>
        </CardFooter>
      </Card>
    </div>
  </main>
</template>
