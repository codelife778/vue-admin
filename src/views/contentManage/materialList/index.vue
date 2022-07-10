<template>
  <div
    v-loading="pageLoading" :element-loading-text="loadingOption.text"
    :element-loading-spinner="loadingOption.spinner" :element-loading-background="loadingOption.background"
    class="category_main">
    <el-card>
      <div slot="header">
        <el-upload
          ref="materialUpload" class="upload-demo"
          action="http://localhost/lejuAdmin/material/uploadFileOssSave" :headers="headers"
          :on-success="handleUploadSucc">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
      <el-row :gutter="20">
        <el-col v-for="item in materialList" :key="item.id" style="margin-bottom: 20px;width:20%">
          <el-card>
            <div slot="header">
              <span class="materil_text"> 创建时间:{{ item.createTime }}</span>
            </div>
            <el-image :preview-src-list="imgList" style="width: 100%; height: 250px" :src="item.ossUrl" alt="" />
            <div class="flexRight">
              <el-button type="danger" size="mini" style="width:90px;margin-top:20px" @click="goDel(item.id)">刪除
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <el-pagination
      :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper" :total="page.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import mix from '@/mixins/index'
import { findMaterialByPage, delMaterial } from '@/api/contentManage/matirialList/index'
export default {
    name: '',
    mixins: [mix],
    data() {
        return {
            materialList: [],
            pageLoading: false,
            imgList: []

        }
    },
    created() {
        this.getMaterialList()
    },
    methods: {
        handleCurrentChange(val) {
            this.page.currentPage = val
            this.getMaterialList()
        },
        handleSizeChange(val) {
            this.page.size = val
            this.page.currentPage = 1
            this.getMaterialList()
        },
        goDel(val) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    delMaterial(val).then(res => {
                        console.log('res: ', res)
                        if (res.success) {
                            this.$message('删除成功')
                        }
                    })
                })
                .catch((rej) => {
                    alert(rej)
                })
        },
        handleUploadSucc(res, file, fileList) {
            if (res.success) {
                this.$refs.materialUpload.clearFiles()
                this.getMaterialList()
            } else {
                this.$message.error('素材上传失败')
            }
        },
        getMaterialList() {
            this.pageLoading = true
            findMaterialByPage(this.page.currentPage, this.page.size).then(res => {
                if (res.success) {
                    this.materialList = res.data.rows
                    this.page.total = res.data.total
                } else {
                    this.$message('获取信息失败')
                }
                this.pageLoading = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
