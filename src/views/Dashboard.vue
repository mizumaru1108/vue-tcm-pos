<template>
  <dashboard-layouts>
    <div class="flex justify-center flex-grow h-full flex-col lg:flex-row">
      <div class="w-full lg:w-6/12 p-1 ">
        <!-- daily & transaction -->
        <div class="flex flex-col lg:flex-row flex-wrap">
          <div class="w-full mb-2 lg:w-6/12 lg:pr-1">
            <div class="flex bg-white rounded-xl shadow p-2">
              <div class="rounded-xl bg-custom-color1 p-5">
                <span class="text-white">Rp</span>
              </div>
              <div class="flex flex-col py-3 px-2">
                <span class="text-sm">Daily Income</span>
                <span class="text-sm"
                  >Rp.{{
                    dashboardDailyReport.order_total
                      ? dashboardDailyReport.order_total
                      : '0'
                  }}</span
                >
              </div>
            </div>
          </div>
          <div class="w-full lg:w-6/12 pb-3 lg:pl-1 lg:pb-0">
            <div class="flex bg-white rounded-xl shadow p-2">
              <div class="rounded-xl bg-custom-color1 p-5">
                <div class="text-white">
                  <swap-horizontal></swap-horizontal>
                </div>
              </div>
              <div class="flex flex-col py-3 px-2">
                <span class="text-sm">Daily Transacion</span>
                <span class="text-sm"
                  >{{
                    dashboardDailyReport.total_transaction
                      ? dashboardDailyReport.total_transaction
                      : 0
                  }}
                  x Transaction</span
                >
              </div>
            </div>
          </div>

          <!-- Weekly income & transaction -->
          <div class="w-full bg-white rounded-xl shadow px-4 py-3">
            <div class="flex justify-between pt-2">
              <span class="text-xl">Weekly Income </span>
              <span class="text-xl">from {{ weeklyCount }} x Transactions</span>
            </div>

            <bar-chart
              :chartdata="weeklyData"
              :options="options"
              class="pt-9 pb-5"
            />
          </div>
        </div>
      </div>
      <div class="w-full lg:w-6/12 p-1">
        <div class="bg-white rounded-xl shadow p-5 h-full">
          <div class="flex flex-col text-center">
            <span class="text-2xl pb-1">Yearly Income</span>
            <span class="text-5xl pb-3">
              Rp.
              {{
                dashboardYearlyReport.order_total
                  ? dashboardYearlyReport.order_total
                  : '0'
              }},-
            </span>
            <span class="text-md text-gray-500 pb-5"
              >{{ dashboardYearlyReport.first_trans }} -
              {{ dashboardYearlyReport.last_trans }}</span
            >
            <hr />
          </div>
          <div class="flex flex-col">
            <div class="flex justify-between py-2">
              <span>Latest Transaction</span>
              <button
                @click="onMore"
                class="block px-2 transition duration-100 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed bg-custom-color2 border border-black"
              >
                More
              </button>
            </div>

            <div
              v-for="(recent, key) in dashboardRecentTransaction.data"
              class="flex justify-between pb-2"
              :key="key"
            >
              <div class="flex justify-between pb-2">
                <div class="flex flex-row">
                  <div class="bg-custom-color1 rounded-lg p-4">
                    <div class="text-white">
                      <swap-horizontal></swap-horizontal>
                    </div>
                  </div>
                  <div class="flex flex-col pl-2 py-1">
                    <span class="text">
                      {{ recent.order_code }}
                    </span>
                    <div class="flex flex-row text-xs">
                      <span> Total:{{ recent.order_total }} </span>
                      <span>, Handled by:</span>
                      <span> {{ ' ' + recent.employee.name }}</span>
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Counter Start -->
    <!-- <div class="flex justify-center flex-grow h-full flex-col lg:flex-row">
      <div class="w-full p-1">
        <div class="flex flex-col lg:flex-row flex-wrap">
          <div class="w-full mb-2 lg:w-6/12 lg:pr-1">
            <div class="flex bg-white rounded-xl shadow p-2">
              <div class="flex flex-col py-3 px-2">
                <t-button
                  fixedClasses="h-7 w-7 rounded-full"
                  class="flex justify-center align-middle"
                  @click="incerementDataCount"
                >
                  <icon-plus class="w-6 h-6" />
                </t-button>
                <span class="text-sm">{{ dataCount.inct }}</span>
              </div>
            </div>
          </div>
          <div class="w-full mb-2 lg:w-6/12 lg:pr-1">
            <div class="flex bg-white rounded-xl shadow p-2">
              <div class="flex flex-col py-3 px-2">
                <t-button
                  fixedClasses="h-7 w-7 rounded-full"
                  class="flex justify-center align-middle"
                  @click="decrementDataCount"
                >
                  <icon-minus class="w-6 h-6" />
                </t-button>
                <span class="text-sm">{{ dataCount.decrement }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center flex-grow h-full flex-col lg:flex-row">
      <div class="w-full p-1">
        <div class="flex flex-col lg:flex-row flex-wrap">
          <div class="w-full mb-2 lg:w-6/12 lg:pr-1">
            <div class="flex bg-white rounded-xl shadow p-2">
              <div class="flex flex-col py-3 px-2">
                <t-button
                  fixedClasses="h-7 w-7 rounded-full"
                  class="flex justify-center align-middle"
                  @click="multiplyDataCount"
                >
                  <icon-close class="w-6 h-6" />
                </t-button>
                <span class="text-sm">{{ dataCount.multiply }}</span>
              </div>
            </div>
          </div>
          <div class="w-full mb-2 lg:w-6/12 lg:pr-1">
            <div class="flex bg-white rounded-xl shadow p-2">
              <div class="flex flex-col py-3 px-2">
                <t-button
                  fixedClasses="h-7 w-7 rounded-full"
                  class="flex justify-center align-middle"
                  @click="divideDataCount"
                >
                  <icon-division class="w-6 h-6" />
                </t-button>
                <span class="text-sm">{{ dataCount.divide }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- Counter End -->
  </dashboard-layouts>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import BarChart from '../components/BarChart.vue';
import DashboardLayouts from '../components/DashboardLayouts.vue';
import SwapHorizontal from 'vue-material-design-icons/SwapHorizontal';

//
// import IconPlus from 'vue-material-design-icons/Plus';
// import IconMinus from 'vue-material-design-icons/Minus';
// import IconClose from 'vue-material-design-icons/Close';
// import IconDivision from 'vue-material-design-icons/Division';

export default {
  name: 'Home',
  components: {
    DashboardLayouts,
    BarChart,
    SwapHorizontal,
    // IconPlus,
    // IconMinus,
    // IconClose,
    // IconDivision,
  },
  data: () => ({
    weeklyCount: 0,
    weeklyData: {
      labels: [],
      datasets: [
        {
          label: 'Data',
          backgroundColor: '#94D2BD',
          data: [],
        },
      ],
    },
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
    ...mapState('report', [
      'dashboardDailyReport',
      'dashboardWeeklyReport',
      'dashboardYearlyReport',
      'dashboardRecentTransaction',
    ]),
    ...mapState('counter', ['dataCount']),
  },
  async mounted() {
    await this.fetchData();
    this.getDashboardDailyReport();
    this.getDashboardYearlyReport();
    this.getDashboardRecentTransaction();
  },
  methods: {
    ...mapActions('report', [
      'getDashboardDailyReport',
      'getDashboardWeeklyReport',
      'getDashboardYearlyReport',
      'getDashboardRecentTransaction',
    ]),

    ...mapActions('counter', [
      'onIncrementDataCount',
      'onDecrementDataCount',
      'onMultiplyDataCount',
      'onDivideDataCount',
      'onSetCount',
    ]),

    async fetchData() {
      await this.getDashboardWeeklyReport();
      this.weeklyReportChart();
    },

    weeklyReportChart() {
      const weeklyLabels = this.dashboardWeeklyReport.data.map((value) => {
        return value.order_date;
      });
      this.weeklyData.labels = weeklyLabels;
      const weeklyData = this.dashboardWeeklyReport.data.map((value) => {
        return value.order_total;
      });
      this.dashboardWeeklyReport.data.forEach((value) => {
        this.weeklyCount += value.total_transaction;
      });
      this.weeklyData.datasets[0].data = weeklyData;
    },

    onMore() {
      this.$router.push('/transaction-report');
    },

    incerementDataCount() {
      this.onIncrementDataCount();
    },

    decrementDataCount() {
      this.onDecrementDataCount();
    },

    multiplyDataCount() {
      this.onMultiplyDataCount();
    },

    divideDataCount() {
      this.onDivideDataCount();
    },

    countDataCount() {
      const inct = parseInt(this.dataCount.inct);
      const count = parseInt(this.dataCount.count);
      this.onSetCount(count + inct + 1);
    },
  },
};
</script>
s
