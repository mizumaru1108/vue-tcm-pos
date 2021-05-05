import Vue from "vue";
import App from "./App.vue";

// Axios
import axios from "axios";
import VueAxios from "vue-axios";

//router
import router from "./router";

// Tailwind
import VueTailwind from "vue-tailwind";
import MyTheme from "./myTheme.js";
import "tailwindcss/tailwind.css";

// Perfect Scrollbar
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";

//import vue toast
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

//store module
import store from "./store";

Vue.config.productionTip = false;

Vue.use(VueToast);

Vue.use(PerfectScrollbar);

Vue.use(VueAxios, axios);

Vue.use(VueTailwind, MyTheme);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
