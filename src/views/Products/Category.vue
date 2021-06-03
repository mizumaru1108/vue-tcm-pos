<template>
  <dashboard-layouts>
    <div class="flex justify-center p-5 flex-grow h-full">
      <div class="pt-1 px-5 pb-5 bg-white rounded-xl w-full">
        <div class="text-2xl text-black mt-5 font-bold text-center">
          Daftar Kategori
        </div>
        <div class="flex py-1">
          <div class="relative flex w-full flex-wrap items-stretch pr-1">
            <t-input v-model="filter" placeholder="Search Here" />
            <span
              v-if="!!filter"
              class="text-center absolute bg-transparent text-base items-center justify-center right-0 pr-2 py-2 text-gray-400"
            >
              <close-thick></close-thick>
            </span>
          </div>

          <div class="pr-1">
            <button
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
        </div>
      </div>
      <t-modal v-model="formModal" header="Manage Category">
        <div>
          <label for="">Nama Kategori</label>
          <t-input v-model="categoryData.name" />
          <span
            class="text-sm text-left text-red-600"
            v-if="errorData.errors && errorData.errors.name"
          >
            {{ errorData.errors.name[0] }}
          </span>
        </div>

        <template v-slot:footer>
          <div class="flex justify-between">
            <t-button @click="closeFormModal" type="button">
              Cancel
            </t-button>
            <t-button @click="submitCategory" type="button">
              Save
            </t-button>
          </div>
        </template>
      </t-modal>
    </div>
  </dashboard-layouts>
</template>

<script>
import { mapActions, mapState } from "vuex";
import DashboardLayouts from "../../components/DashboardLayouts.vue";
import CloseThick from "vue-material-design-icons/CloseThick";
import Magnify from "vue-material-design-icons/Magnify";
import IconPlus from "vue-material-design-icons/Plus";

export default {
  name: "Categories",
  components: {
    DashboardLayouts,
    CloseThick,
    Magnify,
    IconPlus,
  },
  data() {
    return {
      filter: "",
      formModal: false,
      selectedAction: "create",
    };
  },
  computed: {
    ...mapState("category", ["categoryList", "categoryData", "errorData"]),
  },
  methods: {
    ...mapActions("category", [
      "getAllCategoryList",
      "getCategory",
      "updateCategory",
      "createCategory",
      "deleteCategory",
      "clearCategory",
      "clearError",
    ]),

    openFormModal() {
      this.formModal = true;
    },

    closeFormModal() {
      this.formModal = false;
    },

    async submitCategory() {
      try {
        if (this.selectedAction == "create") {
          try {
            await this.createCategory({ payload: this.categoryData });
            this.closeFormModal();
            this.fetchData();
            this.$toast.success("Data Saved Successfully", {
              duration: 3000,
            });
            this.clearError();
          } catch (error) {
            console.log(error);
            this.$toast.error(error.message);
          }
        } else if (this.selectedAction == "edit") {
          try {
            await this.updateCategory({
              id: this.selectedId,
              payload: this.categoryData,
            });
            this.closeFormModal();
            this.fetchData();
            this.$toast.success("Data Saved Successfully", {
              duration: 3000,
            });
            this.clearError();
          } catch (error) {
            console.log(error);
            this.$toast.error(error.message);
          }
        }
      } catch (error) {
        console.log(error);
        this.$toast.error(error.message);
      }
    },
  },
};
</script>
