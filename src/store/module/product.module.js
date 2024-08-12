import axios from 'axios';
const state = {
  productList: {
    data: [],
  },
  productData: {},
  allProduct: [],
  errorData: {
    errors: [],
  },
};
const getters = {};
const mutations = {
  setProductList(state, payload) {
    state.productList = payload;
  },
  setProduct(state, payload) {
    state.productData = payload;
  },
  setShowAllProduct(state, payload) {
    state.allProduct = payload;
  },
  setError(state, payload) {
    state.errorData = payload;
  },
};
const actions = {
  clearError(context) {
    const payload = {
      errorData: {
        errors: [],
      },
    };
    context.commit('setError', payload);
  },

  async getAllProductList(
    context,
    { page, per_page, filter } = {
      page: 1,
      per_page: null,
      filter: '',
    },
  ) {
    try {
      const params = new URLSearchParams();
      if (page != null) {
        params.append('page', page);
      }
      if (per_page != null) {
        params.append('per_page', per_page);
      }
      if (filter != null && filter != '') {
        params.append('filter', filter);
      }
      const response = await axios.get(
        `${process.env.VUE_APP_BASE_URL}/api/product?${params}`,
      );
      context.commit('setProductList', response.data);
    } catch (error) {
      let errorMessage = '';
      if (error.response) {
        errorMessage = error.response.data.message;
      }
      if (error.response.status >= 400) {
        console.error('masuk error', error.response);
        context.commit('setError', error.response.data);
        throw new Error(errorMessage);
      }
      return error.message;
    }
  },

  async getProduct(context, { id }) {
    try {
      const response = await axios.get(
        `${process.env.VUE_APP_BASE_URL}/api/product/${id}`,
      );
      context.commit('setProduct', response.data.data);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  },

  clearProduct(context) {
    context.commit('setProduct', {});
  },

  async createProduct(context, { payload }) {
    try {
      const response = await axios.post(
        `${process.env.VUE_APP_BASE_URL}/api/product`,
        payload,
      );
      context.dispatch('clearProduct');
      return response.data;
    } catch (error) {
      let errorMessage = '';
      if (error.response) {
        errorMessage = error.response.data.zssage;
      }
      if (error.response.status >= 400) {
        context.commit('setError', error.response.data);
        throw new Error(errorMessage);
      }
      return error.message;
    }
  },

  async updateProduct(context, { id, payload }) {
    try {
      const response = await axios.post(
        `${process.env.VUE_APP_BASE_URL}/api/product/${id}`,
        payload,
      );
      context.dispatch('clearProduct');
      return response.data;
    } catch (error) {
      let errorMessage = '';
      if (error.response) {
        errorMessage = error.response.data.message;
      }
      if (error.response.status >= 400) {
        context.commit('setError', error.response.data);
        throw new Error(errorMessage);
      }
      return error.message;
    }
  },

  async deleteProduct(context, { id }) {
    try {
      const response = await axios.delete(
        `${process.env.VUE_APP_BASE_URL}/api/product/${id}`,
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  async product(context) {
    try {
      const response = await axios.get(
        `${process.env.VUE_APP_BASE_URL}/api/products`,
      );
      context.commit('setShowAllProduct', response.data.data);
    } catch (error) {
      console.log(error);
    }
  },
};

const product = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default product;
