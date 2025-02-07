<script setup lang="ts">
import { onMounted } from "vue";
import { useProductStore } from "../stores";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination/";

const productStore = useProductStore();
const { products, loading, currentPage, totalPages } = productStore;

onMounted(() => {
  productStore.fetchProducts();
});

const handlePageChange = (page: number) => {
  productStore.fetchProducts(page);
};
</script>

<template>
  <main class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">Products</h1>

    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
      ></div>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <Card v-for="product in products" :key="product.id" class="flex flex-col">
        <CardHeader class="p-0">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-48 object-cover rounded-t-lg"
          />
          <CardTitle class="mt-4 px-6">{{ product.name }}</CardTitle>
          <CardDescription class="px-6"
            >${{ product.price.toFixed(2) }}</CardDescription
          >
        </CardHeader>

        <CardContent class="flex-grow">
          <p class="text-gray-600">{{ product.description }}</p>
        </CardContent>

        <CardFooter class="flex justify-between">
          <Button
            variant="outline"
            @click="$router.push(`/product/${product.id}`)"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </div>

    <div class="mt-8 flex justify-center">
      <Pagination
        v-if="totalPages > 1"
        :total-pages="totalPages"
        :current-page="currentPage"
        @page-change="handlePageChange"
      />
    </div>
  </main>
</template>
