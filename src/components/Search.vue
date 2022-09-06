<template>
  <div style="overflow-y: auto; height: 100vh">
    <input type="text" v-model="message" />
    <p v-show="visible">text-------</p>
    <button @click="showText">show text</button>
    <button><router-link to="/detail" replace>go Detail</router-link></button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: undefined,
      visible: false,
    };
  },
  activated() {
    console.log("r-----", this.message, this.visible);
  },
  mounted() {
    console.log("mount000");
  },
  methods: {
    showText() {
      this.visible = !this.visible;
    },
    goDetail() {
      this.$router.push("/detail");
    },
  },
};
</script>
