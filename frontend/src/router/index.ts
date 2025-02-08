import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../pages/ProductList.vue"),
      name: "products",
    },
    {
      path: "/product/:id",
      component: () => import("../pages/ProductDetail.vue"),
      name: "product-detail",
    },
    {
      path: "/checkout",
      component: () => import("../pages/Checkout.vue"),
      name: "checkout",
    },
    {
      path: "/cart",
      component: () => import("../pages/Cart.vue"),
      name: "cart",
    },
    {
      path: "/admin",
      component: () => import("../pages/admin/AdminLayout.vue"),
      children: [
        {
          path: "login",
          component: () => import("../pages/admin/Login.vue"),
          name: "admin-login",
        },
        {
          path: "products",
          component: () => import("../pages/admin/Products.vue"),
          name: "admin-products",
        },
        {
          path: "orders",
          component: () => import("../pages/admin/Orders.vue"),
          name: "admin-orders",
        },
      ],
    },
  ],
});

export default router;
