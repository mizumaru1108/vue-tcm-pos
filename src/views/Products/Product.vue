<template>
  <dashboard-layouts>
    <div class="flex justify-center p-5 flex-grow h-full">
      <div class="pt-1 px-5 pb-5 bg-white rounded-xl w-full">
        <div class="text-2xl text-black mt-5 font-bold text-center">
          Daftar Product
        </div>
        <div class="flex py-1">
          <div class="relative flex w-full flex-wrap items-stretch pr-1">
            <t-input
              v-model="filter"
              @change="onSearch"
              placeholder="Search Here"
            />
            <span
              v-if="!!filter"
              @click="clearSearch"
              class="text-center absolute bg-transparent text-base items-center justify-center right-0 pr-2 py-2 text-gray-400"
            >
              <close-thick></close-thick>
            </span>
          </div>

          <div class="pr-1">
            <button
              @click="onSearch"
              class="py-2 px-3 bg-blue-500 rounded-md text-white focus:shadow-outline-none focus:shadow-xl"
            >
              <magnify></magnify>
            </button>
          </div>

          <div class="pr-1">
            <button
              @click="openFormModal()"
              class="py-2 px-3 bg-blue-500 rounded-md text-white focus:shadow-outline-none focus:shadow-xl"
            >
              <icon-plus></icon-plus>
            </button>
          </div>

          <select
            class="transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            v-model.number="perPage"
          >
            <option value="pakaian">Pakaian</option>
            <option value="sepatu">Sepatu</option>
            <option value="aksesoris">Aksesoris</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
      </div>
    </div>
    <t-modal v-model="formModel" header="Kelola Kategori">
      <div>
        <label for="">Nama Kategori</label>
        <t-input v-model="categoryData.name" />
        <span v-if="errorData.errors && errorData.errors.name">
          {{ errorData.errors.name[0] }}
        </span>
      </div>
      <template v-slot:footer>
        <div class="flex justify-between"></div>
      </template>
    </t-modal>
  </dashboard-layouts>
</template>

<script>
import DashboardLayouts from "../../components/DashboardLayouts.vue";
import CloseThick from "vue-material-design-icons/CloseThick";
import Magnify from "vue-material-design-icons/Magnify";
import IconPlus from "vue-material-design-icons/Plus";

export default {
  name: "Products",
  components: {
    DashboardLayouts,
    CloseThick,
    Magnify,
    IconPlus,
  },
};
</script>
