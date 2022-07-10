<template>
  <div
    v-loading="pageLoading" :element-loading-text="loadingOption.text"
    :element-loading-spinner="loadingOption.spinner" :element-loading-background="loadingOption.background"
    class="article_main">
    新增文章
  </div>
</template>

<script>
import {
    productArticle
} from '@/api/contentManage/articleList'
import mix from '@/mixins/index'
export default {
    name: '',
    mixins: [mix],
    data() {
        return {
            id: '',
            pageLoading: false
        }
    },
    created(value) {
        console.log('value: ', value)
        this.id = this.$route.params.id
        console.log(this.id)
        if (this.id) {
            this.getArticleDetail()
        }
    },
    methods: {
        getArticleDetail() {
            productArticle(this.id).then(res => {

            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
