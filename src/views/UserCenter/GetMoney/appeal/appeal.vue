<template>
  <div class="order-list">
    <div class="tab-list non-payment">
      <el-table
        width="100%"
        :data="tableData">
        <el-table-column
          label="订单编号"
          width="170"
          align="center"
          fit=true>
          <template slot-scope="scope">
            <span>{{scope.row.trade_no}}</span>
            <!-- <router-link style="color:#5357E2;" :to="'/unPayDetails?id='+scope.row.trade_no">{{scope.row.trade_no}}
            </router-link> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="userid"
          label="交易方ID"
          width="80"
          align="center"
          fit=true>
        </el-table-column>
        <el-table-column
          porp = 'actual_money'
          label="收款金额"
          width="180"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.row.actual_money}}&nbsp;{{scope.row.payment_unit}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="匹配时间"
          width="158"
          align="center">
          <template slot-scope="scope">
            <span>{{timeFormate(scope.row.addtime)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="收款方式"
          align="center"
          width="80"
          fit=true>
          <template slot-scope="scope">
            <p>{{scope.row.payment}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="endtime"
          label="申诉时间"
          width="160"
          align="center">
        </el-table-column>
        <el-table-column
          label="上传凭证时间"
          width="120"
          align="center"
          fit=true>
          <template slot-scope="scope">
            <CountDown :timeCountdown="scope.row.daojishi" ></CountDown>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          align="center"
          fit=true>
          <template slot-scope="scope">
            <el-button @click="handleClickUnPayDetails(scope.row.id)" type="text" size="small"
                       style="color:#5357E2;">详情
            </el-button>
            <a href="#" class="upload-btn" v-if="scope.row.appeal_status==1">上传凭证</a>
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
          pageSize: 15
        }
      }
    },
    mounted(){
      if ( this.tabIndex == 4) {
        this.getData();
      }
    },
    watch: {
      checkValue(name) {
      },
      tabIndex(index){
        localStorage.setItem("tabIndex",index);
       // this.tabIndex = index;
        if (index == 4) {
          this.getData();
        }
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
      timeFormate(ms){
        return until.formatDate(new Date(ms));
      },
      //获取列表
      getData(){
        try {
          let url = baseUrl + "/account/Exchange/getTxApplerList";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              page: this.paginationNews.pageNum,       //当前分页，默认为1
              pagesize: this.paginationNews.pageSize,    //每页记录数，默认为10
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let listData = res.data.data;
              this.paginationNews.total = listData.total;
              this.tableData = listData.list;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      handleClickUnPayDetails(id) {  //详情
        this.$router.push('/GetMoneyAppealDetails?id=' + id);
      },
      countdown(row){
        console.log(row)
        /* var n = row.$index
         this.tableData.splice(n,1) */
      },
      handleSizeChange(){

      },
      handleCurrentChange(val){
        this.paginationNews.pageNum = val;
        this.getData()
      }
    },
    components: {
      CountDown
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../../../styles/mixin";

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

  .upload-btn {
    @include sc(12px, rgb(83, 87, 226));
  }

  .active {
    background: rgba(67, 118, 234, 1);
    font-size: 14px;
    color: #fff;
  }
</style>
<style>
  .un-pay-page .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgba(11, 12, 34, 1);
  }

</style>

