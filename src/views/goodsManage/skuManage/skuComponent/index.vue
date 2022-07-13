<template>
  <div class="brandDetail_main">

    <el-dialog width="65%" title="品牌详情" :visible.sync="open">

      <el-form ref="form" :rules="rules" :inline="true" class="demo-form-inline" :model="form" label-width="150px">

        <el-form-item size="mini" prop="name" label="品牌名称">
          <el-input v-model="form.name" class="item_input" placeholder="品牌名称" />
        </el-form-item>

        <el-form-item size="mini" label="首字母">
          <el-input v-model="form.firstLetter" class="item_input" placeholder="首字母" />
        </el-form-item>

        <el-form-item size="mini" label="排序">
          <el-input v-model="form.sort" class="item_input" placeholder="排序" />
        </el-form-item>

        <el-form-item size="mini" label="产品数量">
          <el-input v-model="form.productCount" class="item_input" placeholder="产品数量" />
        </el-form-item>

        <br>

        <el-form-item size="mini" label="是否展示">
          <el-switch v-model="form.showStatus" :active-value="1" :inactive-value="0" class="item_input" />
        </el-form-item>

        <el-form-item size="mini" label="是否为品牌制造商">
          <el-switch v-model="form.factoryStatus" :active-value="1" :inactive-value="0" class="item_input" />
        </el-form-item>

        <el-form-item size="mini" label="上传专区大图">
          <el-upload
            class="avatar-uploader" :action="uploadUrl" :headers="headers" :show-file-list="false"
            :on-success="handleBigPicSuccess">
            <img v-if="form.bigPic" :src="form.bigPic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item size="mini" label="上传Logo">
          <el-upload
            class="avatar-uploader" :action="uploadUrl" :headers="headers" :show-file-list="false"
            :on-success="handleLogoSuccess">
            <img v-if="form.logo" :src="form.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button :loading="couldNext" type="primary" @click="onSubmit">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import mixin from '@/mixins/index'
import skuManageApi from '@/api/goodsManage/skuManage/index'
export default {
    name: 'BrandDetail',
    mixins: [mixin],
    data() {
        return {
            couldNext: false,
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                    // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
                ]
            },
            open: false,
            form: {
                detailObj: '', // 编辑时获取的Obj
                bigPic: '', // 大图专区
                logo: '', // logo
                name: '', // 名称
                firstLetter: '', // 首字母
                sort: '', // 排序
                productCount: '', // 产品数量
                productCommentCount: '', // 产品评价熟料
                showStatus: 1, // 是否展示
                factoryStatus: 1 // 是否品牌制造商
            }
        }
    },
    methods: {
        openDetail(item) {
            this.detailObj = item
            this.open = true
            console.log(this.detailObj)
            if (this.detailObj) {
                this.form = item
            } else {
                this.form = this.$options.data().form
            }
        },
        // 大图上传成功
        handleBigPicSuccess(res, file) {
            this.form.bigPic = res.data.fileUrl
        },
        // logo上传成功
        handleLogoSuccess(res, file) {
            this.form.logo = res.data.fileUrl
        },
        onSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$confirm(
                        `是否确认${this.detailObj ? '修改' : '新增'}品牌?`,
                        '提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }
                    )
                        .then(() => {
                            // 填写确定后的业务逻辑
                            this.couldNext = true
                            if (!this.detailObj) {
                                // 新增品牌时的逻辑
                                skuManageApi.addBrand({ ...this.form }).then((res) => {
                                    if (res.success) {
                                        this.open = false
                                        this.$emit('success')
                                        // form表单重置
                                        this.form = this.$options.data().form
                                    } else {
                                        this.$message.error('添加失败')
                                    }
                                    this.couldNext = false
                                })
                            } else {
                                skuManageApi.updateBrand({ ...this.form }).then((res) => {
                                    if (res.success) {
                                        this.open = false
                                        this.$emit('success')
                                        // form表单重置
                                        this.form = this.$options.data().form
                                    } else {
                                        this.$message.error('修改失败')
                                    }
                                    this.couldNext = false
                                })
                            }
                        })
                        .catch((rej) => {
                            console.log('quxiao')
                        })
                } else {
                    this.$message.error('请填写必要信息')
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
// .brandDetail_main {
//   .item_input {
//     width: 300px;
//   }
//   .avatar-uploader .el-upload {
//     border: 1px dashed #d9d9d9;
//     border-radius: 6px;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//   }
//   .avatar-uploader .el-upload:hover {
//     border-color: #409eff;
//   }
//   .avatar-uploader-icon {
//     font-size: 28px;
//     color: #8c939d;
//     width: 178px;
//     height: 178px;
//     line-height: 178px;
//     text-align: center;
//   }
//   .avatar {
//     width: 178px;
//     height: 178px;
//     display: block;
//   }
// }
</style>
