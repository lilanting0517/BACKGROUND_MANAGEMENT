import md5 from "js-md5";
export const setItem = (name, val) => {
  val = JSON.stringify(val);

  return window.localStorage.setItem(name, val);
}
export const getItem = name => {
  name = window.localStorage.getItem(name);
  name = JSON.parse(name);

  return name
};
export const removeItem = opt => window.localStorage.removeItem(opt);


/**
 *  --------列表上移与下移-------
 * ********/
export const swapItems = function(arr, index1, index2){
  　　arr[index1] = arr.splice(index2,1,arr[index1])[0]
  　　return arr
}

/**
 * 拼接 token
 */
export const spliceToken = function (timeStamps, fetchDataJson) {
  let User = getItem('User')
  let JsonData = JSON.stringify(fetchDataJson);
  if (User){
    let {
      UserId,
      UserType,
      Token
    } = User;

    return md5(UserId + UserType + timeStamps + JsonData + Token);
  } else {
    return ''
  }

}

export const asideArr={

}

