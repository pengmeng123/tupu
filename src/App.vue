<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      _gap_time: null,
      _beforeUnload_time: null
    }
  },
  mounted() {
      window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
      window.addEventListener('unload', e => this.unloadHandler(e))
    },
    destroyed() {
      window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
      window.removeEventListener('unload', e => this.unloadHandler(e))
    },
    methods: {
      beforeunloadHandler(){
        this._beforeUnload_time=new Date().getTime();
      },
      unloadHandler(e){
        this._gap_time=new Date().getTime()-this._beforeUnload_time;
        debugger
        //判断是窗口关闭还是刷新
        if(this._gap_time<=5){

          // ****这里用同步请求，使用await来做
          //如果是登录状态，关闭窗口前，移除用户
          // if(!this.showLoginButton){
          //   $.ajax({
          //     url: '/pictureweb/user/remove',
          //     type: 'get',
          //     async:false, //或false,是否异步
             
          //   })
          // }
          console.log('9----')
          localStorage.setItem('aaaaa', 1)
        }
      },
}
}
</script>

<style lang="scss">
// sssdd
// #app {
//   width: 1920px;
//   height: 1080px;
//   margin: 0 auto;
//   background: #ccc;
// }
</style>
