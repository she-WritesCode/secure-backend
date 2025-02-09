<script setup lang="ts">
import { onMounted } from "vue";
import { useProductStore } from "../stores";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";

const { products, loading, currentPage, totalPages, fetchProducts } =
  useProductStore();

onMounted(async () => {
  await fetchProducts();
});

const handlePageChange = async (page: number) => {
  await fetchProducts(page);
};
</script>

<template>
  <main class="container mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">Products</h1>

    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      Loading...
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
      ></div>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <Card
        v-for="product in products"
        :key="product._id"
        class="flex flex-row"
      >
        <CardHeader class="p-0 w-1/3">
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-full object-cover rounded-t-lg"
            @click="$router.push(`/product/${product._id}`)"
          />
        </CardHeader>
        <CardContent class="w-2/3">
          <CardTitle
            class="mt-4 text-2xl"
            @click="$router.push(`/product/${product._id}`)"
            >{{ product.name }}</CardTitle
          >
          <CardDescription
            class="text-lg text-indigo-600"
            @click="$router.push(`/product/${product._id}`)"
            >${{ product.price.toFixed(2) }}</CardDescription
          >
          <p class="text-gray-600">{{ product.description }}</p>
        </CardContent>
      </Card>
    </div>

    <div class="mt-8 flex justify-center">
      <Pagination
        v-if="totalPages > 1"
        :itemsPerPage="10"
        :total-pages="totalPages"
        v-slot="{ page }"
        :total="20"
        :default-page="1"
        :show-edges="false"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst @click="handlePageChange(1)" />
          <PaginationPrev
            @click="handlePageChange(Math.max(1, currentPage - 1))"
          />

          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                @click="handlePageChange(item.value)"
                class="w-9 h-9 p-0"
                :variant="item.value === page ? 'default' : 'outline'"
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext
            @click="handlePageChange(Math.min(totalPages, currentPage + 1))"
          />
          <PaginationLast @click="handlePageChange(totalPages)" />
        </PaginationList>
      </Pagination>
    </div>
  </main>
</template>
