<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore, useOrderStore, type CheckoutDetails } from "../stores";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "vee-validate";
import { z } from "zod";

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const loading = ref(false);

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Please enter your full address"),
  city: z.string().min(2, "Please enter your city"),
  country: z.string().min(2, "Please enter your country"),
  postalCode: z.string().min(3, "Please enter a valid postal code"),
});

const form = useForm<CheckoutDetails>({
  // validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  if (cartStore.items.length === 0) return;

  loading.value = true;
  try {
    await orderStore.createOrder(cartStore.items, values);
    cartStore.clearCart();
    router.push("/");
  } catch (error) {
    console.error("Failed to create order:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">Checkout</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-8">
      <p class="text-gray-600 mb-4">Your cart is empty</p>
      <Button @click="router.push('/')">Continue Shopping</Button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="flex justify-between items-center"
              >
                <div>
                  <h3 class="font-medium">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">
                    Quantity: {{ item.quantity }}
                  </p>
                </div>
                <div>
                  <p class="font-medium">
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </p>
                  <Button
                    @click="cartStore.removeFromCart(item.id)"
                    variant="secondary"
                    >x</Button
                  >
                </div>
              </div>
              <div class="border-t pt-4 mt-4">
                <div class="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>${{ cartStore.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form @submit="onSubmit" class="space-y-4">
              <FormField name="email">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="name">
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="address">
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="city">
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your city" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="country">
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your country" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="postalCode">
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your postal code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <Button type="submit" class="w-full" :disabled="loading">
                {{ loading ? "Processing..." : "Place Order" }}
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
