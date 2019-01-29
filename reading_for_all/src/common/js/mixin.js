export const globelFnHanle = {
  methods: {
    /* 全局 ErrorCode 监听处理 */
    globelReqHandle({
      Success,
      ErrorMsg,
      data,
      total,
      ErrorCode
    }) {
      // console.log(Success, ErrorMsg, data, total, ErrorCode);
      if (ErrorCode === 100) {  
        /**
         * TODO:
         * 重定向至登录页
         */
        this.$router.push({name: 'Login'})

        return false;
      } else if (ErrorCode !== 0) {
        this.$message(ErrorMsg);
        // console.log(ErrorMsg);

        return false;
      }

      // return Promise.resolve([data, success]);
      return Promise.resolve([
        data,
        Success,
        ErrorMsg,
        total,
        ErrorCode
      ])
    },
    /* 全局 error 监听处理 */
    globelErrHandle(err) {
      console.log(err);
    }
  }
}
