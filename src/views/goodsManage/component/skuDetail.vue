<template>
  <div>
    <el-dialog title="撒打算" :visible.sync="dialogVisible" width="width">
      <p>所谓</p>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            dialogVisible: false
        }
    },
    methods: {
        openSKuDetail(value) {
            console.log('value: ', value)
            this.dialogVisible = true
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
