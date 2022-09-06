<template>
  <div>
    <div>1ssssssssss</div>
    <button @click="goSearch">search page</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: undefined,
    };
  },
  methods: {
    goSearch() {
      this.$router.replace("/search");
    },
  },
};
</script>
