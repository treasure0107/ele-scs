<template>
  <div class="order-list">
    <div class="filterBox">
      <el-button :class="{active:isShow}" @click="buyBtn">买入订单管理</el-button>
      <el-button :class="{active:!isShow}" @click="saleBtn" ref="sale">卖出订单管理</el-button>
    </div>
    <div class="tab-list">
      <el-table
        width="100%"
        :data="tableData"
        stripe>
        <el-table-column
          prop="trade_no"
          label="订单编号"
          align="center"
          width="250">
        </el-table-column>
        <el-table-column
          prop="trade_party_id"
          width="130"
          label="交易方ID"
          align="center"
          fit=true>
        </el-table-column>
        <el-table-column
          prop="periods_name"
          label="期数"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          label="匹配时间"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span v-text="dateFn(scope.row.matching_time)"></span>
          </template>
        </el-table-column>
        <el-table-column
          :label="finTime"
          width="150"
          align="center">
          <template slot-scope="scope">
            <span v-text="dateFn(scope.row.finish_time)"></span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="140"
          fit=true>
          <template slot-scope="scope">
            <el-button @click="handleClickfiPayDetails(scope.row.id)" type="text" size="small"
                       style="color:#5357E2;">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="page-wrap un-pay-page" v-if="tableData && tableData.length"
         style="text-align:center; margin-top: 30px;">
      <el-pagination
        prevText="<"
        nextText=">"
        @size-change="handleSizeChange"
        @current-change="getAccountFipaidIn"
        :total="paginationNews.total"
        :page-size="paginationNews.pageSize"
        :current-page.sync="paginationNews.pageNum"
        layout="prev, pager, next, jumper"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import CountDown from "@/components/CountDown";
  export default {
    props: ["checkValue", "tabIndex"],
    data(){
      return {
        currentPage: 1,
        tableData: [],
        paginationNews: {
          pageNum: 1,
          total: 1,
          pageSize: 10
        },
        isShow: true,
        finTime: '完成时间',
        periodsId: 0,   //期数
        buySel: 1
      }

    },
    watch: {
      checkValue(name) {
      },
      tabIndex(index){
        this.tabIndex = index;
        if (index == 2) {
          this.getAccountFipaidIn();
        }
      }
    },
    mounted(){
      if (this.tabIndex == 2) {
        this.getAccountFipaidIn();
      }
    },
    methods: {
      getAccountFipaidIn(){    //买入
        try {
          let url = baseUrl + "account/trade_list/finish_in";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              page: this.paginationNews.pageNum,       //当前分页，默认为1
              pagesize: this.paginationNews.pageSize,    //每页记录数，默认为10
              periods_id: this.periodsId
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.buySel = 1;
              let listData = res.data.data;
              this.paginationNews.total = listData.count;
              this.tableData = listData.list;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getAccountFipaidOut(){    //卖出
        try {
          let url = baseUrl + "account/trade_list/finish_out";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              page: this.paginationNews.pageNum,       //当前分页，默认为1
              pagesize: this.paginationNews.pageSize,    //每页记录数，默认为10
              periods_id: this.periodsId
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.buySel = 0;
              let listData = res.data.data;
              this.paginationNews.total = listData.count;
              this.tableData = listData.list;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      buyBtn(){   //买入
        this.finTime = "完成时间";
        this.getAccountFipaidIn();
        this.isShow = true;
      },
      saleBtn(){   //卖出
        this.finTime = "完成时间";
        this.isShow = false;
        this.getAccountFipaidOut();
      },
      dateFn(matching_time){   //卖出
        return until.getDate(matching_time);
      },
      handleClickfiPayDetails(id) {  //详情
        this.$router.push('/hadDoneDetails?id=' + id + '&buySel=' + this.buySel);
      },
      handleSizeChange(){

      },
      handleCurrentChange(){

      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    components: {}
  }
</script>

<style lang="scss" scoped>
  .boxer {
    position: relative;
    .seachBox {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 99
    }
  }

  .filterBox {
    display: flex;
  }

  .filterBox button {
    flex: 1
  }
  .boxer {
    position: relative;
    .seachBox {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 99
    }
  }
  .active {
    background: rgba(67, 118, 234, 1);
    font-size: 14px;
    color: #fff;
  }
  /deep/ .un-pay-page .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgba(11, 12, 34, 1);
  }
</style>
