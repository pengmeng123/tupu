<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <section class="center">
      <div class="message">{{ msg }}</div>
      <div class="input">
        <textarea
          name
          id="text"
          cols="30"
          rows="2"
          v-model.trim="text"
        ></textarea>
        <div><button class="danger" @click="clear">clear</button></div>
        <!-- <div>
          <button class="danger" @click="resetConnect">resetConnect</button>
        </div> -->
        <div>
          <button class="green" :disabled="empty" @click="websocketsend">
            send
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "websocket",

  data() {
    return {
      msg: "",
      text: "",
      empty: true,
      send: true,
    };
  },
  watch: {
    text: function (newValue, oldValue) {
      newValue.length > 0 ? (this.empty = false) : (this.empty = true);
    },
  },
  methods: {
    resetConnect() {
      this.$socket.reconnect();
    },
    clear() {
      this.text = "";
      this.$socket.onclose();
    },
    initWebSocket() {
      console.log("s---", this.$socket);

      //初始化weosocket,这些onopen是一个事件，当
      this.$socket.onopen = this.websocketonopen;
      this.$socket.onerror = this.websocketonerror;
      this.$socket.onmessage = this.websocketonmessage;
      this.$socket.onclose = this.websocketclose;
      console.log(this);
    },
    websocketonopen(e) {
      //  链接ws服务器，e.target.readyState = 0/1/2/3
      //0 CONNECTING ,1 OPEN, 2 CLOSING, 3 CLOSED
      console.log("WebSocket连接成功", e);
    },

    websocketonerror(e) {
      //错误
      console.log("WebSocket连接发生错误");
    },

    websocketonmessage(e) {
      //数据接收
      console.log(JSON.parse(e.data));
      this.msg = "hello world";
    },

    websocketsend(e) {
      //数据发送
      this.$socket.send("some data");
      //   this.$socket.send(JSON.stringify({ test: "www.baidu.com" }));
      //   this.$socket.sendObj({ awesome: "data" });
      // this.$socket.close(1000)
      console.log(this.$socket.readyState); //    当前链接状态 https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket#%E5%B8%B8%E9%87%8F
    },

    websocketclose(e) {
      //关闭链接时触发
      var code = e.code; //  状态码表 https://developer.mozilla.org/zh-CN/docs/Web/API/CloseEvent
      var reason = e.reason;
      var wasClean = e.wasClean;
      console.log(code, reason, wasClean);
    },
  },
  created() {
    this.initWebSocket();
  },
  destoryed() {
    this.$socket.close();
  },
};
</script>
