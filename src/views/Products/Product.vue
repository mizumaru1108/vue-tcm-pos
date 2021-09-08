<template>
  <dashboard-layouts>
    <!-- kontainer -->
    <div class="flex justify-center p-5 flex-grow h-full">
      <div class="pt-1 px-5 pb-5 bg-white rounded-xl w-full">
        <!-- field judul -->
        <div class="text-2xl text-black mt-5 font-bold text-center">
          Daftar Produk
        </div>
        <!-- field judul -->

        <!-- field filter -->
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
        <!-- field filter -->

        <!-- tabel -->
        <div class="text-black overflow-x-auto py-1">
          <t-table
            :headers="headers"
            :data="productList.data"
            variant="default"
          >
            <template slot="row" slot-scope="props">
              <tr :class="[props.trClass]">
                <td :class="props.tdClass">
                  {{ props.row.name }}
                </td>
                <td :class="props.tdClass">Rp. {{ props.row.price }}</td>
                <td :class="props.tdClass" class="flex flex-row">
                  <t-button
                    variant="secondary"
                    class="mr-2 bg-green-400"
                    @click="openFormModal(props.row.id)"
                    >Edit</t-button
                  >
                  <t-button
                    variant="secondary"
                    class="bg-red-400"
                    @click="confirmDelete(props.row.id)"
                    >Delete</t-button
                  >
                </td>
              </tr>
            </template>
          </t-table>
        </div>
        <!-- tabel -->
      </div>

      <!-- field modal add kategori -->
      <t-modal v-model="formModal">
        <template v-slot:header>
          {{ selectedAction == "create" ? "Tambah Produk" : "Edit Detail" }}
        </template>

        <div>
          <label for="">Nama Produk</label>
          <t-input v-model="categoryData.name" />
          <span
            class="text-sm text-left text-red-600"
            v-if="errorData.errors && errorData.errors.name"
          >
            {{ errorData.errors.name[0] }}
          </span>
        </div>
        <div>
          <label for="">Category</label>
          <t-select
            v-model="productData.category_id"
            :options="allCategory"
            textAttribute="name"
            valueAttribute="id"
          />
          <span
            class="text-sm text-left text-red-600"
            v-if="errorData.errors && errorData.errors.category_id"
          >
            {{ errorData.errors.category_id[0] }}
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
      <!-- field modal add kategori -->
    </div>
    <!-- kontainer -->
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
      currentPage: 1,
      // perPage: 7,
      formModal: false,
      selectedId: null,
      selectedAction: "create",
      errors: {},
      headers: [
        {
          value: "name",
          text: "Nama",
        },
        {
          value: "price",
          text: "Harga",
        },
        {
          value: "actions",
          text: "Actions",
        },
      ],
    };
  },
  computed: {
    ...mapState("product", ["productList", "productData", "errorData"]),
    ...mapState("category", ["allCategory"]),
  },
  methods: {
    ...mapActions("product", [
      "getAllProductList",
      "getProduct",
      "updateProduct",
      "createProduct",
      "deleteProduct",
      "clearProduct",
      "clearError",
    ]),

    mounted() {
      this.fetchData();
      this.clearError();
    },

    clearImage() {
      this.selectedImage = null;
    },

    openFormModal(id = null) {
      this.formModal = true;
      this.clearError();

      if (id != null) {
        this.selectedId = id;
        this.selectedAction = "edit";
        this.getCategory({ id });
      } else {
        this.selectedId = null;
        this.selectedAction = "create";
        this.clearCategory();
      }
    },

    closeFormModal() {
      this.formModal = false;
      this.clearError();
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
            this.selectedImage = null;
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
            this.selectedImage = null;
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

    async fetchData() {
      await this.getAllProductList({
        filter: this.filter,
        page: this.currentPage,
        per_page: this.perPage,
      });
    },
  },
};
</script>
