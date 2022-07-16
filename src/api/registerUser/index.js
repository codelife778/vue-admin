import request from '@/utils/request'

/* 获取注册用户信息 */
function findMembersByPage(start, limit) {
    return request({
        url: `/lejuAdmin/member/findMembersByPage/${start}/${limit}`
    })
}

export default {
    findMembersByPage
}
