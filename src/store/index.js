import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import login from "./module/login.module";
import user from "./module/user.module";
import category from "./module/category.module";
import product from "./module/product.module";
import order from "./module/order.module";

import createPersistedState from "vuex-persistedstate";

export default new Vuex.Store({
  state: {
    sideBarOpen: false,
  },
  getters: {
    sideBarOpen: (state) => {
      return state.sideBarOpen;
    },
  },
  mutations: {
    toggleSidebar(state) {
      state.sideBarOpen = !state.sideBarOpen;
    },
  },
  actions: {
    toggleSidebar(context) {
      context.commit("toggleSidebar");
    },
  },
  modules: {
    login,
    user,
    category,
    product,
    order,
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }),
  ],
});
