import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "echarts";
import Echarts from "vue-echarts";
import Vant from "vant";
import websocket from "vue-native-websocket";
import service from "./service";
import "vant/lib/index.css";

// 根据屏幕变化设置rem
import "@/utils/refreshRem.js";
// 重置样式
import "@/assets/style/reset.scss";

Vue.use(websocket, "ws://10.10.200.96:9090", {
  // 这里要填的是服务器的地址，可以换一个在线服务器wss://echo.websocket.org
  reconnection: true, // (Boolean)是否自动重连，默认false
  // connectManually: true,
  reconnectionAttempts: Infinity, // 重连次数
  reconnectionDelay: 3000, // 再次重连等待时常(1000)
});

Vue.config.productionTip = false;
Vue.component("v-chart", Echarts);
Vue.use(Vant);
Vue.prototype.$service = service

window.myApp = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
