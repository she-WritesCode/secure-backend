<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

const orders = ref<Order[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);

onMounted(() => {
  fetchOrders();
});

const fetchOrders = async (page = 1) => {
  loading.value = true;
  try {
    const response = await fetch(`/api/orders?page=${page}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    const data = await response.json();
    orders.value = data.results;
    currentPage.value = data.pagination.page;
    totalPages.value = data.pagination.pages;
  } catch (err) {
    error.value = "Failed to fetch orders";
  } finally {
    loading.value = false;
  }
};

const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error("Failed to update order status");

    fetchOrders(currentPage.value);
  } catch (err) {
    console.error("Failed to update order status:", err);
  }
};

const getStatusColor = (status: Order["status"]) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status];
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">Manage Orders</h1>

    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
      ></div>
    </div>

    <div v-else-if="error" class="text-center text-red-600">
      {{ error }}
    </div>

    <div v-else class="space-y-6">
      <Card v-for="order in orders" :key="order.id" class="overflow-hidden">
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">
            Order #{{ order.id }}
          </CardTitle>
          <Badge :class="getStatusColor(order.status)">
            {{ order.status }}
          </Badge>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <p class="text-sm font-medium">Customer Information</p>
              <div class="text-sm">
                <p>{{ order.customer.name }}</p>
                <p>{{ order.customer.email }}</p>
                <p>{{ order.customer.address }}</p>
                <p>
                  {{ order.customer.city }}, {{ order.customer.country }}
                  {{ order.customer.postalCode }}
                </p>
              </div>
            </div>

            <div class="grid gap-2">
              <p class="text-sm font-medium">Order Details</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="item in order.items" :key="item.id">
                    <TableCell>{{ item.name }}</TableCell>
                    <TableCell>{{ item.quantity }}</TableCell>
                    <TableCell>${{ item.price.toFixed(2) }}</TableCell>
                    <TableCell
                      >${{ (item.price * item.quantity).toFixed(2) }}</TableCell
                    >
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan="3" class="text-right font-bold"
                      >Total:</TableCell
                    >
                    <TableCell class="font-bold"
                      >${{ order.total.toFixed(2) }}</TableCell
                    >
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-500">
                Created: {{ formatDate(order.createdAt) }}
              </p>
              <div class="space-x-2">
                <Button
                  v-if="order.status === 'pending'"
                  variant="outline"
                  @click="updateOrderStatus(order.id, 'processing')"
                >
                  Mark as Processing
                </Button>
                <Button
                  v-if="order.status === 'processing'"
                  variant="outline"
                  @click="updateOrderStatus(order.id, 'completed')"
                >
                  Mark as Completed
                </Button>
                <Button
                  v-if="['pending', 'processing'].includes(order.status)"
                  variant="destructive"
                  @click="updateOrderStatus(order.id, 'cancelled')"
                >
                  Cancel Order
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="mt-4 flex justify-center">
        <Button
          v-for="page in totalPages"
          :key="page"
          variant="outline"
          :class="{
            'bg-primary text-primary-foreground': page === currentPage,
          }"
          @click="fetchOrders(page)"
        >
          {{ page }}
        </Button>
      </div>
    </div>
  </div>
</template>
