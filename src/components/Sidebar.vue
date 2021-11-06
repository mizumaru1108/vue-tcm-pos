<template>
  <div
    class="w-1/2 md:w-1/3 lg:w-64 fixed md:top-0 md:left-0 h-screen lg:block bg-white border-r z-30"
    :class="sideBarOpen ? '' : 'hidden'"
    id="main-nav"
  >
    <div class="w-full h-20 border-b flex px-4 items-center mb-8">
      <img class="object-cover max-h-20" src="~@/assets/logo.png" />
    </div>

    <perfect-scrollbar>
      <div class="px-4 pb-4">
        <p class="pl-4 text-sm font-semibold mb-1">MAIN</p>
        <router-link
          to="/"
          exact
          exact-active-class="bg-green-300"
          class="w-full flex items-center text-blue-400 h-10 pl-4 hover:bg-green-300 rounded-lg cursor-pointer"
        >
          <viewDashboard></viewDashboard>
          <span class="text-gray-700 pl-2 bordercustom">Dashboard</span>
        </router-link>

        <router-link
          to="/account"
          exact
          exact-active-class="bg-green-300"
          class="w-full flex items-center text-blue-400 h-10 pl-4 hover:bg-green-300 rounded-lg cursor-pointer"
        >
          <span class="h-6 w-6 fill-current mr-2" viewBox="0 0 20 20">
            <accountSupervisorCircle></accountSupervisorCircle>
          </span>
          <span class="text-gray-700">Kelola Akun</span>
        </router-link>

        <router-link
          to="/transactions"
          exact
          exact-active-class="bg-green-300"
          class="w-full flex items-center text-blue-400 h-10 pl-4 hover:bg-green-300 rounded-lg cursor-pointer"
        >
          <span class="h-6 w-6 fill-current mr-2" viewBox="0 0 20 20">
            <cartVariant></cartVariant>
          </span>
          <span class="text-gray-700">Trasaction</span>
        </router-link>

        <div class="px-4">
          <p class="text-sm font-semibold">Commando Military Tactical</p>
          <router-link
            to="/products"
            exact
            exact-active-class="bg-green-300"
            class="w-full flex items-center text-blue-400 h-10 hover:bg-green-300 rounded-lg cursor-pointer"
          >
            <span class="h-6 w-6 fill-current mr-2" viewBox="0 0 20 20">
              <warehouse></warehouse>
            </span>
            <span class="text-gray-700">Kelola Produk</span>
          </router-link>

          <router-link
            to="/categories"
            exact
            exact-active-class="bg-green-300"
            class="w-full flex items-center text-blue-400 h-10 hover:bg-green-300 rounded-lg cursor-pointer"
          >
            <span class="h-6 w-6 fill-current mr-2" viewBox="0 0 20 20">
              <warehouse></warehouse>
            </span>
            <span class="text-gray-700">Kelola Kategori</span>
          </router-link>
        </div>

        <div class="px-4">
          <p class="text-sm font-semibold">Kelola Laporan</p>

          <router-link
            to="/transaction-report"
            exact
            exact-active-class="bg-green-300"
            class="w-full flex items-center text-blue-400 h-10 hover:bg-green-300 rounded-lg cursor-pointer"
          >
            <span class="h-6 w-6 fill-current mr-2">
              <clipboardPulse></clipboardPulse>
            </span>
            <span class="text-gray-700">Laporan Transaksi</span>
          </router-link>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import cartVariant from "vue-material-design-icons/CartVariant";
import viewDashboard from "vue-material-design-icons/ViewDashboard";
import warehouse from "vue-material-design-icons/Warehouse";
import accountSupervisorCircle from "vue-material-design-icons/AccountSupervisorCircle";
import clipboardPulse from "vue-material-design-icons/ClipboardPulse";
export default {
  name: "Sidebar",
  components: {
    cartVariant,
    viewDashboard,
    warehouse,
    accountSupervisorCircle,
    clipboardPulse,
  },
  computed: {
    ...mapState(["sideBarOpen"]),
  },
  data() {
    return {
      menu: [],
    };
  },
};
</script>
