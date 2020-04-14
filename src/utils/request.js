import axios from 'axios';
import { Message } from "element-ui";
import Router from "../router";

var count = 0;
const MESSAGE_DURATION = 3 * 1000; //消息持续时间

const service = axios.create({
    timeout: 5000
});
service.interceptors.request.use(
    config => {

        if (localStorage.getItem('curUserToken')) {
            config.headers.auth = localStorage.getItem('curUserToken');  //将token设置成请求头
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            Promise.resolve();
            return response.data;
        } else {
            // message('请求失败！');
            Promise.reject();
        }
    },
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            message("鉴权失败！返回登入页面");
            if (count === 0) {
                Router.push({
                    path: "login"
                })
            }
            count += 1;
        } else {
            count = 0;
        }
        return Promise.reject();
    }
);

export default service;

//http post
export async function post(url, params, showError) {
    try {
        const result = await service.post(url, params);
        const data = result;
        errorHandle(result, showError);
        return data;
    } catch (error) {
        afterCatchError(error);
        throw error.data || error;
    }
}
//http get
export async function get(url, params, showError) {
    try {
        const result = await service.get(url, {
            params: params
        });
        const data = result;
        errorHandle(result, showError);
        return (data);
    } catch (error) {
        afterCatchError(error);
        throw error.data || error;
    }
}
//http put
export async function put(url, params, showError) {
    try {
        const result = await service.put(url, params);
        const data = result;
        errorHandle(result, showError);
        return data;
    } catch (error) {
        afterCatchError(error);
        throw error.data || error;
    }
}
//http delete
export async function deletes(url, params, showError) {
    try {
        const result = await service.delete(url, {
            data: params
        });
        const data = result;
        errorHandle(result, showError);
        return data;
    } catch (error) {
        afterCatchError(error);
        throw error.data || error;
    }
}
// 自定义业务错误处理
function errorHandle(res, showError) {
    if (res.resultCode!==0 && showError) {
        message(res.resultMsg);
    }
}

// 通用错误处理
function afterCatchError(error) {
    // 如果error为空，多半就是网络异常了
    if (!error) {
        message('网络异常');
    } else {
        message('请求失败 ： ' + error.response);
    }
}
//消息提示
function message(message) {
    Message({
        message: message,
        type: "error",
        duration: MESSAGE_DURATION
    });
}
