<template>
  <el-collapse v-model="activeNames" class="collapse">
    <el-collapse-item :title="title" name="1">
      <!-- slot 占位标签 会被替换 -->
      <slot />
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
    props: {
        /* title本身返回空字符串  接收外部传进来的值 渲染到页面 */
        title: {
            type: String,
            default: function() {
                return ''
            }
        }
    },
    data() {
        return {
            activeNames: []
        }
    },
    created() {},
    mounted() {},
    methods: {}
}
</script>

<style scoped lang="scss">
.collapse {
  // margin: 0 30px;
  box-sizing: border-box;
  padding: 10px;
  background-color: white;
}
</style>
