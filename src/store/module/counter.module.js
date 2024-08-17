const state = {
  dataCount: {
    inct: 1,
    decrement: 1000,
    multiply: 2,
    divide: 10000,
    count: 0,
  },
};
const getters = {};

const mutations = {
  setIncrement(state, payload) {
    state.dataCount.inct = payload;
  },
  setDecrement(state, payload) {
    state.dataCount.decrement = payload;
  },
  setMultiply(state, payload) {
    state.dataCount.multiply = payload;
  },
  setDivide(state, payload) {
    state.dataCount.divide = payload;
  },
  setCount(state, payload) {
    state.dataCount.count = payload;
  },
};

const actions = {
  onIncrementDataCount({ commit, state }) {
    const value = state.dataCount.inct;
    const newValue = value + 1;
    // set value
    commit('setIncrement', newValue);
  },
  onDecrementDataCount({ commit, state }) {
    // get value dataCount.decrement
    const value = state.dataCount.decrement;
    const newValue = value - 1;
    // set value
    commit('setDecrement', newValue);
  },
  onMultiplyDataCount({ commit, state }) {
    const value = state.dataCount.multiply;
    // set value
    commit('setMultiply', value * 2);
  },
  onDivideDataCount({ commit, state }) {
    // get value dataCount.divide
    const value = state.dataCount.divide;
    // set value
    commit('setDivide', value / 2);
  },
  onSetCount({ commit }, payload) {
    // check payload number
    if (isNaN(payload)) {
      // set value
      commit('setCount', 0);
    } else {
      // set value
      commit('setCount', payload);
    }
  },
};
const counter = {
  state,
  getters,
  actions,
  mutations,
  namespaced: true,
};

export default counter;
