<template>
  <div class="center-main">
    <h1 class="center-title">
      订单列表
    </h1>
    <div class="boxer">
      <div class="seachBox">
        <el-select v-model="checkValue" placeholder="请选择" class="dropdown-lilst">
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in periodslist"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" ref="tab">
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
  //未支付
  import unPayList from "@/views/UserCenter/Order/unPay/unPay";
  //已付款
  import havePayList from "@/views/UserCenter/Order/havePay/havePay";
  //已完成
  import hadDoneList  from "@/views/UserCenter/Order/hadDone/hadDone";
  //已取消
  import hadCancelList  from "@/views/UserCenter/Order/hadCancel/hadCancel";
  //申诉中
  import appealList  from "@/views/UserCenter/Order/appeal/appeal";
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
        tabIndex: localStorage.getItem("orderTabPaneIndex") || 0,
        activeName: localStorage.getItem("orderTabName") || "first"
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
      if (this.$route.query.tabIndex) {
        this.tabIndex = this.$route.query.tabIndex;
        this.activeName = this.$refs.tab.$refs.nav.panes[this.tabIndex].name;
      }
      this.getPeriodsList();
    },
    methods: {
      getPeriodsList(){
        try {
          let url = baseUrl + "/account/trade_list/get_periods_list";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {}
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              this.periodslist = result.data.data;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      handleSizeChange(){

      },
      handleCurrentChange(){

      },
      handleClick(tab, event) {
        this.tabIndex = tab.index;
        if (window.localStorage) {
          localStorage.setItem("orderTabPaneIndex", tab.index);
          localStorage.setItem("orderTabName", tab.name);
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

  .filterBox {
    display: flex;
  }

  .filterBox button {
    flex: 1
  }
</style>
