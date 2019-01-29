import axios from 'axios';
import qs from 'qs';
import Api from '../config';
import store from '../store';
import router from '../router'
import { Message } from 'element-ui'
import { setItem, removeItem } from '@/common/js/util'
import {
  getItem,
  spliceToken
} from '../common/js/util'

export const instance = axios.create({
  baseURL: Api.baseUrl,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
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
    if (config.url === 'User/Login' || config.url === 'User/Region' || config.url === 'User/GetVerImg' || config.url === 'Activity/GetMainPageActivity') return config

    // User 信息不完善时重定向到登录页
    // if (!config.data.Token) {
    //   router.push({
    //     name: 'Login'
    //   })

    //   return false
    // }

    return config;
  }
  return config;
}, err => {
  return Promise.reject(err);
});

/* 响应拦截器 */
instance.interceptors.response.use(res => {

  if (res.data.ErrorCode === 100) {
    Message({
      message: res.data.ErrorMsg,
      type: 'error'
    })

    setItem("activeNav", "1-2");
    removeItem("User");

    router.push({
      name: 'Login'
    })

    return Promise.reject(res.data);
  }
  //十五分钟没有操作跳转到登录界面
  if (res.data.ErrorCode === 205) {
    Message({
      message: res.data.ErrorMsg,
      type: 'warning'
    });
    setItem("activeNav", "1-2");
    removeItem("User");
    router.push({
      name: "Login"
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
      UserId,
      UserType
    } = User

    return {
      UserId: UserId,
      UserType
    }
  } else {
    return {
      login: false
    }
  }
}

/**
 * ---------- 登录的验证图片 -----------
 * User/GetVerImg（GET）
 * @param 无
 */
export const fetchVerifyImg = params => {
  // const url = "User/GetVerImg"
  const url = "User/GetVerImgV2"
  return new Promise((resolve, reject) => {
    instance.post(url, params).then(res =>
      resolve(res)
    ).catch(err => reject(err));
  })
  return postWrap(url, data);
}

/**
 * ---------- 登录 -----------
 * login
 * User/Login（POST）
 * @param {*} params
 */
export const Login = params => {
  const url = 'User/Login';

  params = Object.assign({}, params);
  let data = JSON.stringify(params);
  return postWrap(url, data);
}

/************************************ 商品管理接口api*******************************************************/
/**
 * ----------添加热词-------------
 * AddHotWord
 * @param {*} params
 * ******/
export const AddHotWord = params => {
  const url = "Manage/HotWord/AddHotWord";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Word: "",
      GoodsId: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/**
 * ----------获取所有热词列表-------------
 * AddHotWord
 * @param {*} params
 * ******/
export const GetAllHotWord = params => {
  const url = "HotWord/GetAllHotWord";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      UserId: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}




/**
 * ----------删除热词-------------
 * AddHotWord
 * @param {*} params
 * ******/
export const DelHotWord = params => {
  const url = "Manage/HotWord/DelHotWord";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/**
 * ----------改变热词状态-------------
 * AddHotWord
 * @param {*} params
 * ******/
export const ChangeIsuse = params => {
  const url = "Manage/HotWord/ChangeIsuse";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Word: "",
      IsUse: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/**
 * ----------改变热词名字-------------
 * AddHotWord
 * @param {*} params
 * ******/
export const ChangeWord = params => {
  const url = "Manage/HotWord/ChangeWord";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      OldWord: "",
      NewWord: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}






/**
 * ----------获取热词中的商品-------------
 * AddHotWord
 * @param {*} params
 * ******/
export const GetListHotWord = params => {
  const url = "Manage/HotWord/GetList";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Word: "",
      PageIndex: "",
      PageNum: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/**
 * ----------热词商品排序-------------
 * AddHotWord
 * @param {*} params
 * ******/
export const ChangeSeqHotWord = params => {
  const url = "Manage/HotWord/ChangeSeq";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Word: "",
      Guid: "",
      Seq: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/**
 * ----------获取用户权限-------------
 * AddHotWord
 * @param {*} params
 * ******/
export const GetFuncList = params => {
  const url = "Manage/Auth/GetFuncList";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      UserId: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/**
 * ----------各频道修改列表页显示顺序-------------
 * ChangeSeq
 * @param {*} params
 * ******/

export const ChangeSeq = params => {
  const url = "Manage/Good/ChangeSeq";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/**
 * ----------删除首页产品-------------
 * ChangeSeq
 * @param {*} params
 * ******/

export const DelMainPageSeq = params => {
  const url = "Manage/Good/DelMainPageSeq";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/**
 * ----------添加/修改主页各频道图书排序-------------
 * ChangeSeq
 * @param {*} params
 * ******/
export const ChangeMainPageSeq = params => {
  const url = "Manage/Good/ChangeMainPageSeq";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/**
 * ----------大中专删除-------------
 * ChangeSeq
 * @param {*} params
 * ******/
export const DelSeq = params => {
  const url = "Manage/Good/DelSeq";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}



/************************************ 平台管理接口api*******************************************************/

/*****
 *  ----------修改热词名称和使用状态----------
 *  @param {*} params
 * ******/
export const ChangeNoteOrIsuse = params => {
  const url = "Manage/HotWord/ChangeNoteOrIsuse";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
}

/**
 * ---------- 主页轮播图片数据 -----------
 *
 * Activity/GetMainPageActivity（POST）
 * @param {*} null
 */
export const GetList = params => {
  const url = 'Manage/Activity/GetList'
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      PageIndex: "",
      PageNum: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults)
}

/*****
 *  ----------活动上移----------
 *  @param {*} params
 * ******/
export const MoveUp = params => {
  const url = "Manage/Activity/MoveUp"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------活动下移----------
 *  @param {*} params
 * ******/
export const MoveDown = params => {
  const url = "Manage/Activity/MoveDown"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------新增活动----------
 *  @param {*} params
 * ******/
export const AddAct = (params, params2) => {
  const url = "Manage/Activity/AddAct"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params2;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Name: "",
      ImgUrl: "",
      StartTime: "",
      EndTime: "",
      Position: "",
      IsUse: "0"
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------删除活动----------
 *  @param {*} params
 * ******/
export const Delete = (params) => {
  const url = "Manage/Activity/Delete"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------启用禁用活动----------
 *  @param {*} params
 * ******/
export const IsUse = (params) => {
  const url = "Manage/Activity/IsUse"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: "",
      IsUse: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}





/*****
 *  ----------修改活动----------
 *  @param {*} params
 * ******/
export const ChangeAct = (params, params2) => {
  const url = "Manage/Activity/ChangeAct"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params2;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Name: "",
      ImgUrl: "",
      StartTime: "",
      EndTime: "",
      Position: "",
      IsUse: "1",
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------搜索出版社----------
 *  @param {*} params
 * ******/
export const GetCbsList = (params) => {
  const url = "/Manage/Good/GetCbsList"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Search: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------获取大中专教材出版社列表----------
 *  @param {*} params
 * ******/
export const GetDzzjcCbs = (params) => {
  const url = "Good/GetDzzjcCbs"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------大中专教材添加出版社----------
 *  @param {*} params
 * ******/
export const AddDzzjcCbs = (params) => {
  const url = "Manage/Good/AddDzzjcCbs"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Name: "",
      ImgUrl: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------删除大中专出版社----------
 *  @param {*} params
 * ******/
export const DelDzzcbs = (params) => {
  const url = "Manage/Good/DelDzzcbs"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}



/*****
 *  ----------大中专出版社上移----------
 *  @param {*} params
 * ******/
export const DzzMoveUp = (params) => {
  const url = "Manage/Good/DzzMoveUp"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------大中专出版社下移----------
 *  @param {*} params
 * ******/
export const DzzMoveDown = (params) => {
  const url = "/Manage/Good/DzzMoveDown"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------大中专出版社上移----------
 *  @param {*} params
 * ******/
export const GetDzzjcBanner = (params) => {
  const url = "Manage/Good/GetDzzjcBanner"
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      PageIndex: "",
      PageNum: "",
      Type: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}



/*****
 *  ----------搜素图书----------
 *  @param {*} params
 * ******/
export const SearchBook = params => {
  const url = "Manage/Good/SearchBook"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Search: "",
      PageIndex: 1,
      PageNum: 10,
      Type: "",
      DzzjcType: "",
      IsPoint: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------添加重点图书----------
 *  @param {*} params
 * ******/
export const ChangePointGoods = params => {
  const url = "Manage/Good/ChangePointGoods"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      GoodsId: "",
      IsPoint: "",
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------获取商品列表头部数据----------
 *  @param {*} params
 * ******/
export const GetCount = params => {
  const url = "Manage/Good/GetCount"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      UserId: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}






/*****
 *  ----------主页商品列表----------
 *  @param {*} params
 * ******/
export const GetMainPageGoods = params => {
  const url = "Good/GetMainPageGoods"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------获取首页有排序的商品----------
 *  @param {*} params
 * ******/
export const GetMainPageSeqGoods = params => {
  const url = "Manage/Good/GetMainPageSeqGoods"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------获取多元产品列表----------
 *  @param {*} params
 * ******/
export const SearchMultiGoods = params => {
  const url = "Good/SearchMultiGoods"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Search: "",
      PageIndex: "",
      PageNum: "",
      PriceStart: "",
      PriceEnd: "",
      ShowAll: 1,
      TypeId: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------添加/删除/修改多元产品----------
 *  @param {*} params
 * ******/
export const ChangeGoods = params => {
  const url = "Manage/MultiGoods/ChangeGoods"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      BrandId: "",
      BrandName: "",
      SpecificationId: "",
      SpecificationName: "",
      Id: "",
      Name: "",
      Img: "",
      PackageId: "",
      PackageName: "",
      Price: "",
      Summary: "",
      TypeId: "",
      TypeName: "",
      Method: "",
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------改变多元产品使用状态----------
 *  @param {*} params
 * ******/
export const ChangeState = params => {
  const url = "Manage/MultiGoods/ChangeState"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: "",
      State: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}




/*****
 *  ----------获取多元产品属性----------
 *  @param {*} params
 * ******/
export const GetPropetry = params => {
  const url = "Manage/MultiGoods/GetPropetry"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      PageIndex: "",
      PageNum: "",
      Type: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}



/*****
 *  ----------多元产品新增属性----------
 *  @param {*} params
 * ******/
export const AddPropetry = params => {
  const url = "Manage/MultiGoods/AddPropetry"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Type: "",
      Id: "",
      Name: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------多元产品删除属性----------
 *  @param {*} params
 * ******/
export const DelPropetry = params => {
  const url = "Manage/MultiGoods/DelPropetry"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*******************************************************************************************************************************************************/


/*****
 *  ----------删除角色----------
 *  @param {*} params
 * ******/
export const DelRole = params => {
  const url = "Manage/Auth/DelRole"
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      RoleId: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------获取角色拥有哪些权限----------
 *  @param {*} params
 * ******/
export const GetRoleFuncList = params => {
  const url = "Manage/Auth/GetRoleFuncList";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      RoleId: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------获取用户除角色外单独赋予的权限----------
 *  @param {*} params
 * ******/
export const GetUserAuthorize = params => {
  const url = "Manage/Auth/GetUserAuthorize";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      UserId: "",
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------修改用户除角色外的权限----------
 *  @param {*} params
 * ******/
export const ChangeUserAuthorize = params => {
  const url = "Manage/Auth/ChangeUserAuthorize";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Name: "",
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------获取所有角色列表----------
 *  @param {*} params
 * ******/
export const GetAllRoleInfo = params => {
  const url = "Manage/Auth/GetAllRoleName";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      RoleId: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}




/*****
 *  ----------新增角色----------
 *  @param {*} params
 * ******/

export const AddRole = params => {
  const url = "Manage/Auth/AddRole";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Name: "",
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------修改角色权限----------
 *  @param {*} params
 * ******/

export const ChangeRoleFun = params => {
  const url = "Manage/Auth/ChangeRoleFun";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Name: "",
      Id: "",
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------获取所有用户列表----------
 *  @param {*} params
 * ******/
export const GetUserList = params => {
  const url = "Manage/Users/GetUserList";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Search: "",
      RoleName: "",
      PageIndex: "",
      PageNum: "",
      State: "",
      Type: "",
      UserType: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------获取所有购物车用户列表----------
 *  @param {*} params
 * ******/
export const GetCompanyUserList = params => {
  const url = "Manage/Users/GetCompanyUserList";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Search: "",
      RoleName: "",
      PageIndex: "",
      PageNum: "",
      State: "",
      Type: "",
      UserType: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------新增/修改/删除用户----------
 *  @param {*} params
 * ******/
export const ChangeUser = params => {
  const url = "Manage/Users/ChangeUser";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      UserId: "",
      Psw: "",
      CompanyName: "",
      Name: "",
      Tel: "",
      Method: "",
      CompanyCode: "",
      InOut: "",
      UserType: "",
      RoleId: "",
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------启用/停用账号----------
 *  @param {*} params
 * ******/
export const ChangeUserState = params => {
  const url = "Manage/Good/ChangeUserState";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      UserId: '',
      IsUse: ''
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------获取门店和单位----------
 *  @param {*} params
 * ******/
export const GetCompanyList = params => {
  const url = "Manage/CusShopRel/GetCompanyList";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------获取订单详情列表----------
 *  @param {*} params
 * ******/
export const GetOrder = params => {
  const url = "Order/GetOrder";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      PageIndex: '',
      PageNum: '',
      OrderId: '',
      StartTime: '',
      EndTime: ''
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------获取订单详情列表----------
 *  @param {*} params
 * ******/
export const SearchOrder = (params, params2) => {
  const url = "Order/GetOrder";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params2;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      PageIndex: '',
      PageNum: '',
      OrderId: '',
      StartTime: '',
      EndTime: ''
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------获取单位关联维护列表----------
 *  @param {*} params
 * ******/
export const GetRelationList = params => {
  const url = "Manage/CusShopRel/GetRelationList";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      PageIndex: '',
      PageNum: '',
      CustomName: '',
      ShopName: ''
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------新增单位关联维护列表----------
 *  @param {*} params
 * ******/
export const AddRelation = params => {
  const url = "Manage/CusShopRel/AddRelation";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      CustomName: '',
      ShopName: '',
      ShopCode: '',
      CustomCode: ''
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------删除单位关联维护----------
 *  @param {*} params
 * ******/
export const DeleteRelation = params => {
  const url = "Manage/CusShopRel/DeleteRelation";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------获得二级分类列表----------
 *  @param {*} params
 * ******/
export const GetChannelTree = params=> {
  const url = "Channel/GetChannelTree";
  return postWrap(url);
}


/*****
 *  ----------修改单位关联维护----------
 *  @param {*} params
 * ******/
export const UpdateRelation = params => {
  const url = "Manage/CusShopRel/UpdateRelation";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------查询区域业务员列表----------
 *  @param {*} params
 * ******/
export const GetSellerList = params => {
  const url = "Manage/AreaPic/GetList";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------区域业务员新增----------
 *  @param {*} params
 * ******/
export const AddInfo = params => {
  const url = "Manage/AreaPic/AddInfo";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      ChannelCode: "",
      AreaName: "",
      PicName: "",
      PicQQ: "",
      PicTel: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------区域业务员删除----------
 *  @param {*} params
 * ******/
export const DelInfo = params => {
  const url = "Manage/AreaPic/DelInfo";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}



/*****
 *  ----------区域业务员更新----------
 *  @param {*} params
 * ******/
export const UpdateInfo = params => {
  const url = "Manage/AreaPic/UpdateInfo";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      ChannelCode: "",
      AreaName: "",
      PicName: "",
      PicQQ: "",
      PicTel: "",
      Guid: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------添加二级频道----------
 *  @param {*} params
 * ******/
export const AddChannel = (params,params1) => {
  const url = "Manage/Channel/AddChannel";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params1;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Name:"",
      ParentCode:"",
      EndTime:"",
      StartTime:""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}




/*****
 *  ----------修改二级频道----------
 *  @param {*} params
 * ******/
export const ChangeChannel = (params,params1) => {
  const url = "Manage/Channel/ChangeChannel";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params1;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Code:"",
      Name:"",
      ParentCode:"",
      EndTime:"",
      StartTime:""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------删除二级频道----------
 *  @param {*} params
 * ******/
export const DeleteChannel = params => {
  const url = "Manage/Channel/DeleteChannel";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
     Guid:""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}






/*****
 *  ----------退出登录----------
 *  @param {*} params
 * ******/
export const Logout = params => {
  const url = "User/Logout";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Id: "",
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------获取所有频道----------
 *  @param {*} params
 * ******/
export const GetAllChannel = params => {
  const url = "Activity/GetAllChannel";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      IsUse: "",
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}


/*****
 *  ----------聊天发送消息----------
 *  @param {*} params
 * ******/
export const SendMessage = params => {
  const url = "Chat/AdminSendMessage";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: "",
      Message: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  // return Defaults;
  return postWrap(url, Defaults);
}
/*****
 *----------客服获取聊天详情----------
 *  @param {*} params
 * ******/
export const AdminGetDetail = params => {
  const url = "Chat/AdminGetDetail";
  const User = getUserInfo()
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid: "1139C0B835084DE7BDEED506F856DD13",
      PageIndex: 1,
      PageNum: 10
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  // return Defaults;
  return postWrap(url, Defaults);
}






/*****
 *  ----------获取聊天记录----------
 *  @param {*} params
 * ******/
export const GetChatHistory = params => {
  const url = "Chat/AdminGetChatList";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Type: "",
      PageIndex: "",
      PageNum: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  // return Defaults;
  return postWrap(url, Defaults);
}

/*****
 *  ----------获取客户购物车内商品----------
 *  @param {*} params
 * ******/
export const GetGoods = (params, params2) => {
  const url = "Manage/ShopCar/GetGoods";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params2;
  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      UserId: "",
      StartTime: "",
      EndTime: "",
      PageNum: "",
      PageIndex: "",
      Channel: ""
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------平台管理——出版社排序——添加----------
 *  @param {*} params
 * ******/
export const addCbsSeq = params => {

  const url = "Manage/CbsSeq/AddInfo";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      CbsCode:''
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------平台管理——出版社排序——获取排序列表----------
 *  @param {*} params
 * ******/
export const getSeqCbsList = params => {

  const url = "Manage/CbsSeq/GetList";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      PageIndex:1,
      PageNum:10
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------平台管理——出版社排序——删除排序----------
 *  @param {*} params
 * ******/
export const deleteSeqCbs = params => {

  const url = "Manage/CbsSeq/DelInfo";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Guid:''
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------平台管理——出版社排序——修改排序----------
 *  @param {*} params
 * ******/
export const updateSeqCbs = params => {

  const url = "Manage/CbsSeq/UpdateInfo";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------平台管理——获取相关图书----------
 *  @param {*} params
 * ******/
export const relateBookGetList = params => {

  const url = "Manage/RelateBook/GetList";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------平台管理——添加相关图书----------
 *  @param {*} params
 * ******/
export const relateBookAddInfo = params => {

  const url = "Manage/RelateBook/AddInfo";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------平台管理——删除相关图书----------
 *  @param {*} params
 * ******/
export const relateBookDelInfo = params => {

  const url = "Manage/RelateBook/DelInfo";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {

    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------平台管理——获取欢迎词----------
 *  @param {*} params
 * ******/
export const GetHelloWord = params => {

  const url = "Manage/SysPara/GetHelloWord";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      UserId:getItem("User").UserId
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------平台管理——修改欢迎词----------
 *  @param {*} params
 * ******/
export const ChangeHelloWord = params => {

  const url = "Manage/SysPara/ChangeHelloWord";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
      Word:''
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------平台管理——单位与分类关联——查看出版分类列表----------
 *  @param {*} params
 * ******/
export const GetCbflList = params => {

  const url = "Manage/ExportType/GetCbflList";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------平台管理——单位与分类关联——获取学科分类列表----------
 *  @param {*} params
 * ******/
export const GetXkfllList = params => {

  const url = "Manage/ExportType/GetXkfllList";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------平台管理——单位与分类关联——修改单位导出权限----------
 *  @param {*} params
 * ******/
export const UpdateType = params => {

  const url = "Manage/ExportType/UpdateType";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------平台管理——馆藏数据文件推荐列表--获取采访数据上传文件列表----------
 *  @param {*} params
 * ******/
export const collectionGetList = params => {

  const url = "ImportFile/GetList";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------平台管理——馆藏数据文件推荐列表--删除上传文件----------
 *  @param {*} params
 * ******/
export const collectionDelInfo = params => {

  const url = "ImportFile/DelInfo";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------平台管理——馆藏数据文件推荐列表--修改上传文件的启用状态----------
 *  @param {*} params
 * ******/
export const collectionIsUse = params => {

  const url = "ImportFile/ChanceIsUse";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------平台管理——订单详情--查看订单明细----------
 *  @param {*} params
 * ******/
export const GetOrderDetail = params => {

  const url = "Order/GetOrderDetail";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
/*****
 *  ----------平台管理——二级频道管理-----获取所有频道
 *  @param {*} params
 * ******/
export const GetAllChannelTree = params => {

  const url = "Manage/Channel/GetAllChannelTree";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}

/*****
 *  ----------修改登录密码
 *  @param {*} params
 * ******/
export const ChangeUserPsd = params => {

  const url = "Manage/Users/ChangeUserPsd";
  const User = getUserInfo();
  const timeStamp = +new Date();
  const fetchDataJson = params;

  const Defaults = {
    TimeSpan: timeStamp,
    ...User,
    Token: spliceToken(timeStamp, fetchDataJson),
    Data: {
    }
  }
  Defaults.Data = Object.assign({}, Defaults.Data, params);
  return postWrap(url, Defaults);
}
