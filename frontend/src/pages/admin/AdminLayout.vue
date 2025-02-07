<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onBeforeMount(() => {
  const token = localStorage.getItem("admin_token");
  if (!token && router.currentRoute.value.name !== "admin-login") {
    router.push("/admin/login");
  }
});

const goToLoginPage = () => {
  localStorage.removeItem("admin_token");
  router.push("/admin/login");
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <RouterLink
                to="/admin/products"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                active-class="border-b-2 border-indigo-500"
              >
                Products
              </RouterLink>
              <RouterLink
                to="/admin/orders"
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                active-class="border-b-2 border-indigo-500"
              >
                Orders
              </RouterLink>
            </div>
          </div>
          <div class="flex items-center">
            <button
              @click="goToLoginPage"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>
