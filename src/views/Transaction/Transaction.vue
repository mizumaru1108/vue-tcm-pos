<template>
  <dashboard-layouts>
    <!-- kontainer -->
    <div class="flex justify-center p-5 flex-grow h-full">
      <div class="pt-1 px-5 pb-5 bg-white rounded-xl w-full">
        <!-- field judul -->
        <div class="text-2xl text-black mt-5 font-bold text-center">
          Transaksi
        </div>

        <ul class="flex list-none flex-wrap pb-4 flex-row">
          <li class="flex-auto text-center pr-1">
            <a
              class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
              v-on:click="toggleTabs(1)"
              v-bind:class="{
                'text-black text-medium bg-white': openTab !== 1,
                'text-black text-medium bg-custom-color2': openTab === 1,
              }"
            >
              Order List
            </a>
          </li>
          <li class="-mb-px last:mr-0 flex-auto text-center pl-1">
            <a
              class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
              v-on:click="toggleTabs(2)"
              v-bind:class="{
                'text-black text-medium bg-white': openTab !== 2,
                'text-black text-medium bg-custom-color2': openTab === 2,
              }"
            >
              History
            </a>
          </li>
        </ul>

        <div
          class="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded"
        >
          <div class="p-3 flex-auto">
            <div class="tab-content tab-space">
              <div
                v-bind:class="{
                  hidden: openTab !== 1,
                  block: openTab === 1,
                }"
              >
                <div>
                  <div class="flex pb-3">
                    <t-button
                      @click="onCreateOrder"
                      variant="editable"
                      class="block py-3 w-full text-black font-medium bg-custom-color3 transition duration-100 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                    >
                      Create New Order
                    </t-button>
                  </div>

                  <t-table :headers="headers" :data="orderList.data">
                    <template slot="row" slot-scope="props">
                      <tr
                        @click="onSelectRow(props.row)"
                        :class="[props.trClass]"
                      >
                        <td :class="props.tdClass">
                          {{ props.row.created_at }}
                        </td>
                        <td :class="props.tdClass">
                          {{ props.row.order_number }}
                        </td>
                        <td :class="props.tdClass">
                          {{ props.row.order_code }}
                        </td>
                        <td :class="props.tdClass">
                          <button
                            v-if="props.row.status == 1"
                            class="block px-4 py-1 transition duration-100 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-300"
                          >
                            Pending
                          </button>
                          <button
                            v-else-if="props.row.status == 2"
                            class="block px-4 py-1 transition duration-100 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed bg-green-300"
                          >
                            Success
                          </button>
                        </td>
                        <td :class="props.tdClass">
                          {{ props.row.total_price }}
                        </td>
                      </tr>
                    </template>
                  </t-table>
                </div>
              </div>
              <div
                v-bind:class="{
                  hidden: openTab !== 2,
                  block: openTab === 2,
                }"
              >
                <div class="flex flex-col lg:flex-row">
                  <t-datepicker
                    range
                    v-model="date"
                    placeholder="Filter by Date"
                    class="w-full py-2"
                    date-format="Y-m-d"
                    user-format="j F, y"
                    @change="onDateChange"
                  />
                </div>

                <t-table :headers="headers" :data="orderList.data">
                  <template slot="row" slot-scope="props">
                    <!-- ON Click for tr -->
                    <!-- @click="onSelectRow(props.row)" -->
                    <tr :class="[props.trClass]">
                      <td :class="props.tdClass">
                        {{ props.row.created_at }}
                      </td>
                      <td :class="props.tdClass">
                        {{ props.row.order_number }}
                      </td>
                      <td :class="props.tdClass">
                        {{ props.row.order_code }}
                      </td>
                      <td :class="props.tdClass">
                        <button
                          v-if="props.row.status == 1"
                          class="block px-4 py-1 transition duration-100 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-300"
                        >
                          Pending
                        </button>
                        <button
                          v-else-if="props.row.status == 2"
                          class="block px-4 py-1 transition duration-100 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed bg-green-300"
                        >
                          Success
                        </button>
                      </td>
                      <td :class="props.tdClass">
                        {{ props.row.total_price }}
                      </td>
                    </tr>
                  </template>
                </t-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- kontainer -->
  </dashboard-layouts>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import DashboardLayouts from '../../components/DashboardLayouts.vue';

export default {
  components: {
    DashboardLayouts,
  },
  data() {
    return {
      date: '',
      openTab: 1,
      status: 1,
      headers: [
        {
          value: 'created_at',
          text: 'Tanggal',
        },
        {
          value: 'order_number',
          text: 'order_number',
        },
        {
          value: 'order_code',
          text: 'order_code',
        },
        {
          value: 'status',
          text: 'Status',
        },
        {
          value: 'total_price',
          text: 'Harga',
        },
      ],
    };
  },
  computed: {
    ...mapState('order', ['orderList']),
    check() {
      return this.date;
    },
  },
  watch: {
    check(date) {
      if (date == '') {
        this.fetchData();
      }
    },
  },

  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions('order', {
      getAllOrderList: 'getAllOrderList',
      createOrder: 'createOrder',
      getUnfinishTrans: 'getUnfinishTrans',
    }),

    fetchData() {
      this.getAllOrderList({ status: this.status });
    },

    onDateChange() {
      if (this.date) {
        if (this.date.length == 1) {
          this.getAllOrderList({
            fromdate: this.date[0],
          });
        }
        if (this.date.length > 1) {
          this.getAllOrderList({
            fromdate: this.date[0],
            todate: this.date[1],
          });
        }
      }
    },

    toggleTabs: function(tabNumber) {
      this.openTab = tabNumber;
      if (this.openTab == 1) {
        this.status = 1;
        this.getUnfinishTrans();
      } else {
        this.status = 2;
      }
      this.getAllOrderList({
        status: this.status,
      });
    },

    async onCreateOrder() {
      await this.createOrder();
      await this.getAllOrderList();
      await this.getUnfinishTrans();
    },

    onSelectRow(row) {
      if (row.status == 1) {
        this.$router.push({
          name: 'TransactionDetail',
          params: { id: row.id },
        });
      } else {
        this.$router.push('/transaction-report');
      }
    },
  },
};
</script>
