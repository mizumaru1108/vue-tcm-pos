<template>
  <dashboard-layouts>
    <div
      class="flex flex-col lg:flex-row justify-center flex-grow h-full no-print"
    >
      <div class="w-full flex flex-row flex-wrap lg:w-8/12 pr-2">
        <div class="p-3 bg-white rounded-xl shadow-xl w-full">
          <t-input
            v-model="searchProduct"
            class="mb-5"
            placeholder="Search disini"
          />
          <perfect-scrollbar
            style="max-height: 515px;"
            class="flex flex-row flex-wrap"
          >
            <div
              class="w-1/3 lg:w-1/3 px-2"
              v-for="(product, key) in filteredItem"
              :key="key"
              @click="onSelectProduct(product.product_id)"
            >
              <div class="rounded-xl shadow-md px-1 mb-5">
                <div>
                  <img
                    class="h-36 w-full rounded-t-lg object-contain"
                    :src="product.image_url"
                  />
                </div>
                <div class="p-1 flex justify-between">
                  <span class="text-xs">{{ product.name }}</span>
                  <span class="text-xs"
                    >Rp.{{ product.price | formatRupiah }}</span
                  >
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
      </div>
      <div class="w-full lg:w-4/12 sticky pl-2">
        <div class="p-5 bg-white rounded-xl shadow-xl" style="height: 610px;">
          <div class="flex">
            <span class="w-7 fill-current">
              <cartVariant></cartVariant>
            </span>
            <span>Shopping List</span>
          </div>
          <perfect-scrollbar
            class="mt-1"
            style="min-height:210px; max-height:210px;"
          >
            <div
              class="py-2 px-2 flex flex-row justify-between"
              v-for="(product, key) in details"
              :key="key"
            >
              <div class="flex flex-col">
                <span class="text-sm">{{ product.name }}</span>
                <div class="flex flex-row align-middle">
                  <t-button
                    fixedClasses="h-7 w-7 rounded-full"
                    :class="{
                      'text-gray-400': product.qty >= product.max_qty,
                      '': product.qty < product.max_qty,
                    }"
                    class="flex justify-center align-middle"
                    @click="onPlus(product.product_id, product.price)"
                    :disabled="product.qty >= product.max_qty"
                  >
                    <icon-plus class="w-6 h-6" />
                  </t-button>
                  <div class="px-1">
                    <div class="block w-12 px-2 text-center">
                      {{ product.qty }}
                    </div>
                  </div>
                  <t-button
                    fixedClasses="h-7 w-7 rounded-full"
                    class="flex justify-center align-middle"
                    @click="onMin(product.product_id, product.price)"
                  >
                    <icon-minus class="w-6 h-6" />
                  </t-button>
                </div>
              </div>
              <div class="flex flex-col">
                <div>
                  <span class="text-xs">
                    Harga : Rp.{{ product.price | formatRupiah }}
                  </span>
                </div>
                <span class="text-xs">
                  <div>
                    Subtotal : Rp.{{ product.total_price | formatRupiah }}
                  </div>
                </span>
              </div>
            </div>
          </perfect-scrollbar>

          <div class="mt-3 flex flex-col">
            <div class="flex justify-between">
              <div class="flex flex-col">
                <span class="text-sm">Sub Total</span>
                <span class="text-xs">{{ subTotalItemQty }} Barang</span>
              </div>
              <div>
                <span class="text-sm">Rp.{{ subTotal }}</span>
              </div>
            </div>
            <div class="flex justify-between">
              <div class="w-11/12 lg:w-9/12 flex flex-col mt-2">
                <span class="text-sm">Diskon</span>
                <span class="text-xs"
                  ><button
                    type="button"
                    class="text-blue-500 underline hover:text-blue-600 transition duration-100 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="onChangeDiscount"
                  >
                    Change
                  </button></span
                >
              </div>
              <div class="w-1/12 lg:w-3/12 flex flex-col justify-items-end">
                <input
                  v-if="changeDiscount"
                  v-model="discount"
                  type="number"
                  class="block px-2 w-full h-7 transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  @keyup="countTransaction"
                  @change="countTransaction"
                />
                <span class="text-sm text-right" v-else>{{ discount }} % </span>
                <span class="text-xs">Discount : {{ totalDiscount }}</span>
              </div>
            </div>
            <div
              class="bg-green-300 rounded-lg mt-3 text-green-50 text-center py-1"
            >
              <span class="text-md">Rp.{{ finalTotal }} </span>
            </div>
            <div class="flex flex-row mt-2">
              <div class="p-3 border border-gray-300 text-gray-400 text-sm">
                Cash
              </div>
              <t-input
                class="rounded-none"
                v-model.number="orderData.cash"
                @keyup="onCashChange"
                @change="onCashChange"
                placeholder="Masukan nominal bayar"
                type="number"
              />
            </div>
            <div class="flex justify-end">
              <div
                class="w-32 rounded-lg mt-1 text-green-50 text-center"
                :class="{ 'bg-yellow-300': !minus, 'bg-red-500': minus }"
              >
                <span class="text-sm">Rp.{{ change }} </span>
              </div>
            </div>
            <div class="flex flex-col w-full mt-4 mb-2">
              <t-button @click="onMove" class="w-full">Move to List</t-button>
            </div>
            <div class="flex flex-col w-full">
              <t-button
                class="w-full"
                @click="openReceiptModal"
                :disabled="minus || orderData.cash == null"
                >CheckOut</t-button
              >
            </div>
          </div>
        </div>
      </div>

      <t-modal v-model="receiptModal">
        <div id="printReceipt" ref="printReceipt">
          <div class="flex justify-center text-center flex-col">
            <img
              class="h-12 w-12 mx-auto"
              src="~@/assets/small_ico.jpg"
              alt="logo"
            />
            <div class="text-xl">Toko Commando Military</div>
            <span class="text-md">{{ orderData.order_code }}</span>
            <span class="text-sm"
              >no antrian: {{ orderData.order_number }}</span
            >
            <div class="flex justify-between">
              <span class="text-sm"
                >Cashier: {{ orderData.employee_name }}</span
              >
              <span class="text-sm">{{ orderData.trans_date }}</span>
            </div>
            <hr class="my-1" />
          </div>
          <div>
            <t-table :headers="headers" :data="details" variant="receipt">
              <template v-slot:thead="props">
                <thead :class="props.theadClass">
                  <tr :class="props.trClass">
                    <th class="text-left">
                      {{ props.data[0].text }}
                    </th>
                    <th class="text-left">
                      {{ props.data[1].text }}
                    </th>
                    <th class="text-right">
                      {{ props.data[2].text }}
                    </th>
                  </tr>
                </thead>
              </template>
              <template slot="row" slot-scope="props">
                <tr @click="onSelectRow(props.row)" :class="[props.trClass]">
                  <td :class="props.tdClass">
                    {{ props.row.name }}
                    <br />
                    {{ props.row.price }}
                  </td>
                  <td :class="props.tdClass">
                    {{ props.row.qty }}
                  </td>
                  <td :class="[props.tdClass, 'text-right']">
                    {{ props.row.total_price }}
                  </td>
                </tr>
              </template>
            </t-table>
          </div>
          <hr class="my-1" />
          <div class="flex flex-col">
            <div class="flex justify-between">
              <span class="text-sm">Total Item </span>
              <span class="text-sm">{{ subTotalItemQty }} item</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm">Subtotal</span>
              <span class="text-sm">{{ subTotal }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs">Discount </span>
              <span class="text-xs"
                >{{ discount }} % / Rp.{{ totalDiscount }}</span
              >
            </div>
            <hr class="my-1" />
            <div class="flex justify-between">
              <span>Total</span>
              <span>{{ finalTotal }}</span>
            </div>
            <div class="flex justify-between">
              <span>Cash</span>
              <span>{{ orderData.cash }}</span>
            </div>
            <hr class="my-1" />
            <div class="flex justify-between">
              <span>Change</span>
              <span>{{ change }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="flex flex-row justify-between pb-1">
            <t-button
              variant="editable"
              class="bg-custom-color2 text-black w-full font-medium mr-1"
              @click="withReceipt"
            >
              Proceed and Print
            </t-button>
            <t-button
              variant="editable"
              class="bg-custom-color2 text-black w-full font-medium ml-1"
              @click="withoutReceipt"
            >
              Proceed without Print
            </t-button>
          </div>
          <t-button
            variant="editable"
            class="bg-red-500 text-black font-medium"
            @click="closeReceiptModal"
          >
            Cancel
          </t-button>
        </div>
      </t-modal>
    </div>
    <div id="printArea"></div>
  </dashboard-layouts>
</template>
<style>
@media print {
  .no-print,
  .no-print * {
    display: none !important;
  }
}
</style>
<script>
import DashboardLayouts from '../../components/DashboardLayouts.vue';
import { mapActions, mapState, mapMutations } from 'vuex';
import { mapMultiRowFields } from 'vuex-map-fields';
import IconPlus from 'vue-material-design-icons/Plus';
import IconMinus from 'vue-material-design-icons/Minus';
import cartVariant from 'vue-material-design-icons/CartVariant';
export default {
  components: { DashboardLayouts, IconPlus, IconMinus, cartVariant },
  computed: {
    ...mapState('product', ['productList']),
    ...mapMultiRowFields('order', ['orderData.details']),
    ...mapState('order', ['orderData']),
    filteredItem() {
      return this.productProduct.filter((value) => {
        return value.name
          .toLowerCase()
          .includes(this.searchProduct.toLowerCase());
      });
    },
  },
  data() {
    return {
      receiptModal: null,
      discount: 0,
      changeDiscount: false,
      id: this.$route.params.id,
      searchProduct: '',
      subTotal: 0,
      subTotalItemQty: 0,
      finalTotal: 0,
      totalDiscount: 0,
      change: 0,
      minus: true,
      filteredList: [],
      productProduct: [],
      headers: [
        {
          value: 'name',
          text: 'Name',
        },
        {
          value: 'qty',
          text: 'Qty',
        },
        {
          value: 'subtotal',
          text: 'Subtotal',
        },
      ],
    };
  },
  async onIdle() {
    await this.syncData();
  },

  async mounted() {
    await this.fetchData();
    await this.countTransaction();
  },

  async beforeDestroy() {
    await this.syncData();
  },

  methods: {
    ...mapActions('product', ['getAllProductList']),
    ...mapActions('order', ['getOrder', 'updateOrder', 'getAllOrderList']),
    ...mapMutations('order', ['addSelectedProduct', 'removeSelectedProduct']),

    async syncData() {
      await this.updateOrder({ id: this.id, payload: this.orderData });
    },

    openReceiptModal() {
      this.receiptModal = true;
    },

    closeReceiptModal() {
      this.receiptModal = false;
    },

    async withoutReceipt() {
      this.orderData.checkout = true;
      this.updateOrder({ id: this.id, payload: this.orderData });
      this.$router.push('/transactions');
      await this.$toast.success('Transaction success!');
    },

    async withReceipt() {
      await this.printReceipt();
    },

    async printReceipt() {
      let printContent = this.$refs.printReceipt.innerHTML;
      const printArea = document.getElementById('printArea');
      printArea.innerHTML = printContent;
      window.print();
      printArea.innerHTML = '';

      this.orderData.checkout = true;
      this.updateOrder({ id: this.id, payload: this.orderData });
      this.$router.push('/transactions');
      await this.$toast.success('Transaction success!');
    },

    async onMove() {
      try {
        await this.updateOrder({ id: this.id, payload: this.orderData });
        this.$router.push('/transactions');
        await this.$toast.success('Transaction success!');
      } catch (error) {
        console.log(error);
        this.$toast.error(error.message);
      }
    },

    countTransaction() {
      this.subTotal = 0;
      this.subTotalItemQty = 0;
      this.totalDiscount = 0;
      this.finalTotal = 0;

      this.details.forEach((value) => {
        this.subTotal += parseInt(value.total_price);
        this.subTotalItemQty += parseInt(value.qty);
      });
      this.totalDiscount = (this.subTotal * this.discount) / 100;
      this.orderData.discount_value = this.totalDiscount;
      this.orderData.discount_percentage = this.discount;
      this.finalTotal = this.subTotal - this.totalDiscount;
      this.change = this.orderData.cash - this.finalTotal;
    },

    onCashChange() {
      this.change = this.orderData.cash - this.finalTotal;
      if (this.orderData.cash < this.finalTotal) {
        this.minus = true;
      } else {
        this.minus = false;
      }
      // this.orderData.cash = this.orderData.cash;
      this.orderData.change = this.change;
    },

    async fetchData() {
      await this.getAllProductList();
      this.productProduct = this.productList.data.map((value) => {
        return {
          product_id: value.id,
          image_url: value.image_url,
          name: value.name,
          price: value.price,
          qty: value.quantity,
          slug: value.detail,
          total_price: value.total_price,
        };
      });
      await this.getOrder({ id: this.id });
    },

    onChangeDiscount() {
      this.changeDiscount = !this.changeDiscount;
    },

    async onSelectProduct(id) {
      const findProduct = this.productProduct.find(
        (value) => value.product_id === id,
      );
      let data = { ...findProduct };
      // console.log({ productProduct: this.productProduct });
      let checkExists = this.details.some((value) => value.product_id === id);
      if (checkExists) {
        // console.log({ data });
        let findIndex = this.details.findIndex(
          (value) => value.product_id === id,
        );
        const selectedDetails = this.details[findIndex];
        let qty = selectedDetails.qty;

        if (qty < data.qty) {
          selectedDetails.qty = qty + 1;
          selectedDetails.total_price = (qty + 1) * data.price;
        } else {
          await this.$toast.error(`Exceed the quantity limit ${data.qty}!`);
        }
      } else {
        if (data.qty > 0) {
          data.max_qty = data.qty;
          data.qty = 1;
          data.total_price = data.price;
          let pushData = Object.assign({}, data);
          this.addSelectedProduct(pushData);
        } else {
          await this.$toast.error(`Exceed the quantity limit ${data.qty}!`);
        }
      }
      this.countTransaction();
    },

    onPlus(id, paramHarga) {
      const price = paramHarga;

      let currentIndex = this.details.findIndex(
        (value) => value.product_id === id,
      );
      const selectedDetails = this.details[currentIndex];

      // console.log({ selectedDetails });

      let qty = selectedDetails.qty;
      selectedDetails.qty += 1;
      selectedDetails.total_price = (qty + 1) * price;
      this.countTransaction();
    },

    onChangeQty(id, paramHarga) {
      const price = paramHarga;
      let currentIndex = this.details.findIndex(
        (value) => value.product_id === id,
      );
      let qty = this.details[currentIndex].qty;
      this.details[currentIndex].total_price = qty * price;
      this.countTransaction();
    },

    onMin(id, paramHarga) {
      const price = paramHarga;
      let currentIndex = this.details.findIndex(
        (value) => value.product_id === id,
      );
      let qty = this.details[currentIndex].qty;
      if (qty > 1) {
        this.details[currentIndex].qty -= 1;
        this.details[currentIndex].total_price = (qty - 1) * price;
      } else {
        this.removeSelectedProduct(id);
      }
      this.countTransaction();
    },

    filterItem() {
      this.filteredList = this.productProduct.filter((value) => {
        return value.name.toLowerCase() === this.searchProduct.toLowerCase();
      });
    },
  },
};
</script>
