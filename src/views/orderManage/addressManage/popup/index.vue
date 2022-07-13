<template>
  <div>
    <el-dialog title="地址详情" :visible.sync="dialogVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="addressName" label="发货地址">
          <el-input v-model="form.addressName" placeholder="发货地址" clearable />
        </el-form-item>

        <el-form-item label="发货人姓名">
          <el-input v-model="form.name" placeholder="发货人姓名" clearable />
        </el-form-item>

        <el-form-item label="发货人手机号">
          <el-input v-model="form.phone" placeholder="发货人手机号" clearable />
        </el-form-item>

        <el-form-item size="mini" label="邮政编码">
          <el-input v-model="form.postCode" class="inner-input" placeholder="邮政编码" clearable />
        </el-form-item>

        <el-form-item label="收货地址">
          <el-cascader v-model="form.cityCode" :options="options" @change="handleChange" />
        </el-form-item>

        <el-form-item label="详细地址">
          <el-input v-model="form.detailAddress" placeholder="详细地址" clearable />
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { regionDataPlus, CodeToText } from 'element-china-area-data'
import addressApi from '@/api/orderManage/adressManage/index'
export default {
    name: '',
    data() {
        return {
            dialogVisible: false,
            form: {
                addressName: '', // 地址名称 如:河南发货点
                name: '', // 发货人姓名
                phone: '',
                postCode: '', // 邮政编码
                cityCode: [], // 地址编码,英文逗号隔开,比如
                detailAddress: '', // 详细收货地址
                receiveStatus: 0,
                sendStatus: 0
            },
            options: regionDataPlus,
            id: '',
            rules: {
                addressName: [
                    { required: true, message: '发货地址不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleChange(val) {
            this.cityCode = val
        },
        getAddressInfo() {
            addressApi.companyAddress(this.id).then(res => {
                console.log('res: ', res)
                if (res.success) {
                    this.form = {
                        ...res.data.address,
                        cityCode: res.data.address.cityCode.split(',')
                    }
                } else {
                    this.$message('获取信息错误')
                }
            }).catch(res => {
                this.$message('获取信息错误')
            })
        },
        toSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.id) {
                        const data = {
                            ...this.form,
                            cityCode: this.form.cityCode.join(','),
                            province: CodeToText[this.cityCode[0]],
                            city: CodeToText[this.cityCode[1]],
                            region: CodeToText[this.cityCode[2]]
                        }
                        addressApi.update(data).then((res) => {
                            if (res.success) {
                                this.dialogVisible = false

                                this.$emit('success')
                            } else {
                                this.$message(res.message)
                            }
                        })
                    } else {
                        const data = {
                            ...this.form,
                            cityCode: this.form.cityCode.join(','),
                            province: CodeToText[this.cityCode[0]],
                            city: CodeToText[this.cityCode[1]],
                            region: CodeToText[this.cityCode[2]]
                        }
                        addressApi.save(data).then((res) => {
                            if (res.success) {
                                this.dialogVisible = false

                                this.$emit('success')
                            } else {
                                this.$message(res.message)
                            }
                        })
                    }
                } else {
                    this.$message.error('请填写必要信息')
                }
            })
        },
        openPopup(id) {
            if (id) {
                console.log(id)
                this.id = id
                this.getAddressInfo()
                this.dialogVisible = true
            } else {
                this.form = {}
                this.dialogVisible = true
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
