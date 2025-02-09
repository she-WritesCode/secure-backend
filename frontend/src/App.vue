<script setup lang="ts">
import NavMenu from "./components/NavMenu.vue";
import Toaster from "./components/ui/toast/Toaster.vue";
</script>

<template>
  <Toaster />
  <NavMenu />
  <RouterView />
</template>

<style scoped></style>
