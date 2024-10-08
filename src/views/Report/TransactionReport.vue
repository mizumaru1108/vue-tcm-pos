<template>
  <dashboard-layouts>
    <div class="no-print">
      <!-- Top Menu -->
      <div class="flex flex-grow justify-center pb-2">
        <div class="p-1 w-full">
          <div class="flex justify-between pb-1">
            <span class="text-black text-3xl">Report</span>
            <t-button
              variant="editable"
              class="font-medium bg-custom-color2 text-black"
              @click="openExportModal"
              >Export</t-button
            >
          </div>
          <hr />
        </div>
      </div>

      <!-- Chart -->
      <div class="flex justify-center pb-1 flex-grow h-full">
        <div class="p-5 bg-white rounded-xl w-full">
          <div class="flex justify-between">
            <span>Income Statistic</span>
            <span
              >Rp.{{ totalIncome | formatRupiah }} from {{ totalTrans }}x
              Transaction</span
            >
            <select
              class="transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              v-model="lineChartData"
              @change="onLineChartDataChange"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <div v-if="lineChartData === 'Daily' || lineChartData === 'Yearly'">
            <bar-chart :chartdata="chartData" :options="options" />
          </div>
          <div v-else>
            <line-chart :chartdata="chartData" :options="options" />
          </div>
        </div>
      </div>

      <div class="flex justify-center py-1 flex-grow h-full">
        <div class="p-5 bg-white rounded-xl w-full">
          <!-- Search Perpage and Date Picker -->
          <div class="flex flex-col lg:flex-row">
            <div class="flex flex-row lg:w-9/12">
              <div class="relative flex w-full flex-wrap max-h-6 pr-1">
                <t-input
                  v-model="filter"
                  @keyup.enter="onSearch"
                  placeholder="Search by Price/Order_Code"
                />
                <span
                  v-if="!!filter"
                  @click="clearSearch"
                  class="text-center absolute bg-transparent text-base items-center justify-center right-0 pr-2 py-2 text-gray-400"
                >
                  <close-thick></close-thick>
                </span>
              </div>
              <div class="lg:pr-1">
                <button
                  @click="onSearch"
                  class="py-2 px-3 bg-blue-500 rounded-md text-white focus:shadow-outline-none focus:shadow-xl"
                >
                  <magnify></magnify>
                </button>
              </div>
              <div class="lg:pr-2">
                <select
                  class="transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  v-model.number="perPage"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            <t-datepicker
              range
              v-model="date"
              placeholder="Filter by Date"
              class="py-2 lg:py-0 lg:w-3/12"
              date-format="Y-m-d"
              user-format="j F, y"
              @change="onDateChange"
            />
          </div>

          <!-- Table Data -->
          <div class="pt-4">
            <div>
              <div class="flex flex-col">
                <div
                  class="flex justify-between pb-2"
                  v-for="(trans, key) in allTransaction.data"
                  :key="key"
                >
                  <div class="flex flex-row">
                    <div class="bg-custom-color1 rounded-lg p-4">
                      <div class="text-white">
                        <swap-horizontal></swap-horizontal>
                      </div>
                    </div>
                    <div class="flex flex-col pl-2 py-1">
                      <span class="text">
                        {{ trans.order_code }}
                      </span>
                      <div class="flex flex-row text-xs">
                        <span>
                          Total:
                          {{ trans.order_total }}
                        </span>
                        <span>, Handled by:</span>
                        <span>
                          {{ " " + trans.employee.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-right">{{ trans.order_date }}</span>
                    <span
                      class="text-blue-600 hover:text-blue-400 underline text-right"
                      @click="
                        openReceiptModal(
                          trans.order_code,
                          trans.order_number,
                          trans.details,
                          trans.employee.name,
                          trans.order_date,
                          trans.discount_percentage,
                          trans.discount_value,
                          trans.total_price,
                          trans.cash,
                          trans.change
                        )
                      "
                      >Details</span
                    >
                  </div>
                </div>

                <t-pagination
                  class="mt-2"
                  :total-items="
                    allTransaction.meta.total ? allTransaction.meta.total : 1
                  "
                  :per-page="perPage"
                  :hideEllipsis="true"
                  v-model="currentPage"
                />
              </div>
            </div>
          </div>
          <!-- Table Data -->
        </div>
      </div>

      <!-- Export Modal -->
      <t-modal v-model="exportModal" header="Export">
        <ul class="flex list-none flex-wrap pb-4 flex-row">
          <li class="flex-auto text-center pr-1">
            <a
              class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal border border-black"
              v-on:click="toggleTabs(1)"
              v-bind:class="{
                'text-black text-medium bg-white': openTab !== 1,
                'text-black text-medium bg-custom-color2': openTab === 1,
              }"
            >
              Default
            </a>
          </li>
          <li class="-mb-px last:mr-0 flex-auto text-center pl-1">
            <a
              class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal border border-black"
              v-on:click="toggleTabs(2)"
              v-bind:class="{
                'text-black text-medium bg-white': openTab !== 2,
                'text-black text-medium bg-custom-color2': openTab === 2,
              }"
            >
              Custom
            </a>
          </li>
        </ul>
        <div class="p-3 flex-auto">
          <div class="tab-content tab-space">
            <div
              v-bind:class="{
                hidden: openTab !== 1,
                block: openTab === 1,
              }"
            >
              <span>Export Data</span>
              <select
                class="w-full transition duration-100 ease-in-out border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed "
                v-model="bindExportData.label"
                @change="onBindExportDataRange"
              >
                <option value="">Select Range</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div
              v-bind:class="{
                hidden: openTab !== 2,
                block: openTab === 2,
              }"
            >
              <span>Choose Range</span>
              <t-datepicker
                range
                v-model="bindExportData.date"
                placeholder="Filter by Date"
                class="w-full"
                date-format="Y-m-d"
                user-format="j F, y"
                @change="onBindExportDataDate"
              />
            </div>
          </div>
        </div>
        <template v-slot:footer>
          <div class="flex justify-between">
            <t-button
              variant="editable"
              class="bg-red-500"
              @click="closeExportModal"
              type="button"
            >
              Cancel
            </t-button>
            <t-button
              variant="editable"
              class="bg-custom-color2"
              @click="onExport"
              :disabled="
                openTab == 1 ? !bindExportData.label : bindExportData.date == ''
              "
            >
              <span class="text-col">Export</span>
            </t-button>
          </div>
        </template>
      </t-modal>

      <!-- Receipt Modal -->
      <t-modal class="no-print" v-model="receiptModal" hideCloseButton:true>
        <div id="printReceipt" ref="printReceipt">
          <div class="flex justify-center text-center flex-col">
            <img
              class="h-12 w-12 mx-auto"
              src="~@/assets/small_ico.jpg"
              alt="logo"
            />
            <div class="text-xl">Toko Commando Military</div>
            <span class="text-md">{{ orderCode }}</span>
            <span class="text-sm">no antrian: {{ orderNumber }}</span>
            <div class="flex justify-between">
              <span class="text-sm">Cashier: {{ cashierName }}</span>
              <span class="text-sm">{{ orderDate }}</span>
            </div>
            <hr class="my-1" />
          </div>
          <t-table :headers="headers" :data="transDetails" variant="receipt">
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
                  {{ props.row.menu.name }}
                  <br />
                  {{ props.row.price }}
                </td>
                <td :class="props.tdClass">
                  {{ props.row.qty }}
                </td>
                <td :class="[props.tdClass, 'text-right']">
                  {{ props.row.price * props.row.qty }}
                </td>
              </tr>
            </template>
          </t-table>
          <hr class="my-1" />
          <div class="flex flex-col">
            <div class="flex justify-between">
              <span class="text-sm">Total Item </span>
              <span class="text-sm">{{ totalItem }} item</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm">Subtotal</span>
              <span class="text-sm">{{ subSubTotal }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs">Discount </span>
              <span class="text-xs"
                >{{ discountPercentage }} % / Rp.{{
                  discountValue | formatRupiah
                }}
              </span>
            </div>
            <hr class="my-1" />
            <div class="flex justify-between">
              <span>Total</span>
              <span>{{ total | formatRupiah }}</span>
            </div>
            <div class="flex justify-between">
              <span>Cash</span>
              <span>{{ cash | formatRupiah }}</span>
            </div>
            <hr class="my-1" />
            <div class="flex justify-between">
              <span>Change</span>
              <span>{{ change | formatRupiah }}</span>
            </div>
          </div>
          <div class="no-print pt-1">
            <t-button
              variant="editable"
              class="bg-custom-color2 text-black w-full font-medium mr-1"
              @click="printReceipt"
            >
              Print Receipt
            </t-button>
          </div>
          <div class="no-print pt-1">
            <t-button
              variant="editable"
              class="bg-red-500 text-black w-full font-medium mr-1"
              @click="closeReceiptModal"
            >
              Close
            </t-button>
          </div>
        </div>
      </t-modal>
      <!-- Receipt Modal -->
    </div>
    <div id="printArea"></div>
  </dashboard-layouts>
</template>

<script>
import { mapActions, mapState } from "vuex";
import DashboardLayouts from "../../components/DashboardLayouts.vue";
import BarChart from "../../components/BarChart.vue";
import LineChart from "../../components/LineChart.vue";
import CloseThick from "vue-material-design-icons/CloseThick";
import Magnify from "vue-material-design-icons/Magnify";
import SwapHorizontal from "vue-material-design-icons/SwapHorizontal";

export default {
  name: "TransactionReport",
  components: {
    DashboardLayouts,
    BarChart,
    LineChart,
    CloseThick,
    Magnify,
    SwapHorizontal,
  },
  data: () => ({
    //pagination
    currentPage: 1,
    perPage: 5,

    //export modal
    exportModal: null,
    bindExportData: {
      label: "",
      date: "",
      fromDate: "",
      toDate: "",
      data: [],
    },

    //openTab
    openTab: 1,

    //receipt modal
    receiptModal: null,
    orderCode: null,
    orderNumber: null,
    transDetails: null,
    cashierName: "",
    orderDate: null,
    discountPercentage: 0,
    discountValue: 0,
    totalItem: 0,
    subTotal: 0,
    subSubTotal: 0,
    total: 0,
    cash: 0,
    change: 0,

    //table header
    headers: [
      {
        value: "name",
        text: "Name",
      },
      {
        value: "qty",
        text: "Qty",
      },
      {
        value: "subtotal",
        text: "Subtotal",
      },
    ],

    //search and filter
    date: "",
    filter: "",

    //chart data
    chartData: null,
    lineChartData: "Daily",
    totalIncome: 0,
    totalTrans: 0,

    //daily chart data
    dailyCount: 0,
    dailyTotal: 0,
    dailyData: {
      labels: [],
      datasets: [
        {
          label: "Data",
          backgroundColor: "rgba(116, 198, 157, 0.5)",
          borderColor: "#081c16",
          data: [],
        },
      ],
    },

    //weekly chartdata
    weeklyTotal: 0,
    weeklyCount: 0,
    weeklyData: {
      labels: [],
      datasets: [
        {
          label: "Data",
          backgroundColor: "rgba(116, 198, 157, 0.5)",
          borderColor: "#52b788",
          data: [],
          fill: true,
          pointBackgroundColor: "#fff",
          radius: 8,
          interaction: {
            intersect: false,
          },
        },
      ],
    },

    //monthly chart data
    monthlyTotal: 0,
    monthlyCount: 0,
    monthlyData: {
      labels: [],
      datasets: [
        {
          label: "Data",
          backgroundColor: "rgba(116, 198, 157, 0.5)",
          borderColor: "#52b788",
          data: [],
          fill: true,
          pointBackgroundColor: "#fff",
          radius: 8,
          interaction: {
            intersect: false,
          },
        },
      ],
    },

    //yearly chart data
    yearlyData: {
      labels: [],
      datasets: [
        {
          label: "Data",
          backgroundColor: "rgba(116, 198, 157, 0.5)",
          borderColor: "#52b788",
          data: [],
          fill: true,
          pointBackgroundColor: "#fff",
          radius: 8,
          interaction: {
            intersect: false,
          },
        },
      ],
    },

    //chart data options
    options: {
      responsive: true,
      maintainAspectRatio: false,
      base: 0,
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  }),
  computed: {
    ...mapState("report", [
      "allTransaction",
      "dailyReport",
      "weeklyReport",
      "monthlyReport",
      "yearlyReport",
      "exportData",
      "exportCustom",
    ]),
    checkDate() {
      return this.date;
    },
  },
  watch: {
    checkDate(date) {
      if (date == "") {
        this.clearDate();
      }
    },
    currentPage(newVal) {
      this.getAllTransaction({
        page: newVal,
        per_page: this.perPage,
        filter: this.filter,
        fromdate: this.date[0],
        todate: this.date[1],
      });
    },
    perPage(newVal) {
      this.currentPage = 1;
      this.getAllTransaction({
        page: this.currentPage,
        per_page: newVal,
        filter: this.filter,
        fromdate: this.date[0],
        todate: this.date[1],
      });
    },
    allTransaction(newVal) {
      if (newVal.data.length == 0) {
        this.$toast.error("Data not Found!", {
          duration: 500,
        });
      }
    },
  },
  async mounted() {
    await this.fetchData();
    this.chartData = this.dailyData;
    await this.dailyReportChart();
    this.totalIncome = this.dailyTotal;
    this.totalTrans = this.dailyCount;
  },
  methods: {
    ...mapActions("report", [
      "getAllTransaction",
      "getDailyReport",
      "getWeeklyReport",
      "getMonthlyReport",
      "getYearlyReport",
      "fillExportData",
      "getExportCustom",
    ]),

    async fetchData() {
      this.getAllTransaction({
        page: this.currentPage,
        per_page: this.perPage,
        filter: this.filter,
      });
      await this.getDailyReport();
      await this.getWeeklyReport();
      await this.getMonthlyReport();
      await this.getYearlyReport();
    },

    clearDate() {
      this.onSearch();
    },

    onDateChange() {
      this.currentPage = 1;
      this.getAllTransaction({
        page: this.currentPage,
        per_page: this.perPage,
        filter: this.filter,
        fromdate: this.date[0],
        todate: this.date[1],
      });
    },

    onSearch() {
      this.currentPage = 1;
      this.getAllTransaction({
        page: this.currentPage,
        per_page: this.perPage,
        filter: this.filter,
        fromdate: this.date[0],
        todate: this.date[1],
      });
    },

    clearSearch() {
      this.filter = "";
      this.onSearch();
    },

    openReceiptModal(
      ocode,
      onumb,
      detail,
      ename,
      odate,
      dpercent,
      dvalue,
      total,
      cash,
      change
    ) {
      this.orderCode = ocode;
      this.orderNumber = onumb;
      this.transDetails = detail;
      this.cashierName = ename;
      this.orderDate = odate;
      this.totalItem = 0;
      this.subTotal = 0;
      this.subSubTotal = 0;
      this.transDetails.forEach((value) => {
        this.totalItem += value.qty;
        this.subTotal = value.price * value.qty;
        this.subSubTotal += this.subTotal;
      });
      this.discount = this.transDetails.discount;
      this.discountPercentage = dpercent;
      this.discountValue = dvalue;
      this.total = total;
      this.cash = cash;
      this.change = change;
      this.receiptModal = true;
    },

    closeReceiptModal() {
      this.receiptModal = false;
    },

    toggleTabs: function(tabNumber) {
      this.openTab = tabNumber;
      if (this.openTab == 1) {
        this.bindExportData.date = "";
      }
      if (this.openTab == 2) {
        this.bindExportData.data = "";
        this.bindExportData.label = "";
      }
    },

    openExportModal() {
      this.bindExportData.data = "";
      this.bindExportData.label = "";
      this.bindExportData.date = "";
      this.exportModal = true;
    },

    closeExportModal() {
      this.bindExportData.data = "";
      this.bindExportData.label = "";
      this.bindExportData.date = "";
      this.exportModal = false;
    },

    async onExport() {
      if (this.bindExportData.date) {
        this.bindExportData.label = "Custom";
        if (this.bindExportData.date.length == 1) {
          await this.getExportCustom({
            fromdate: this.bindExportData.fromDate,
          });
        }
        if (this.bindExportData.date.length > 1) {
          await this.getExportCustom({
            fromdate: this.bindExportData.fromDate,
            todate: this.bindExportData.toDate,
          });
        }
        this.bindExportData.data = this.exportCustom.data;
      }
      await this.fillExportData({
        data: this.bindExportData,
      });
      this.$router.push("/ExportReport");
    },

    onBindExportDataDate() {
      if (this.bindExportData.date.length == 1) {
        this.bindExportData.fromDate = this.bindExportData.date[0];
      }
      if (this.bindExportData.date.length > 1) {
        this.bindExportData.fromDate = this.bindExportData.date[0];
        this.bindExportData.toDate = this.bindExportData.date[1];
      }
    },

    onBindExportDataRange() {
      if (this.bindExportData.label == "Daily") {
        this.bindExportData.data = this.dailyReport;
      }
      if (this.bindExportData.label == "Weekly") {
        this.bindExportData.data = this.weeklyReport;
      }
      if (this.bindExportData.label == "Monthly") {
        this.bindExportData.data = this.monthlyReport;
      }
      if (this.bindExportData.label == "Yearly") {
        this.bindExportData.data = this.yearlyReport;
      }
    },

    async printReceipt() {
      let printContent = this.$refs.printReceipt.innerHTML;
      const printArea = document.getElementById("printArea");

      printArea.innerHTML = printContent;
      window.print();
      printArea.innerHTML = "";
      await this.closeReceiptModal();
    },

    async onLineChartDataChange() {
      if (this.lineChartData == "Daily") {
        this.chartData = this.dailyData;
        await this.dailyReportChart();
        this.totalIncome = this.dailyTotal;
        this.totalTrans = this.dailyCount;
      }
      if (this.lineChartData == "Weekly") {
        this.chartData = this.weeklyData;
        await this.weeklyReportChart();
        this.totalIncome = this.weeklyTotal;
        this.totalTrans = this.weeklyCount;
      }
      if (this.lineChartData == "Monthly") {
        this.chartData = this.monthlyData;
        await this.monthlyReportChart();
        this.totalIncome = this.monthlyTotal;
        this.totalTrans = this.monthlyCount;
      }
      if (this.lineChartData == "Yearly") {
        this.chartData = this.yearlyData;
        await this.yearlyReportChart();
        this.totalIncome = this.yearlyTotal;
        this.totalTrans = this.yearlyCount;
      }
    },

    dailyReportChart() {
      this.dailyCount = 0;
      this.dailyTotal = 0;
      this.dailyReport.data.forEach((value, index) => {
        this.dailyTotal += parseInt(value.total_price);
        this.dailyCount = index + 1;
      });
      const dailyLabel = this.dailyReport.data.map((value) => {
        return value.order_code;
      });
      this.dailyData.labels = dailyLabel;
      const dailyData = this.dailyReport.data.map((value) => {
        return value.total_price;
      });
      this.dailyData.datasets[0].data = dailyData;
    },

    weeklyReportChart() {
      this.weeklyCount = 0;
      this.weeklyTotal = 0;
      this.weeklyReport.data.forEach((value) => {
        this.weeklyCount += parseInt(value.total_transaction);
        this.weeklyTotal += parseInt(value.order_total);
      });
      const weeklyLabels = this.weeklyReport.data.map((value) => {
        return value.order_date;
      });
      this.weeklyData.labels = weeklyLabels;
      const weeklyData = this.weeklyReport.data.map((value) => {
        return value.order_total;
      });
      this.weeklyData.datasets[0].data = weeklyData;
    },

    monthlyReportChart() {
      this.monthlyCount = 0;
      this.monthlyTotal = 0;
      this.monthlyReport.data.forEach((value) => {
        this.monthlyCount += parseInt(value.total_transaction);
        this.monthlyTotal += parseInt(value.order_total);
      });
      const monthlyLabels = this.monthlyReport.data.map((value) => {
        return value.order_date;
      });
      this.monthlyData.labels = monthlyLabels;
      const monthlyData = this.monthlyReport.data.map((value) => {
        return value.order_total;
      });
      this.monthlyData.datasets[0].data = monthlyData;
    },

    yearlyReportChart() {
      this.yearlyCount = 0;
      this.yearlyTotal = 0;
      this.yearlyReport.data.forEach((value) => {
        this.yearlyCount += parseInt(value.total_transaction);
        this.yearlyTotal += parseInt(value.order_total);
      });
      const yearlyLabels = this.yearlyReport.data.map((value) => {
        return value.month_formatted;
      });
      this.yearlyData.labels = yearlyLabels;
      const yearlyData = this.yearlyReport.data.map((value) => {
        return value.order_total;
      });
      this.yearlyData.datasets[0].data = yearlyData;
    },
  },
};
</script>
