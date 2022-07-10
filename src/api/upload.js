import request from '@/utils/request'

function uploadApi(data) {
    return request({
        url: `/lejuAdmin/material/uploadFileOss`, // 相对路径
        method: 'post',
        data
    })
}

export default {
    uploadApi
}
