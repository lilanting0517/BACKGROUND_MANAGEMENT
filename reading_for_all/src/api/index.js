import axios from 'axios';
import qs from 'qs';
import Api from '../config';
// import store from '../store';
import router from '../router'

import {
  getItem,
  spliceToken
} from '../common/js/util'

const instance = axios.create({
  baseURL: Api.baseUrl,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// 错误信息处理函数
const handleErrorMsg = function (res) {
  if (res.Success !== true) {
    store.commit('setErrorMsg', res.ErrorMsg)
    store.commit('setRequestErr', true)
  }

  return res
}

/* 请求拦截器 */
instance.interceptors.request.use(config => {
  if (config.method === 'post') {

    // 登陆页、注册页不做拦截
    /* if (config.url === 'User/Login' || config.url === 'User/Region') return config */

    // User 信息不完善时重定向到登录页
    /* if (!config.data.Token) {
      router.push({
        name: 'Login'
      })

      return false
    } */

    return config;
  }
  return config;
}, err => {
  return Promise.reject(err);
});

/* 响应拦截器 */
instance.interceptors.response.use(res => {
  if (res.data.ErrorCode === 100) {
    router.push({
      name: 'Login'
    })
  }

  if (res.status != 200) {
    return Promise.reject(res);
  }
  return res;
}, err => {
  console.warn(err);
  return Promise.reject(err);
});

/* post 方法 promise 封装 */
const postWrap = (url, params) => {
  return new Promise((resolve, reject) => {
    instance.post(url, params).then(({
      data
    }) => resolve(data)).catch(err => reject(err));
  })
}

/* 从本地存储获取用户信息 */
const getUserInfo = () => {
  const User = getItem('User')

  if (User) {
    let {
      UserName,
      UserType
    } = User

    return {
      UserId: UserName,
      UserType
    }
  } else {
    return {
      login: false
    }
  }
}

/**
 * ---------- 测试（可删除） -----------
 * login
 * User/Login（POST）
 * @param {*} params
 */
export const Login = params => {
  const url = 'User/Login';

  const Defaults = {
    UserId: '',
    Psw: '',
    LoginType: 'Card'
  }

  params = Object.assign({}, Defaults, params);
  params = {
    data: params
  }

  return postWrap(url, params).then(handleErrorMsg)
}
/**
 * 用户登录信息
 * @params {Object}
 */
export const LoginData = params => {
  const url = 'User/Login'
  let data = JSON.stringify(params)

  return postWrap(url, data)
}
/**
 * 后台获取 banner 信息
 * Banner/GetAllBannerInfo（post）
 * @params {Object}
 */
export const GetAllBannerInfo = params => {
  const url = 'Banner/GetBanner';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
    Start: 1,
    End: 10
  }

  params = Object.assign({}, Defaults,params);

  return postWrap(url, params)
}

/*
 * 后台增加Banner信息
 * /AddBanner（POST）
 * @params {Object}
 */
export const AddBanner = params => {
  const url = 'Banner/AddBanner';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, Defaults)
}

/*
 * 后台删除Banner信息
 * /DeleteBanner（POST）
 * @params {Object}
 */
export const DeleteBanner = params => {
  const url = 'Banner/DeleteBanner';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.SearchContent = params.SearchContent;

  return postWrap(url, Defaults)
}

/*
 * 后台修改Banner信息
 * /UpdateBanner（POST）
 * @params {Object}
 */
export const UpdateBanner = params => {
  const url = 'Banner/UpdateBanner';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, Defaults)
}

/**
 * 后台获取公告信息
 * /News/GetAllNewsInfo（post）
 * @params {Object}
 */
export const GetAllNewsInfo = params => {
  const url = 'News/GetNewsInfo';

  const User = getUserInfo()

  const timeStamps = +new Date()

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
    SearchContent: '',
    Start: 1,
    End: 10
  }

  params = Object.assign({}, Defaults, params);

  return postWrap(url, params)
}

/*
 * 后台增加公告信息
 * /AddNewsInfo（POST）
 * @params {Object}
 */
export const AddNewsInfo = params => {
  const url = 'News/AddNewsInfo';
  const User = getUserInfo()

  const timeStamps = +new Date()
  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps
  }

  let reqData = Defaults;

  reqData.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, reqData)
}
/*
 * 后台删除公告信息
 * /DeleteNewsInfo（POST）
 * @params {Object}
 */
export const DeleteNewsInfo = params => {
  const url = 'News/DeleteNewsInfo';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.SearchContent = params.SearchContent;

  return postWrap(url, Defaults)
}

/*
 * 后台修改公告信息
 * /UpdateBanner（POST）
 * @params {Object}
 */
export const UpdateNews = params => {
  const url = 'News/UpdateNews';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, Defaults)
}

/**
 * 后台获取权限信息
 * /News/GetAllNewsInfo（post）
 * @params {Object}
 */
export const GetAllPermissonInfo = params => {
  const url = 'Auth/GetAdminList';

  const User = getUserInfo()

  const timeStamps = +new Date()

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
    SearchContent: '',
    Start: 1,
    End: 10
  }

  params = Object.assign({}, Defaults, params);

  return postWrap(url, params)
}

/*
 * 后台增加管理员信息
 * /AddNewsInfo（POST）
 * @params {Object}
 */
export const AddAdmin = params => {
  const url = 'Auth/AddAdmin';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, Defaults)
}

/*
 * 后台删除权限信息
 * /AddNewsInfo（POST）
 * @params {Object}
 */
export const DeletePermission = params => {
  const url = 'Auth/DeleteAdminById';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, Defaults)
}
/*
 * 获取图书馆下拉框
 * Auth/GetLibyList  （POST）
 * @params {Object}
 */
export const getLibyList = params => {
  const url = 'Auth/GetLibyList';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  return postWrap(url, Defaults)
}

/*
 * 移动
 * Banner/UpdateBanSeq  （POST）
 * @params {Object}
 */
export const UpdateBanSeq = params => {
  const url = 'Banner/UpdateBanSeq';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, Defaults)
}

export const UpdateNewsSeq = params => {
  const url = 'News/UpdateNewsSeq';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, Defaults)
}

/*
 * 移动
 * Banner/UpdateBanUse（POST）
 * @params {Object}
 */
export const UpdateBanUse = params => {
  const url = 'Banner/UpdateBanUse';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, Defaults)
}
/*
 * 获取用户一级分类
 * Auth/GetFatherBookType（POST）
 * @params {Object}
 */
export const GetFatherBookType = params => {
  const url = 'Auth/GetFatherBookType';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
    data:{
      UserId:User.UserId
    }
  }

  // Defaults.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, Defaults)
}
/*
 * 添加一级二级分类
 * Auth/AddBookType（POST）
 * @params {Object}
 */
export const AddBookType = params => {
  const url = 'Auth/AddBookType';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,

  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);

  return postWrap(url, Defaults)
}
/*
 * 分类管理列表
 * Book/GetBookType（POST）
 * @params {Object}
 */
export const GetBookType = params => {
  const url = 'Book/GetBookType';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  // Defaults.data = Object.assign({}, Defaults.data, params.data);

  return postWrap(url, Defaults)
}

/*
 * 删除分类
 * Auth/DelBookType（POST）
 * @params {Object}
 */
export const DelBookType = params => {
  const url = 'Auth/DelBookType';

  const User = getUserInfo();

  const timeStamps = +new Date();

  const Defaults = {
    Token: spliceToken(timeStamps),
    ...User,
    TimeSpan: timeStamps,
  }

  Defaults.Data = Object.assign({}, Defaults.Data, params.Data);

  return postWrap(url, Defaults)
}
