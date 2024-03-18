import request from '@/utils/request'

export const doLogin = (user) => {
    return request.post("/user/login", {
        //这里是后端需要account字符，也就是用户名
        account: user.username,
        password: user.pass
    })
}

export const logout = () => {
    return request.post('/user/logout');
}

//创建用户接口
export const createUser = ({ username, password, permission }) => {
    return request.post('/permission/createUser', {
        account: username,
        password,
        role_id: permission
    })
}

//获取用户接口
export const userList = () => {
    return request({
        url: '/user/list?type=new',
        method: 'get'
    })
}

export const userInfo = () => {
    return request.get("/user/info")
}