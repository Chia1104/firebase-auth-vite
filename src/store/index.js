import { createStore } from "vuex";
import { testCount } from "./modules/testModule";
import { firebaseModule } from "./modules/firebase";

const store = createStore({
  modules: {
    testCount: testCount,
    firebaseModule: firebaseModule
  }
});

export default store;
