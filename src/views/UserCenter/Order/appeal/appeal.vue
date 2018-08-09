<template>
  <div class="order-list">
    <div class="filterBox">
      <el-button :class="{on:isbuy}" @click="getIn()">买入</el-button>
      <el-button :class="{on:!isbuy}" @click="getOut()">卖出</el-button>
    </div>
    <div class="tab-list">
      <el-table
        :data="tableData"
        style="width:120%">
        <el-table-column
          align="center"
          prop="trade_no"
          label="订单编号"
          width='170'
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="trade_party_id"
          label="交易方ID">
        </el-table-column>
        <el-table-column
          align="center"
          label="支付金额"
          width='210'>
          <template slot-scope="scope">
            <span>{{scope.row.payment_money}}&nbsp;{{scope.row.payment_unit}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="periods_name"
          label="期数">
        </el-table-column>
        <el-table-column
          align="center"
          label="匹配时间"
          width="160">
          <template slot-scope="scope">
            <span>{{time(scope.row.matching_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isbuy==0"
          align="center"
          prop="payment"
          label="收款方式">
        </el-table-column>
        <el-table-column
          align="center"
          label="申诉时间"
          width="160">
          <template slot-scope="scope">
            <span>{{time(scope.row.appeal_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="upload_time"
          label="上传凭证时间"
          width='160'>
          <template slot-scope="scope">
            <CountDown :timeCountdown="scope.row.upload_time"></CountDown>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="120  ">
          <template slot-scope="scope">
            <router-link :to="'/appealDetails?no='+scope.row.id+'&isbuy='+isbuy"><span style="color:#5357E2">详情</span>
            </router-link>
            <router-link v-if="scope.row.is_can_appeal" :to="'/UploadProof?no='+scope.row.id+'&isbuy='+isbuy"><span
              style="color:#5357E2">上传凭证</span></router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrap">
      <el-pagination
        prevText="上一页"
        nextText="下一页"
        @current-change="handleCurrentChange"
        :current-page.sync="isbuy == 1?page1:page0"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import CountDown from "@/components/CountDown"
  export default {
    props: ["checkValue", "tabIndex"],
    data(){
      return {
        isbuy: 1,//1买  0 卖
        periods: 0,//期数
        page1: 1,//买的页数
        page0: 1,//卖的页数
        count: 0,
        currentPage: 1,
        tableData: [],
        value: '',
        activeName: "first",
        radio: '买入',
      }
    },
    mounted(){
      if (this.tabIndex == 4) {
        this.getIn();
      }
    },
    methods: {
      formate(num) {
        if (num >= 10) {
          return num
        } else {
          return `0${num}`
        }
      },
      time(ms){
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
      //买入
      getIn(){
        this.isbuy = 1
        try {
          let url = baseUrl + "/account//trade_list/appeal_in";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {page: this.page1, periods_id: this.periods}
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              this.tableData = result.data.data.list
              this.count = result.data.data.count
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      countdown(row){
        /* var n = row.$index
         this.tableData.splice(n,1) */

      },
      //卖出
      getOut(){
        this.isbuy = 0
        try {
          let url = baseUrl + "account//trade_list/appeal_out";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {page: this.page0, periods_id: this.periods}
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              this.tableData = result.data.data.list
              this.count = result.data.data.count
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      handleCurrentChange(value){
        if (this.isbuy) {
          this.page1 = value
          this.getIn()
        }
        else {
          this.page0 = value
          this.getOut()
        }
      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    watch: {
      checkValue(name) {
        this.periods = name
        if (this.isbuy == 1)
          this.getIn()
        else
          this.getOut()
      },
      tabIndex(index){
        if (index == 4) {
          this.getIn()
        }
      }
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

  div.tab-list {
    table {
      text-align: center;
    }
  }

  .on {
    background: #4376ea;
    color: #fff;
  }
</style>
