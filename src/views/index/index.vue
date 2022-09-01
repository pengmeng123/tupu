<template>
  <div class="main">
    <div class="content">
      <div class="main-left"></div>
      <div class="main-right">
        <div class="part1">
          <v-chart autoresize class="chart" :option="option" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      option: {
        title: {
          text: "Traffic Sources",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "Direct",
            "Email",
            "Ad Networks",
            "Video Ads",
            "Search Engines",
          ],
        },
        series: [
          {
            name: "Traffic Sources",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "Direct" },
              { value: 310, name: "Email" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
                normal: {
                    fontSize: 300
                }
            }
          },
        ],
      },
    };
  },
};
</script>
<style lang="scss">
.main {
  font-size: 14px;
  height: 100%;
}
.content {
  display: flex;
  height: 100%;
}
.main-left {
  flex: 1;
  background: #999;
}
.main-right {
  width: 500px;
  flex: 0 0 500px;
  background: #eee;
  height: 100%;
}
.part1 {
  height: 500px;
}
</style>
