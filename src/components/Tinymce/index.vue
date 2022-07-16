<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <!-- <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" /> -->
    </div>
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
// import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN =
  'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
// import axios from 'axios'
import upload from '@/api/upload'
export default {
    name: 'Tinymce',
    components: {},
    props: {
        id: {
            type: String,
            default: function() {
                return (
                    'vue-tinymce-' +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + '')
                )
            }
        },
        value: {
            type: String,
            default: ''
        },
        toolbar: {
            type: Array,
            required: false,
            default() {
                return []
            }
        },
        menubar: {
            type: String,
            default: 'file edit insert view format table'
        },
        height: {
            type: [Number, String],
            required: false,
            default: 360
        },
        width: {
            type: [Number, String],
            required: false,
            default: 'auto'
        }
    },
    data() {
        return {
            hasChange: false,
            hasInit: false,
            tinymceId: this.id,
            fullscreen: false,
            languageTypeList: {
                en: 'en',
                zh: 'zh_CN',
                es: 'es_MX',
                ja: 'ja'
            }
        }
    },
    computed: {
        containerWidth() {
            const width = this.width
            if (/^[\d]+(\.[\d]+)?$/.test(width)) {
                // matches `100`, `'100'`
                return `${width}px`
            }
            return width
        }
    },
    watch: {
        value(val) {
            if (!this.hasChange && this.hasInit) {
                this.$nextTick(() =>
                    window.tinymce.get(this.tinymceId).setContent(val || '')
                )
            }
        }
    },
    mounted() {
        this.init()
    },
    activated() {
        if (window.tinymce) {
            this.initTinymce()
        }
    },
    deactivated() {
        this.destroyTinymce()
    },
    destroyed() {
        this.destroyTinymce()
    },
    methods: {
        init() {
            // dynamic load tinymce from cdn
            load(tinymceCDN, (err) => {
                if (err) {
                    this.$message.error(err.message)
                    return
                }
                this.initTinymce()
            })
        },
        initTinymce() {
            const _this = this
            window.tinymce.init({
                selector: `#${this.tinymceId}`,
                language: this.languageTypeList['zh'],
                height: this.height,
                body_class: 'panel-body ',
                object_resizing: false,
                toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
                menubar: this.menubar,
                plugins: plugins,
                end_container_on_empty_block: true,
                powerpaste_word_import: 'clean',
                code_dialog_height: 450,
                code_dialog_width: 1000,
                advlist_bullet_styles: 'square',
                advlist_number_styles: 'default',
                imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
                // images_upload_url: '/api/leju/admin/material/uploadImg',
                // images_upload_base_path: '/some/basepath',
                // images_upload_credentials: true,
                default_link_target: '_blank',
                link_title: false,
                nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
                init_instance_callback: (editor) => {
                    if (_this.value) {
                        editor.setContent(_this.value)
                    }
                    _this.hasInit = true
                    editor.on('NodeChange Change KeyUp SetContent', () => {
                        this.hasChange = true
                        this.$emit('input', editor.getContent())
                    })
                },
                setup(editor) {
                    editor.on('FullscreenStateChanged', (e) => {
                        _this.fullscreen = e.state
                    })
                },
                // 整合七牛上传
                // images_dataimg_filter(img) {
                //   setTimeout(() => {
                //     const $image = $(img);
                //     $image.removeAttr('width');
                //     $image.removeAttr('height');
                //     if ($image[0].height && $image[0].width) {
                //       $image.attr('data-wscntype', 'image');
                //       $image.attr('data-wscnh', $image[0].height);
                //       $image.attr('data-wscnw', $image[0].width);
                //       $image.addClass('wscnph');
                //     }
                //   }, 0);
                //   return img
                // },
                // 这个方法加上  富文本 自动添加上传按钮
                images_upload_handler(blobInfo, success, failure, progress) {
                    progress(0)
                    // tinymce api文档查阅可知   直接获取blob原始数据
                    var blob = blobInfo.blob()
                    // 获取token
                    // 原生上传
                    var fd = new FormData()
                    fd.append('file', blob)
                    // 添加token
                    // 上传到 通用上传接口   oss里 添加token
                    upload
                        .uploadApi(fd)
                    // axios.post(_this.uploadUrl, fd, { headers })
                        .then((res) => {
                            const resData = res
                            if (resData.success) {
                                // 固定写法  为了符合 tinymce的 上传成功回调显示
                                success(resData.data.fileUrl)
                                // 这里用于实现  把上传后的 url 直接以img形式拼接到 富文本内容中的光标处
                                // window.tinymce.get(_this.tinymceId).insertContent(`<img src="${resData.ossUrl}" >`)
                            }
                            progress(100)
                        })
                        .catch((err) => {
                            console.log(err)
                            progress(100)
                        })
                }
            })
        },
        destroyTinymce() {
            const tinymce = window.tinymce.get(this.tinymceId)
            if (this.fullscreen) {
                tinymce.execCommand('mceFullScreen')
            }

            if (tinymce) {
                tinymce.destroy()
            }
        },
        setContent(value) {
            window.tinymce.get(this.tinymceId).setContent(value)
        },
        // 延迟给富文本赋值, 设置定时器,判断网络何时加载cdn成功
        setDelayContent(value) {
            var timer = setInterval(() => {
                if (window.tinymce) {
                    window.tinymce.get(this.tinymceId).setContent(value)
                    clearInterval(timer)
                }
            }, 500)
        },
        getContent() {
            return window.tinymce.get(this.tinymceId).getContent()
        },
        // 外部傳入圖片
        imageSuccessCBK(url) {
            // const _this = this
            // arr.forEach(v => {
            window.tinymce
                .get(this.tinymceId)
                .insertContent(`<img class="wscnph" src="${url}" >`)
            // })
        }
    }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
