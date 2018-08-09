<template>
  <div class="center-main">
    <h1 class="bread-title">
      <span class=""> 邀请好友</span> <span class="jt"> > </span> <span class="current"> 提现记录</span>
    </h1>
    <div class="boxer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待支付" name="first">
          <unPayList :tabIndex="tabIndex" :checkValue="searchName"></unPayList>
        </el-tab-pane>
        <el-tab-pane label="已付款" name="second">
          <havePayList :tabIndex="tabIndex" :checkValue="checkValue"></havePayList>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="third">
          <hadDoneList :tabIndex="tabIndex" :checkValue="checkValue"></hadDoneList>
        </el-tab-pane>
        <el-tab-pane label="已取消" name="fourth">
          <hadCancelList :tabIndex="tabIndex" :checkValue="checkValue"></hadCancelList>
        </el-tab-pane>
        <el-tab-pane label="申诉中" name="five">
          <appealList :tabIndex="tabIndex" :checkValue="checkValue"></appealList>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import {imgBaseUrl} from "@/config/env";
  //未支付
  import unPayList from "@/views/UserCenter/GetMoney/unPay/unPay";
  //已付款
  import havePayList from "@/views/UserCenter/GetMoney/havePay/havePay";
  //已完成
  import hadDoneList  from "@/views/UserCenter/GetMoney/hadDone/hadDone";
  //已取消
  import hadCancelList  from "@/views/UserCenter/GetMoney/hadCancel/hadCancel";
  //申诉中
  import appealList  from "@/views/UserCenter/GetMoney/appeal/appeal";
  export default {
    data(){
      return {
        currentPage: 1,
        tableData: [],
        activeName: "first",
        radio: '买入',
        searchName: "",
        keyWords: "",
        periodslist: [],
        checkValue: "请选择",
        tabIndex: localStorage.getItem("getMoneyTabPaneIndex") || 0,
        activeName: localStorage.getItem("getMoneyTabName") || "first"
      }
    },
    watch: {
      checkValue(value){
        this.searchName = value;
      },
      tabIndex(value){
        this.tabIndex = value;
      }
    },
    mounted(){
    },
    methods: {
      handleSizeChange(){

      },
      handleCurrentChange(){

      },
      handleClick(tab, event) {
        this.tabIndex = tab.index;
        if (window.localStorage) {
          localStorage.setItem("getMoneyTabName", tab.name);
          localStorage.setItem("getMoneyTabPaneIndex", tab.index);
        }
      }
    },
    components: {
      unPayList,
      havePayList,
      hadDoneList,
      hadCancelList,
      appealList
    }
  }

</script>

<style lang="scss" scoped>
  @import "./../../../styles/mixin";

  .boxer {
    position: relative;
    .seachBox {
      width: 300px;
      position: absolute;
      right: 0;
      top: 0px;
      z-index: 99;
      .dropdown-lilst {
        width: 300px;
      }
    }
  }

  /deep/ .el-tabs__item {
    height: 50px;
    line-height: 50px;
  }

  .bread-title {
    padding: 10px 0;
    span {
      @include sc(16px, #666666);
    }
    span.current {
      color: #333333;
    }
    span.jt {
      padding: 0 5px;
    }
  }

  .filterBox {
    display: flex;
  }

  .filterBox button {
    flex: 1
  }
</style>
