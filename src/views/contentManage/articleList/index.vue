<template>
  <div class="articleList">
    <el-card class="card">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <el-form ref="form" :model="searchArticleForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="作者">
              <el-input v-model="searchArticleForm.name" placeholder="作者" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标题">
              <el-input v-model="searchArticleForm.title" placeholder="标题" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="编辑类型">
              <el-select v-model="searchArticleForm.editorType" placeholder="编辑类型" size="small" clearable>
                <el-option label="富文本" :value="0" />
                <el-option label="markdown" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="50">
          <el-col :span="10" :offset="17">
            <el-button type="primary" @click="reset">重置</el-button>
            <el-button type="primary" @click="searchArticle">搜索</el-button>
          </el-col>

        </el-row>
      </el-form>

    </el-card>
    <el-card class="card">
      <div slot="header">
        <!-- 文章列表 -->
        <el-button type="primary">新增</el-button>

      </div>
      <el-table v-loading="loading" :data="articleList" border style="width: 100%">
        <el-table-column type="index" label="#" fixed="left" />
        <el-table-column align="center" label="文章标题" width="250">
          <template slot-scope="scope">
            <span> {{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="展示图片" align="center" width="200">
          <template slot-scope="scope">
            <img :src="scope.row.coverImg" class="table_img" style="width:50px;height:50px">
          </template>
        </el-table-column>
        <el-table-column align="center" label="添加时间" prop="createTime" width="300" />
        <el-table-column align="center" label="文章作者" prop="author" width="200" />
        <el-table-column align="center" label="文章是否展示" width="200">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow" size="small" :active-value="1" :inactive-value="0"
              @change="switchCode(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="内容" prop="editorType" width="200">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.editorType === 0">富文本框</el-tag>
            <el-tag v-else-if="scope.row.editorType === 1">Markdown</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button style="margin-right: 10px" type="text" size="small" @click="goEdit(scope.row)">
              <i style="margin-right: 6px" class="el-icon-view" />编辑文章
            </el-button>
            <el-button type="text" size="small" @click="goDelete(scope.row)">
              <span style="color: red">删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </el-card>
  </div>
</template>

<script>
import { findArticles, changeShowStatus } from '@/api/contentManage/articleList'
import mix from '@/mixins/index'
export default {
    name: '',
    mixins: [mix],
    data() {
        return {
            searchArticleForm: {},
            articleList: [],
            loading: ''
        }
    },
    mounted() {
        this.getArticleList()
    },
    methods: {
        reset() {
            this.search = this.$options.data().search
            this.searchForm = this.$options.data().searchForm
        },
        searchArticle() {
            this.page.currentPage = 1
            this.searchForm = Object.assign({}, this.search)
            this.getArticleList()
        },
        switchCode(row) {
            console.log('row.isShow: ', row.isShow)
            // 记录修改之前的状态,防止修改失败
            const tempStates = row.isShow === 0 ? 1 : 0
            changeShowStatus({
                id: row.id,
                isShow: row.isShow
            })
                .then((res) => {
                    console.log(res)
                    if (res.success) {
                        this.$message.success('修改状态成功')
                    } else {
                        this.$message.success('修改状态失败')
                        row.isShow = tempStates
                    }
                })
                .catch((res) => {
                    this.$message.success('修改状态失败')
                    row.isShow = tempStates
                })
        },
        goEdit(value) {
            console.log('value: ', value)
        },
        goDelete(value) {
            console.log('value: ', value)
        },
        handleSizeChange(value) {
            console.log('value: ', value)
            this.page.size = value
            this.page.currentPage = 1
            this.getArticleList()
        },
        handleCurrentChange(value) {
            console.log(value)
            this.page.currentPage = value
            this.getArticleList()
        },
        getArticleList() {
            this.loading = true
            var params = {}
            for (var key in this.searchForm) {
                if (this.searchForm[key] || this.searchForm[key] + '' === '0') {
                    params[key] = this.searchForm[key]
                }
            }
            findArticles(this.page.currentPage, this.page.size).then(res => {
                if (res.success) {
                    this.articleList = res.data.rows
                    this.page.total = res.data.total
                    console.log('this.articleList: ', this.articleList)
                } else {
                    this.$message.error('获取列表失败')
                }
                this.loading = false
            })
        }
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
