<template>
  <div>
    <el-dialog width="65%" title="广告详情" :visible.sync="dialogVisible">

      <el-form ref="form" :model="form" :inline="true" label-width="120px">
        <el-form-item size="mini" style="width: 45%" label="广告名称">
          <el-input v-model="form.name" placeholder="广告名称" />
        </el-form-item>

        <el-form-item size="mini" style="width: 45%" label="备注">
          <el-input v-model="form.note" class="item_input" placeholder="备注" />
        </el-form-item>

        <el-form-item size="mini" style="width: 45%" label="排序">
          <el-input v-model="form.sort" class="item_input" placeholder="排序" />
        </el-form-item>

        <el-form-item size="mini" style="width: 45%" label="产品数量">
          <el-input v-model="form.productCount" class="item_input" placeholder="产品数量" />
        </el-form-item>

        <el-form-item size="mini" style="width: 45%" label="链接">
          <el-input v-model="form.url" class="item_input" placeholder="链接" />
        </el-form-item>

        <el-form-item size="mini" style="width: 45%" label="首页轮播位置">
          <el-select v-model="form.type" class="search-input item_input" size="small" clearable placeholder="订单状态">
            <el-option label="APP首页轮播" value="0" />
            <el-option label="1" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item style="width: 45%" label="开始时间">
          <el-date-picker
            v-model="form.startTime" type="datetime" placeholder="开始时间"
            value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>

        <el-form-item style="width: 45%" label="结束时间">
          <el-date-picker
            v-model="form.endTime" type="datetime" placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>

        <el-form-item size="mini" style="width: 45%" label="上下线状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" class="item_input" />
        </el-form-item>

        <el-form-item size="mini" style="width: 45%" label="图片">
          <el-upload
            class="avatar-uploader" :action="uploadUrl" :headers="headers" :show-file-list="false"
            :on-success="handleBigPicSuccess">
            <img v-if="form.pic" :src="form.pic" class="avatar" style="width:100px;height:100px">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mix from '@/mixins/index'
import addAd from '@/api/marketing/adListApi/index'
export default {
    name: '',
    mixins: [mix],
    data() {
        return {
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                    // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
                ]
            },
            dialogVisible: false,
            form: {
                pic: '',
                name: '',
                note: '',
                productCount: '',
                sort: '',
                url: '',
                status: 0,
                type: '1',
                startTime: '',
                endTime: ''
            },
            detailObj: {}
        }
    },
    methods: {
        // 重置表单信息
        formReset() {
            this.form = this.$options.data().form
            // this.date = []
        },
        // 大图上传成功
        handleBigPicSuccess(res, file) {
            this.form.pic = res.data.fileUrl
        },
        openPopup(item) {
            this.dialogVisible = true
            this.detailObj = item
            if (this.detailObj) {
                this.form = item
                // this.date[0] = item.startTime
                // this.date[1] = item.endTime
            } else {
                this.formReset()
            }
        },
        onSubmit() {
            this.$refs.form.validate(validate => {
                if (validate) {
                    this.$confirm(
                        `是否确认${this.detailObj ? '修改' : '新增'}广告?`,
                        '提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }
                    ).then(() => {
                        // 添加
                        if (!this.detailObj) {
                            addAd.updateAds({
                                ...this.form
                            }).then(res => {
                                if (res.success) {
                                    this.dialogVisible = false
                                    this.$emit('success')
                                    // form表单重置
                                    this.formReset()
                                } else {
                                    this.$message.error('添加失败')
                                }
                            })
                            // 修改
                        } else {
                            addAd.addAds({
                                ...this.form
                            }).then(res => {
                                if (res.success) {
                                    this.dialogVisible = false
                                    this.$emit('success')
                                    // form表单重置
                                    this.formReset()
                                } else {
                                    this.$message.error('修改失败')
                                }
                            })
                        }
                    })
                } else {
                    this.$message.error('请填写必要的信息')
                    return
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
