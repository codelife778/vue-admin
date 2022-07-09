<template>
  <div class="articleList">
    <el-card class="card">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <el-form ref="form" :model="searchArticleForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="作者">
              <el-input v-model="searchArticleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作者">
              <el-input v-model="searchArticleForm.name" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            searchArticleForm: {}
        }
    },
    methods: {
        onSubmit() {}
    }
}
</script>

<style lang="scss" scoped>
.articleList {
  .card {
    margin: 30px;
  }
}
</style>
