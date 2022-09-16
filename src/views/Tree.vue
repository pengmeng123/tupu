<template>
  <div class="about">
    <Tree :isSelect="isSelect" :data="treeData" @node-click="handle" @change="loadData" />
  </div>
</template>

<script>
import Tree from '@/components/tree/index.vue';
import json from '@/components/tree/config';

export default {
  components: { Tree },
  data() {
    return {
      treeData: [],
      isSelect: false,
      defaultProps: {
        children: 'children',
        label: 'title',
        key: 'id',
      },
    }
  },
  created() {
    this.treeData = json.data.list
  },
  methods: {
    handle(node) {
      console.log('点击节点 Data : ', node)
    },
    loadData(treeNode) {
      console.log(treeNode)
      // eg: 动态更新子节点
      // treeNode.children = JSON.parse(JSON.stringify(json.data.list))
      // this.treeData = [...this.treeData]
    },
  },
}
</script>