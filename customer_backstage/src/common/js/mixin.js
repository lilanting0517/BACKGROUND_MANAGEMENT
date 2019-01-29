import { mapState, mapMutations } from "vuex";
export const globelFnHanle = {
  methods: {
    /* 全局 ErrorCode 监听处理 */
    globelReqHandle({
      Success,
      ErrorMsg,
      Data,
      Total,
      ErrorCode
    }) {
      if (ErrorCode === 100) {
        /**
         * TODO:
         * 重定向至登录页
         */
        return false;
      } else if (ErrorCode !== 0) {
        if (ErrorMsg == "参数VerCode为空") ErrorMsg = "验证码不能为空";
        this.$message.error(ErrorMsg);
        return Promise.reject();
      }
      return Promise.resolve(Data);
    },
    /* 全局 error 监听处理 */
    globelErrHandle(err) {
      const isObject = typeof err === 'object';

      if (isObject) {
        err = err.message ? err.message : err.ErrorMsg;;
      }

      console.log(err);
      this.$message.error(err);
    },

  }
}
export const globelFnHanle1 = {
  methods: {
    /* 全局 ErrorCode 监听处理 */
    globelReqHandle1(res) {
      if (res.ErrorCode === 100) {
        /**
         * TODO:
         * 重定向至登录页
         */
        return false;
      } else if (res.ErrorCode !== 0) {
        if (res.ErrorMsg == "参数VerCode为空") {res.ErrorMsg = "验证码不能为空"}
        this.$message.error(res.ErrorMsg);
       return Promise.reject();
      }
      return Promise.resolve(res);
    },
    /* 全局 error 监听处理 */
    globelErrHandle(err) {
      const isObject = typeof err === 'object';

      if (isObject) {
        err = err.message ? err.message : err.ErrorMsg;
      }
      this.$message.error(err);
    }
  }
}
export const globeTableLoding = {
  methods: {
    ...mapMutations(["setLoading"]),
  },
  computed: {
    ...mapState(["loading"])
  }
}

export const pagination = {
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
    }
  }
}
export const checkAll = {
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionAllChange(tableData) {
      const isChecked = !this.allSelect;
      if (tableData) {
        tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, isChecked);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    }
  },
  computed: {
    allSelect: function () {
      return this.multipleSelection.length === this.tableData.length;
    }
  }
}
export const loadingStatus = {
  computed: {
    ...mapState(["loading", "modalLoading","noBook"]),
  },
  methods: {
    ...mapMutations(["setLoading", "setMLoading"]),
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + (index + 1);
    },
  }

}

