<template>
  <div class="order-list">
    <div class="filterBox">
      <el-button :class="{active:isbuy}" @click="buyBtn">买入订单管理</el-button>
      <el-button :class="{active:!isbuy}" @click="saleBtn" ref="sale">卖出订单管理</el-button>
    </div>
    <div class="tab-list non-payment">
      <el-table
        width="100%"
        :data="tableData">
        <el-table-column
          prop="trade_no"
          label="订单编号"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="trade_party_id"
          label="交易方ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="payment_money"
          :label="paymentMoney"
          width="220"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.payment_money}}</span>
            <span>{{scope.row.payment_unit}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="periods_name"
          label="期数"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          label="匹配时间"
          width="160"
          align="center">
          <template slot-scope="scope">
            <span>{{timeFormate(scope.row.matching_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="剩余支付时间"
          width="130"
          align="center">
          <template slot-scope="scope">
            <CountDown :timeCountdown="scope.row.residue_pay_time" @fnTimeOver="countdown(scope.$index)"></CountDown>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="80">
          <template slot-scope="scope">
            <el-button @click="handleClickUnPayDetails(scope.row.id)" type="text" size="small"
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
        @current-change="handleCurrentChange"
        :total="total"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        layout="prev, pager, next, jumper"
        background>
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
        tableData: [],
        currentPage: 1,
        total: 1,
        pageSize: 10,
        isShow: true,
        isbuy: 1,  //1买  0卖
        paymentMoney: '支付金额',
        periodsId: 0,   //期数，
      }
    },
    mounted(){
      if ( this.tabIndex == 0) {
        this.getAccountUnpaidIn();
      }
    },
    watch: {
      checkValue(name) {
        this.periodsId = name;
        if (this.isbuy == 1) {
          this.getAccountUnpaidIn();
        } else {
          this.getAccountUnpaidOut();
        }
      },
      tabIndex(index){
        if (index == 0) {
          this.getAccountUnpaidIn();
        }
      }
    },
    methods: {
      getAccountUnpaidIn(){    //买入
        try {
          let url = baseUrl + "account/trade_list/unpaid_in";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              page: this.currentPage,       //当前分页，默认为1
              pagesize: this.pageSize,    //每页记录数，默认为10
              periods_id: this.periodsId
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let listData = res.data.data;
              this.total = listData.count;
              this.tableData = listData.list;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getAccountUnpaidOut(){    //卖出
        try {
          let url = baseUrl + "account/trade_list/unpaid_out";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              page: this.currentPage,       //当前分页，默认为1
              pagesize: this.pageSize,    //每页记录数，默认为10
              periods_id: this.periodsId
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let listData = res.data.data;
              this.total = listData.count;
              this.tableData = listData.list;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      buyBtn(){   //买入
        this.isbuy = 1;
        this.currentPage = 1;
        this.paymentMoney = "支付金额";
        this.getAccountUnpaidIn();
      },
      saleBtn(){   //卖出
        this.isbuy = 0;
        this.currentPage = 1;
        this.paymentMoney = "收款金额";
        this.getAccountUnpaidOut();
      },
      handleClickUnPayDetails(id) {  //详情
        if (this.isbuy) {
          this.$router.push({path: '/unPayDetails', query: {id: id, isBuy: this.isbuy}});
        } else {
          this.$router.push({path: '/unPayDetails', query: {id: id, isBuy: this.isbuy}});
        }
      },
      handleSizeChange(){

      },
      handleCurrentChange(value){
        if (this.isbuy) {
          this.getAccountUnpaidIn()
        } else {
          this.getAccountUnpaidOut()
        }
      },
      formate(num) {
        if (num >= 10) {
          return num
        } else {
          return `0${num}`
        }
      },
      timeFormate(ms){  //转换时间 年月日
        var oDate = new Date(ms),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oHour = oDate.getHours(),
          oMin = oDate.getMinutes(),
          oSen = oDate.getSeconds(),
          oTime = oYear + '-' + this.formate(oMonth) + '-' + this.formate(oDay) + ' ' + this.formate(oHour) + ':' + this.formate(oMin) + ':' + this.formate(oSen);
        return oTime;
      },
    },
    components: {
      CountDown
    }
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

  .active {
    background: rgba(67, 118, 234, 1);
    font-size: 14px;
    color: #fff;
  }

  /deep/ .un-pay-page .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgba(11, 12, 34, 1);
  }
</style>
