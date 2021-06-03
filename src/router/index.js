import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    meta: {
      needAuth: true,
    },
    component: Dashboard,
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue"),
  },
  {
    path: "/products",
    name: "Products",
    meta: {
      needAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Products/Product.vue"),
  },
  {
    path: "/categories",
    name: "Categories",
    meta: {
      needAuth: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Products/Category.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters["login/isAuthenticated"];

  const requiredAuth = to.matched.some((record) => record.meta.needAuth);
  try {
    if (requiredAuth && !isAuthenticated) {
      console.log("gagal");
      next("/login");
    } else if (requiredAuth && isAuthenticated) {
      console.log("berhasil");
      await store.dispatch("login/getProfile");
      next();
    } else {
      next();
    }
  } catch (error) {
    // console.log(error.message);
    if (error.message == 401) {
      next("/login");
    } else {
      next();
    }
  }
});
export default router;
