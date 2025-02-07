<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showDialog = ref(false);
const editingProduct = ref<Product | null>(null);
const currentPage = ref(1);
const totalPages = ref(1);

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be greater than 0"),
  image: z.string().url("Please enter a valid image URL"),
});

const form = useForm({
  validationSchema: formSchema,
});

onMounted(() => {
  fetchProducts();
});

const fetchProducts = async (page = 1) => {
  loading.value = true;
  try {
    const response = await fetch(`/api/products?page=${page}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    const data = await response.json();
    products.value = data.results;
    currentPage.value = data.pagination.page;
    totalPages.value = data.pagination.pages;
  } catch (err) {
    error.value = "Failed to fetch products";
  } finally {
    loading.value = false;
  }
};

const openDialog = (product: Product | null = null) => {
  editingProduct.value = product;
  showDialog.value = true;
  if (product) {
    form.setValues(product);
  } else {
    form.resetForm();
  }
};

const onSubmit = form.handleSubmit(async (values) => {
  const url = editingProduct.value
    ? `/api/products/${editingProduct.value.id}`
    : "/api/products";

  const method = editingProduct.value ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) throw new Error("Failed to save product");

    showDialog.value = false;
    fetchProducts(currentPage.value);
  } catch (err) {
    console.error("Failed to save product:", err);
  }
});

const deleteProduct = async (id: string) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete product");

    fetchProducts(currentPage.value);
  } catch (err) {
    console.error("Failed to delete product:", err);
  }
};
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Manage Products</h1>
      <Button @click="openDialog()">Add New Product</Button>
    </div>

    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
      ></div>
    </div>

    <div v-else-if="error" class="text-center text-red-600">
      {{ error }}
    </div>

    <div v-else>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="product in products" :key="product.id">
            <TableCell>
              <img
                :src="product.image"
                :alt="product.name"
                class="w-16 h-16 object-cover rounded"
              />
            </TableCell>
            <TableCell>{{ product.name }}</TableCell>
            <TableCell>{{ product.description }}</TableCell>
            <TableCell>${{ product.price.toFixed(2) }}</TableCell>
            <TableCell>
              <div class="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  @click="openDialog(product)"
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  @click="deleteProduct(product.id)"
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="mt-4 flex justify-center">
        <Button
          v-for="page in totalPages"
          :key="page"
          variant="outline"
          :class="{
            'bg-primary text-primary-foreground': page === currentPage,
          }"
          @click="fetchProducts(page)"
        >
          {{ page }}
        </Button>
      </div>
    </div>

    <Dialog :open="showDialog" @update:open="showDialog = false">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{
            editingProduct ? "Edit Product" : "Add New Product"
          }}</DialogTitle>
        </DialogHeader>

        <Form @submit="onSubmit" class="space-y-4">
          <FormField name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="description">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter product description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="price">
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter product price"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="image">
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter product image URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  </div>
</template>
