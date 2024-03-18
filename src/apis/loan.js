import request from "@/utils/request";

export const creatLoan = (data) =>
    request({
        url: "/loan/creat",
        method: "post",
        data
    })

export const getLoanList = (params) => request({
    url: "/loan/list",
    method: "get",
    params
})

//编辑提交接口
export const updateLoan = (data) => {
    return request({
        url: '/loan/update',
        method: 'put',
        data
    })
}
//删除申请接口
export const deleteLoan = (id) => {
    return request({
        url: '/loan/delete/' + id,
        method: 'delete',
    })
}
// 提交审核接口
export const submitApprove = (id) => {
    return request({
        url: '/loan/submitToApprove',
        method: 'post',
        data: {
            id
        }
    })
}

// 审核列表接口

export const queryList = (type, params) => {
    return request({
        url: `/approve/${type}/list`,
        method: 'get',
        params
    })
}



export const approve = (type, id, flag) => {
    //调用时传入flag，改变调用的是通过或者是失败的接口
    return request({
        url: `/approve/${type}/` + flag,
        method: 'post',
        data: {
            loanId: id,
            appId: id
        }
    })
}



// 合同管理-合同列表接口
export const contractList = (params) => {
    return request({
        url: '/contract/list',
        method: 'get',
        params
    })
}

// 合同管理- 生成合同接口
export const generateContract = (id) => {
    return request({
        url: '/contract/createFile',
        method: 'post',
        data: {
            id
        }
    })
}

// 合同管理- 下载合同接口
export const downloadContract = (id) => {
    return request({
        url: '/contract/download',
        method: 'get',
        params: {
            id
        }
    })
}
