import { createStore } from "vuex";
import { incrementInitialState, incrementMutation, incrementAction } from "./modules/TestModule";

const testCount = {
  state: () => incrementInitialState,
  mutations: { incrementMutation },
  actions: { incrementAction }
}

const store = createStore({
  modules: {
    testCount: testCount,
  }
});

export default store;
