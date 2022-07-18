<template>
  <div>
    <el-card>
      <div slot="header">
        <el-button type="primary" @click="toAddAd">新增</el-button>
      </div>
      <div>
        <el-table :data="adsList" style="width: 100%" border>

          <el-table-column type="index" label="序号" />

          <el-table-column align="center" label="广告图片" width="200">
            <template slot-scope="scope">
              <img :src="scope.row.pic" class="table_img" style="width:100px;height:100px">
            </template>
          </el-table-column>

          <el-table-column align="center" prop="prop" label="时间" width="250">
            <template slot-scope="scope">
              <p>开始时间:{{ scope.row.startTime }}</p>
              <p>结束时间:{{ scope.row.endTime }}</p>
            </template>
          </el-table-column>

          <el-table-column header-align="center" align="center" prop="name" label="广告名称" width="200" />
          <el-table-column header-align="center" align="center" prop="clickCount" label="点击数" width="150" />
          <el-table-column header-align="center" align="center" prop="orderCount" label="下单数" width="150" />

          <el-table-column header-align="center" align="center" prop="prop" label="轮播位置">
            <template slot-scope="scope">
              <p v-if="scope.row.type===0">首页轮播</p>
              <p v-else>其他</p>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="url" label="链接地址" width="200" />

          <el-table-column align="center" prop="note" label="备注" />

          <el-table-column header-align="center" align="center" prop="prop" label="上下线状态" width="150">
            <template slot-scope="scope">
              <p>
                {{ scope.row.status===1?"上线":"下线" }}
              </p>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="prop" label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="toEditor(scope.row)">编辑</el-button>
              <el-button type="text" @click="toDelete(scope.row)"><span style="color:red">删除</span></el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </el-card>
    <addAdPopup ref="Popup" @success="PopUp" />
  </div>
</template>

<script>
import addAdPopup from '@/views/marketing/adList/addAdPopup/index.vue'
import adListApi from '@/api/marketing/adListApi/index'
export default {
    name: '',
    components: {
        addAdPopup
    },
    data() {
        return {
            adsList: []
        }
    },
    created() {
        this.getAdsList()
    },
    methods: {
        toAddAd() {
            this.$refs.Popup.openPopup()
        },
        toEditor(item) {
            this.$refs.Popup.openPopup(item)
        },
        toDelete(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    adListApi
                        .delAds(row.id)
                        .then((res) => {
                            if (res.success) {
                                this.getAdsList()
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                            } else {
                                this.$message.error(res.message)
                            }
                        })
                        .catch((res) => {
                            this.$message.error(res.message)
                        })
                })
                .catch((rej) => {
                    console.log(rej)
                })
        },
        PopUp() {
            this.getAdsList()
        },
        getAdsList() {
            adListApi.adsList().then((res) => {
                this.adsList = res.data.items
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
