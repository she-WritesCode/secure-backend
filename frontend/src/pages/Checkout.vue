<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore, useOrderStore, type ShippingDetails } from "../stores";
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
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const loading = ref(false);

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  addressLine1: z.string().min(5, "Please enter your full address"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state"),
  country: z.string().min(2, "Please enter your country"),
  postalCode: z.string().min(3, "Please enter a valid postal code"),
});

const form = useForm<ShippingDetails>({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {},
});

const onSubmit = form.handleSubmit(async (values) => {
  if (cartStore.items.length === 0) return;

  loading.value = true;
  try {
    const data = await orderStore.createOrder(cartStore.items, values);
    console.log(data);
    if (data.statusCode !== 500) {
      cartStore.clearCart();
      router.push("/");
    }
  } catch (error) {
    console.error("Failed to create order:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="container mx-auto py-8 px-4">
    <Button variant="outline" class="mb-8" @click="router.push('/cart')"
      >Back to Cart</Button
    >
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
                :key="item.product._id"
                class="flex items-center gap-4"
              >
                <div class="">
                  <Button
                    @click="cartStore.removeFromCart(item.product._id)"
                    variant="ghost"
                    class="p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M4 7l16 0" />
                      <path d="M10 11l0 6" />
                      <path d="M14 11l0 6" />
                      <path
                        d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                      />
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  </Button>
                </div>
                <div class="flex-1 flex justify-between items-center">
                  <div>
                    <h3 class="font-medium">{{ item.product.name }}</h3>
                    <p class="text-sm text-gray-500">
                      Quantity: {{ item.quantity }}
                    </p>
                  </div>
                  <p class="font-medium">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </p>
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

      <div class="lg:order-first">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form @submit="onSubmit" class="space-y-4">
              <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="fullName">
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="Enter your full name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="addressLine1">
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="Enter your address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="city">
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="Enter your city"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="state">
                <FormItem>
                  <FormLabel>State </FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="Enter your state"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="country">
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="Enter your country"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="postalCode">
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField"
                      placeholder="Enter your postal code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <Button type="submit" class="w-full" :disabled="loading">
                {{ loading ? "Processing..." : "Place Order" }}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
