import { createStore } from "vuex";
import { increment } from "../mutations"

const initialState = {
  count: 0
};

const store = createStore({
  state: initialState,
  mutations: {
    increment
  },
});

export default store;
