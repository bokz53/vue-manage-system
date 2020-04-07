import {
    get,
    post,
    put,
    deletes
} from '../utils/request';

const env = window.ENV || {

};


export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

// 登陆相关！
export function login(query) {
    return post(env.backend + `/api/user/login`, query, true).then(res => {
        return res
    });
};

export function logout(query) {
    return get(env.backend + `/api/user/logout`, query, true).then(res => {
        return res
    });
};

// dashBoard！
export function countCompany(query) {
    return get(env.backend + `/api/dashBoard/countCompany`, query, true).then(res => {
        return res
    });
};

export function countCompletedIndex(query) {
    return get(env.backend + `/api/dashBoard/countCompletedIndex`, query, true).then(res => {
        return res
    });
}

export function queryOverviewWeight(query) {
    return get(env.backend + `/api/dashBoard/queryOverviewWeight`, query, true).then(res => {
        return res
    });
}




// 公司管理
export function getCompanyPaged(query) {
    return get(env.backend + `/api/company`, query, true).then(res => {
        return res
    });
};

export function getCompanyListWithoutRaw(query) {
    return get(env.backend + `/api/company/listWithoutRaw`, query, true).then(res => {
        return res
    });
};

export function updateCompany(query) {
    return put(env.backend + `/api/company`, query, true).then(res => {
        return res
    });
};

export function addCompany(query) {
    return post(env.backend + `/api/company`, query, true).then(res => {
        return res
    });
};

export function deleteCompany(query) {
    return deletes(env.backend + `/api/company?id=`+ query.id + `&userId=`+ query.userId, query, true).then(res => {
        return res
    });
};

export function deleteCompanyBatch(query) {
    return deletes(env.backend + `/api/company/batch`, query, true).then(res => {
        return res
    });
};


// 权重管理
export function getWeightByUserId(query) {
    return get(env.backend + `/api/weight`, query, true).then(res => {
        return res
    });
};

export function customizeWeight(query) {
    return post(env.backend + `/api/weight/customize`, query, true).then(res => {
        return res
    });
};

export function uncustomizeWeight(query) {
    return get(env.backend + `/api/weight/uncustomizeWeight`, query, true).then(res => {
        return res
    });
};

export function initWeight(query) {
    return get(env.backend + `/api/weight/initWeight`, query, true).then(res => {
        return res
    });
};

export function getWeightTree(query) {
    return get(env.backend + `/api/weight/tree`, query, true).then(res => {
        return res
    });
};


// 指标管理
export function getIndexByCompanyId(query) {
    return get(env.backend + `/api/index/tree`, query, true).then(res => {
        return res
    });
}

export function getIndexPagedByUserId(query) {
    return get(env.backend + `/api/index`, query, true).then(res => {
        return res
    });
}

export function getIndexTop20ByUserId(query) {
    return get(env.backend + `/api/index/top20`, query, true).then(res => {
        return res
    });
}

export function queryIndexByCompanyIds(query) {
    return post(env.backend + `/api/index/selection`, query, true).then(res => {
        return res
    });
}


// 原始数据管理
export function queryRawData(query) {
    return get(env.backend + `/api/rawData`, query, true).then(res => {
        return res
    });
};

export function queryRawDataPaged(query) {
    return get(env.backend + `/api/rawData/page`, query, true).then(res => {
        return res
    });
};

export function addRawData(query) {
    return post(env.backend + `/api/rawData`, query, true).then(res => {
        return res
    });
};

export function deleteRawData(query) {
    return deletes(env.backend + `/api/rawData?id=`+ query.id + `&userId=`+ query.userId, query, true).then(res => {
        return res
    });
};

export function updateRawData(query) {
    return put(env.backend + `/api/rawData`, query, true).then(res => {
        return res
    });
};

// 计算指标
export function computeIndex(query) {
    return get(env.backend + `/api/compute`, query, true).then(res => {
        return res
    });
}
