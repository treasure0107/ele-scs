<template>
  <div class="center-main" >
    <div v-if="type == '1'">
      <el-row class="breadcrumbs">
        <el-col :span="16">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/RecordList' }">交易记录</el-breadcrumb-item>
            <el-breadcrumb-item>买入XRP交易详情 </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <el-row class="infoBox">
        <el-col :span="6" class="account">
          <div>参与金额</div>
          <em v-text="(buyData.entrancemoney || '') + ' ' + (buyData.currency || '')"></em>
        </el-col>
        <el-col :span="6" class="account">
          <div>使用票数</div>
          <em v-text="buyData.votes">5</em>
        </el-col>
        <el-col :span="6" class="account">
          <div>使用备用金</div>
          <em v-text="buyData.deduction"></em>
        </el-col>
        <el-col :span="6" class="account">
          <div>实际支付总额</div>
          <em v-text="buyData.actualmoney"></em>
        </el-col>
      </el-row>
      <el-row class="infoBox border_b">
        <el-col :span="6" class="account">
          <div>已完成</div>
          <em v-text="buyData.paid"></em>
        </el-col>
        <el-col :span="6" class="account">
          <div>待完成</div>
          <em v-text="buyData.unpaid"></em>
        </el-col>

      </el-row>
    </div>
    <div v-if="type == '2'">
      <el-row class="breadcrumbs">
        <el-col :span="16">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/RecordList' }">交易记录</el-breadcrumb-item>
            <el-breadcrumb-item>卖出XRP交易详情 </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <el-row class="infoBox">
        <el-col :span="6" class="account">
          <div>卖出数量</div>
          <em v-text="saleData.num"></em>
        </el-col>
        <el-col :span="6" class="account">
          <div>单价</div>
          <em v-text="saleData.price + ' ' + saleData.currency"></em>
        </el-col>
        <el-col :span="6" class="account">
          <div>卖出总价 </div>
          <em v-text="saleData.totalprice + ' ' + saleData.currency"></em>
        </el-col>
        <el-col :span="6" class="account">
          <div>冻结备用金</div>
          <em v-text="saleData.availablecny"></em>
        </el-col>
      </el-row>
      <el-row class="infoBox border_b">
        <el-col :span="6" class="account">
          <div>可用备用金</div>
          <em v-text="saleData.frozencny"></em>
        </el-col>
        <el-col :span="6" class="account">
          <div>已完成</div>
          <em v-text="saleData.paid"></em>
        </el-col>
        <el-col :span="6" class="account">
          <div>待完成</div>
          <em v-text="saleData.unpaid"></em>
        </el-col>

      </el-row>
    </div>
    <div class="tab-list">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          prop="trade_no"
          label="订单编号"
          align="center"
          width="170">
        </el-table-column>
        <el-table-column
          prop="trade_party_id"
          label="交易ID"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="payment_money"
          label="收款金额"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="periods_name"
          label="期数"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="matching_time"
          label="匹配时间"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="success_time"
          label="完成时间"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="status_name"
          width="80"
          align="center"
          label="状态">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="80"
          fit=true>
          <template slot-scope="scope">
            <el-button @click="handleClickfiPayDetails(scope.row.id, scope.row.status)" type="text" size="small"
                       style="color:#5357E2;">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--<div class="page-wrap">
      <el-pagination
        prevText="上一页"
        nextText="下一页"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pagesize"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>-->
  </div>

</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  export default {
    data(){
      return {
        currentPage: 1,
        tableData: [],
        value: '',
        type: '',
        id: '',
        buyData: {},
        saleData: {},
        currentPage: 1,
        pagesize: 10,
        total: 0
      }

    },
    mounted(){
      var type = this.$route.params.type;
      this.type = type;
      var id = this.$route.params.id;
      this.id = id;
      this.getRecordDetial()
    },
    methods: {
      getRecordDetial(){
        let self = this;
        try {
          let url = baseUrl + "account/Record/getRecordDetail";
          let config = {
            method: "post",
            url: url + "?r=" + Math.random(),
            data:{
              type:self.type,
              id:self.id
            }
          };
          self.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              let data=result.data.data;
              if (self.type == '1') {
                self.buyData = data
              } else if (self.type == '2') {
                self.saleData = data
              }
              self.tableData = data.list
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      handleClickfiPayDetails(id,status){
          //买入
        if (this.type == 1 && status == 1) {
          this.$router.push('/unPayDetails?id=' + id + '&isBuy=1')
        } else if (this.type == 1 && status == 3) {
          this.$router.push('/havePayDetails?id=' + id + '&isBuy=1')
        } else if (this.type == 1 && status == 5) {
          this.$router.push('/hadDoneDetails?id=' + id + '&buySel=1')
        } else if (this.type == 1 && status == 2) {
          this.$router.push('/hadCancelDetails?id=' + id + '&buySel=1')
        } else if (this.type == 1 && status == 4) {
          this.$router.push('/appealDetails?no=' + id + '&buySel=1')
        } else if (this.type == 0 && status == 1) {
          this.$router.push('/unPayDetails?no=' + id + '&buySel=0')
        } else if (this.type == 0 && status == 3) {
          this.$router.push('/havePayDetails?no=' + id + '&buySel=0')
        } else if (this.type == 0 && status == 5) {
          this.$router.push('/hadDoneDetails?no=' + id + '&buySel=0')
        } else if (this.type == 0 && status == 2) {
          this.$router.push('/hadCancelDetails?no=' + id + '&buySel=0')
        } else if (this.type == 0 && status == 4) {
          this.$router.push('/appealDetails?no=' + id + '&buySel=0')
        }
      },
      handleSizeChange(){

      },
    },
    components: {}
  }

</script>
<style lang="scss" scoped>

</style>
