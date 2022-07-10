import { getToken } from '@/utils/auth.js'

export default {
    data() {
        return {
            page: {
                currentPage: 1,
                size: 2,
                total: 0,
                pageSizes: [2, 10, 30, 40]
            },
            loadingOption: {
                background: 'rgba(255,255,255,.9)',
                text: 'loading.....',
                spinner: 'el-icon-loading'
            },
            uploadUrl: '/lejuAdmin/material/uploadFileOss' // 上传素材公用接口

        }
    },
    computed: {
        headers() {
            const token = getToken()
            const headers = {
                token: token
            }
            return headers
        }
    }
}
