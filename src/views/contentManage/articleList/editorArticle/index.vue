<template>
  <div
    v-loading="pageLoading" :element-loading-text="loadingOption.text"
    :element-loading-spinner="loadingOption.spinner" :element-loading-background="loadingOption.background"
    class="article_main">
    <el-card>
      <div slot="header">
        <span v-if="id">编辑文章</span>
        <span v-else>增加文章</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item prop="author" label="作者">
          <el-input v-model="form.author" placeholder="作者姓名" size="small" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="文章标题" size="small" />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="form.isShow" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input v-model="form.summary" type="textarea" placeholder="摘要" :autosize="{ minRows: 3, maxRows: 3 }" />
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
            :action="uploadUrl" :headers="headers" :on-success="handleUploadSucc">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <img v-if="form.coverImg" src="form.coverImg" alt="" class="uploadImg">
        </el-form-item>
        <el-form-item label="label">
          <el-radio-group v-model="form.editorType" @change="toToggleEditType">
            <el-radio :label="0">富文本</el-radio>
            <el-radio :label="1">markdown</el-radio>
          </el-radio-group>
          <span class="warning">
            <i class="el-icon-warning" />
            注意!切换编辑器会清空编辑内容
          </span>
        </el-form-item>
        <el-upload
          v-show="form.editorType === 0" ref="innerUpload" class="upload-demo" :action="uploadUrl"
          :headers="headers" :on-success="handleInnerImg">
          <el-button size="small" type="primary">插入图片</el-button>
        </el-upload>
        <div v-if="form.editorType===0">

          <TinEditor />
        </div>
        <div v-if="form.editorType===1">

          <mavon-editor
            ref="mavon" v-model="form.content1" @imgAdd="imgAdd" @imgDel="imgDel"
            @change="getMarkDownHtml" />
        </div>
        <div class="flexCenter">
          <el-form-item size="small">
            <el-button :loading="loading" type="primary" @click="onSubmit">{{ id?"立即修改":"立即新增" }}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { productArticle, uploadFileOss } from '@/api/contentManage/articleList'
import mix from '@/mixins/index'
import TinEditor from '@/components/Tinymce'
// import { uploadFileOss } from '@/api/content/index'

export default {
    name: '',
    components: {
        TinEditor
    },
    mixins: [mix],
    data() {
        return {
            id: '',
            pageLoading: false,
            loading: false,
            form: {
                author: '',
                title: '',
                summary: '',
                coverImg: '',
                isShow: 1, // 是否展示
                editorType: 0, // 0富文本  1markdown
                content1: '', // 富文本原文
                content2: '' // 富文本html
            },
            rules: {
                title: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' }
                    // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
                ],
                author: [
                    { required: true, message: '请输入作者姓名', trigger: 'blur' }
                    // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
                ]
            }
        }
    },
    created(value) {
        this.id = this.$route.params.id

        if (this.id) {
            this.getArticleDetail()
        }
    },
    methods: {
        onSubmit() {

        },
        toToggleEditType(e) {
            if (e) {
                this.form.content1 = ''
            }
        },
        handleUploadSucc(value) {
            console.log('value: ', value)
        },

        handleInnerImg(value) {
            console.log('value: ', value)
        },

        imgAdd(pos, $file) {
            var formdata = new FormData()
            formdata.append('file', $file)
            console.log($file, uploadFileOss)
            uploadFileOss(formdata).then((res) => {
                console.log(res)
                this.$refs.mavon.$img2Url(pos, res.data.fileUrbl)
            })
        },

        imgDel(value1, value2) {
            console.log('value: ', value1, value2)
        },

        getMarkDownHtml(val, html) {
            console.log('val, html: ', val, html)
            this.form.content2 = html
        },

        getArticleDetail() {
            this.pageLoading = true

            productArticle(this.id).then((res) => {
                console.log('res: ', res)
                if (res.success) {
                    this.form = res.data.productArticle
                } else {
                    this.$message('获取信息失败')
                }
                this.pageLoading = false
            }).catch(res => {
                this.$message('获取信息失败')
                this.pageLoading = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
