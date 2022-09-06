import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "echarts";
import Echarts from "vue-echarts";
import Vant from "vant";
import "vant/lib/index.css";

// 根据屏幕变化设置rem
import "@/utils/refreshRem.js";
// 重置样式
import "@/assets/style/reset.scss";

Vue.config.productionTip = false;
Vue.component("v-chart", Echarts);
Vue.use(Vant);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
