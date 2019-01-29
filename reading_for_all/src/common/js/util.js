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
 * 拼接 token
 */
export const spliceToken = function(timeStamps) {
  let User = getItem('User')
  console.log(User)
  // let paramsJson = JSON.stringify(params)
  // debugger
    let UserId = User.UserName
    let { UserType, Token } = User
    UserType = UserType.toLowerCase()
    let result = md5(UserId + UserType + timeStamps + Token);
    // console.log(UserId + UserType + timeStamps + JsonData + Token)
    return result

}
export const swapItems = function(arr, index1, index2){
  　　arr[index1] = arr.splice(index2,1,arr[index1])[0]
  　　return arr
}
