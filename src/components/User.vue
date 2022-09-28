<template>
  <div>
    user-
    <button @click="goBtn">go btn</button>
  </div>
</template>
<script>
export default {
  mounted() {
    this.fetchAreaList();
    this.fetchFieldsShow();
  },
  methods: {
    fetchFieldsShow() {
      return this.$service.user
        .getFieldsShow({
          fieldShow: "Contact",
        })
        .then((r) => {
          console.log("fields-show-----", r);
        });
    },
    fetchAreaList() {
      return this.$service.user
        .getAreaList({
          a: 1,
        })
        .then((r) => {
          console.log(r);
        });
    },
    goBtn() {
      console.log("goBtn------");
      this.$router.push("/test");
    },
  },
};
</script>
