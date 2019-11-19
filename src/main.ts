import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axiosPlugin from "./plugins/axios";
import "./plugins/element-ui";
import VueCookies from "vue-cookies";

require("promise.prototype.finally").shim();

Vue.config.productionTip = false;

Vue.prototype.$axios = axiosPlugin;

Vue.use(VueCookies);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
