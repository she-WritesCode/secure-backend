<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCartStore, useProductStore } from "../stores";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "vee-validate";
import { z } from "zod";
import { useToast } from "@/components/ui/toast/use-toast";

const { toast } = useToast();
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const productStore = useProductStore();
const { product, getOneProduct, error, loading } = productStore;

const formSchema = z.object({
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(99, "Quantity cannot exceed 99"),
});

const form = useForm({
  // validationSchema: formSchema,
  initialValues: {
    quantity: 1,
  },
});

onMounted(async () => {
  getOneProduct(route.params.id as string);
});

const addToCart = form.handleSubmit((values) => {
  if (product) {
    for (let i = 0; i < values.quantity; i++) {
      cartStore.addToCart(product);
    }
    toast({
      title: `${values.quantity} items added to cart`,
      description: `${product.name} has been added to cart`,
    });
  }
});
const goToCheckout = () => {
  router.push("/checkout");
};
</script>

<template>
  <main class="container mx-auto py-8 px-4">
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
      ></div>
    </div>

    <div v-else-if="error" class="text-center text-red-600">
      {{ error }}
    </div>

    <div v-else-if="product" class="max-w-4xl mx-auto">
      <Card class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <div class="md:w-1/2 p-0">
          <CardHeader>
            <CardTitle class="text-3xl">{{ product.name }}</CardTitle>
            <CardDescription class="text-2xl font-semibold">
              ${{ product.price.toFixed(2) }}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p class="text-gray-600 mb-6">{{ product.description }}</p>

            <div class="flex items-center gap-4 mb-6">
              <label class="font-medium">Quantity:</label>
              <Input
                type="number"
                :modelValue="form.values.quantity"
                min="1"
                max="99"
                class="w-20"
              />
            </div>
          </CardContent>

          <CardFooter class="flex flex-col gap-4">
            <div class="flex gap-4 w-full">
              <Button @click="addToCart" class="flex-1"> Add to Cart </Button>
              <Button variant="outline" @click="router.push('/')">
                Back to Products
              </Button>
            </div>
            <Button
              v-if="cartStore.items.length"
              @click="goToCheckout"
              class="w-full"
            >
              Checkout
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  </main>
</template>
