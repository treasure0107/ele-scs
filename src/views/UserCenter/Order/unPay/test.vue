<template>
  <div class="order-list">
    <div class="filterBox">
      <el-button type="primary" @click="buyBtn">买入</el-button>
      <el-button @click="saleBtn" ref="sale">卖出</el-button>
    </div>
    <div class="tab-list non-payment">
      <el-table
        width="100%"
        :data="tableData"
        stripe>
        <el-table-column
          label="订单编号"
          align="center" fit=true>
          <template slot-scope="scope">
            <router-link style="color:#5357E2;" :to="'/unPayDetails?id='+scope.row.id">{{scope.row.id}}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="counterpartyId"
          label="交易方ID"
          width="140"
          align="center">
        </el-table-column>
        <el-table-column
          prop="needPay"
          label="需要支付"
          width="160"
          align="center">
        </el-table-column>
        <el-table-column
          prop="date"
          label="匹配时间"
          width="160"
          align="center">
        </el-table-column>
        <el-table-column
          prop="remainPayTime"
          label="剩余支付时间"
          align="center"
          fit=true>
          <template slot-scope="scope">
            <span style="color:#E6403D;">25分36秒</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="action"
          label="操作"
          align="center"
          fit=true>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small" style="color:#5357E2;">详情</el-button>
            <el-button type="text" size="small" style="color:#5357E2;" @click="accountPaid">我已付款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrap">
      <el-pagination
        prevText="上一页"
        nextText="下一页"
        @size-change="handleSizeChange"
        @current-change="getUnPayList"
        :current-page.sync="currentPage"
        :page-size="5"
        layout="prev, pager, next, jumper"
        :total="100">
      </el-pagination>
    </div>

    <el-dialog title="确认支付" custom-class="surePay-main" width="620px" :visible.sync="dialogSurePayVisible">
      <div class="surePayContent">
        <div class="surePayConTit">
          <span class="s-p-tit">买入XRP</span>
          <div class="s-p-m-c">
            <span class="s-p-m-tit">付款方式：</span>
            <el-select v-model="value" placeholder="请选择" class="s-p-m-select">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="iconSurePay">
          <p>亲爱的用户：</p>
          <p>1、如果您已支付完成请点击下方【确认付款】</p>
          <p>2、对于未支付完成，却点击【确认付款】的用户会降低信用权重，甚至
            冻结账户使用权限，请您知悉。</p>
        </div>
      </div>
      <footer slot="footer" class="dialog-footer">
        <div style="float:left;padding-top: 10px;">
          实际支付：
          <span style="color:#FD8238;">
            <span style="font-size:14px; font-weight: bold;">198000</span>
            <span style=font-size:12px;>CNY</span>
          </span>
        </div>
        <el-button title="" type="primary" v-dbClick @click="surePay"
                   style="width:180px;height:40px;background-color:#2E6AF4;border-radius:20px;box-shadow:1px 0 3px rgba(88,126,215,0.52);">
          确认付款
        </el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script type="text/babel">

  export default {
    props: ["checkValue","tabIndex"],
    data(){
      return {
        currentPage: 1,
        tableData: [
          {
            id: 68214685212,
            counterpartyId: 33633666666,
            needPay: '654.20 CNY',
            date: "2018-10-10 10:10:10",
            remainPayTime: '25分36秒',
            action: ''
          }
        ],
        value: '微信支付',
        activeName: "first",
        radio: '买入',
        dialogSurePayVisible: false,
        options: [{
          value: '选项1',
          label: '微信支付'
        }, {
          value: '选项2',
          label: '支付宝支付'
        }, {
          value: '选项3',
          label: '银行卡支付'
        }, {
          value: '选项4',
          label: 'USDT支付'
        }],
      }
    },
    watch: {
      checkValue(name) {
        console.log("watch123")
        console.log(name);
      },
      tabIndex(index){
        console.log("index")
        console.log(index);
      }
    },
    mounted()
    {
      console.log("watch123")
      console.log(this.checkValue);
      console.log(this.tabIndex);
//      this.tableData = new Array(10).fill(obj)
    }
    ,
    methods: {
      buyBtn()
      {   //买入
        console.log('买入');
      }
      ,
      saleBtn()
      {   //卖出
        console.log('卖出');
//        this.$refs.sale.className('el-button--primary')
//        console.log(this.$refs.sale);
      }
      ,
      accountPaid()
      {   //已付款
        this.dialogSurePayVisible = true;
      }
      ,
      surePay()
      {   //确认支付弹窗

      }
      ,
      handleSizeChange()
      {

      }
      ,
      handleCurrentChange()
      {

      }
      ,
      getUnPayList()
      {

      }
      ,
      handleClick(tab, event)
      {
        this.$router.push('/unPayDetails?id=');
        console.log(tab, event);
      }
    }
    ,
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

  .surePayConTit {
    position: relative;
    height: 30px;
    margin-bottom: 16px;
  }

  .s-p-m-c {
    position: absolute;
    right: 3px;
    top: -10px;
  }

  .iconSurePay {
    /*width:100%;*/
    height: 90px;
    background: rgba(246, 246, 246, 1);
    border-radius: 2px;
    font-family: MicrosoftYaHei-Bold;
  }

  .s-p-tit {
    width: 110px;
    height: 26px;
    font-size: 26px;
    color: #333;
    line-height: 18px;
  }

  .s-p-m-tit {
    width: 132px;
    height: 12px;
    font-size: 14px;
    color: rgba(153, 153, 153, 1);
    line-height: 18px;
    margin-left: 100px;
  }

  .s-p-m-select {
    width: 100px;
    font-size: 14px;
    color: #333333;
  }

  .iconSurePay {
    color: rgba(102, 102, 102, 1);
    line-height: 24px;
    padding: 22px;
  }
</style>
<style>
  .surePay-main .el-dialog__title {
    font-size: 20px;
    font-family: MicrosoftYaHei-Bold;
    color: rgba(51, 51, 51, 1);
    line-height: 30px;
    font-weight: bold;
  }

  .surePay-main .el-dialog__body {
    padding-top: 20px;
  }

  .s-p-m-select .el-input__inner {
    padding: 0;
    border: none;
  }
</style>

