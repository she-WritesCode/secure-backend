<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
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
const loading = ref(false);
const error = ref<string | null>(null);

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();
    localStorage.setItem("admin_token", data.token);
    router.push("/admin/products");
  } catch (err) {
    error.value = "Invalid email or password";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-center text-2xl font-bold"
          >Admin Login</CardTitle
        >
      </CardHeader>
      <CardContent>
        <Form @submit="onSubmit" class="space-y-4">
          <div v-if="error" class="p-3 text-sm text-red-600 bg-red-50 rounded">
            {{ error }}
          </div>

          <FormField name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? "Logging in..." : "Login" }}
          </Button>
        </Form>
      </CardContent>
    </Card>
  </div>
</template>
