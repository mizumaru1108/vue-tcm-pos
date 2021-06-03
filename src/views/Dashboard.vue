<template>
  <dashboard-layouts>
    <div class="flex justify-center p-5 flex-grow h-full">
      <div class="pt-1 px-5 pb-5 bg-white rounded-xl w-full">
        <div class="text-2xl text-black mt-5 font-bold text-center">
          Daftar Product
        </div>
      </div>
    </div>
  </dashboard-layouts>
</template>

<script>
import DashboardLayouts from "../components/DashboardLayouts.vue";

export default {
  name: "Dashboard",
  components: {
    DashboardLayouts,
  },
};
</script>
