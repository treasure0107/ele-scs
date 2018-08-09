<template>
  <div class="noLeftBox container" v-cloak>
    <el-container>
      <el-main>
        <el-row class="breadcrumbs">
          <el-col :span="16">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/Order' }">订单列表</el-breadcrumb-item>
              <el-breadcrumb-item>订单详情</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
        </el-row>

        <div class="orderStatus">订单详情 <span class="mark">{{state}}</span></div>

        <div class="details-box">
          <div class="aside clearFix">
            <ul>
              <li><span>交易对象</span></li>
              <li>
                <img :src="imgurl+userInfo.avatar" style="width:100px;border-radius:50%">
                <p style="margin-top:5px;">
                  {{replaceX(userInfo.user_name)}}
                </p>
              </li>
              <li>ID : {{userInfo.user_id}}</li>
              <li>联系 :
                <p v-if="userInfo.country == 1 " style="color:#347FEE;margin-top:5px;">
                  {{userInfo.mobile}}
                </p>
                <p v-else style="color:#347FEE;margin-top:5px;">
                  {{userInfo.email}}
                </p>
              </li>
            </ul>
          </div>
          <div class="main">
            <p class="gray">订单号: {{trade_no}}</p>
            <p class="gray" v-if="isbuy == 1">支付金额: <span class='money'> {{payment_money}}</span> <span style='color:#333;font-weight:bold;font-size:15px;'>{{payment_unit}}</span> </p>
            <p class="gray" v-if="isbuy == 0">收款金额: <span class='money'> {{payment_money}}</span> <span style='color:#333;font-weight:bold;font-size:15px;'>{{payment_unit}}</span></p>
            <P v-if="!is_reject" style="color:#ee0101;font-size:20px">订单申诉中，申诉结果由客服审核之后判定。</P>
            <p v-if="!is_reject" class="gray" style="margin-top:10px;">上传更多的真实凭证，有利于客服判定。</p>
            <!-- 申诉被驳回 -->
            <P v-if="is_reject" style="color:#ee0101;font-size:20px">对不起,您的申诉被驳回,请重新上传凭证!</P>
            <p v-if="is_reject" class="gray" style="margin-top:10px;">由于您提交的资料不能够证明您已转账,请重新上传!</p>

            <p v-if="is_can_appeal">请于&nbsp;
              <span style="color:#EE0101;font-size:20px;">
                <template>
                  <CountDown  :timeCountdown="time"></CountDown>
                </template>
              </span>
              &nbsp;内上传凭证，若超时未上传则判定您败诉，资产损失由您自己承担。
            </p>
            <p v-if="is_can_appeal">
              <el-button type="primary" round style="width:180px;" @click="$router.push('/UploadProof?isbuy='+isbuy+'&no='+no)">上传凭证</el-button>
            </p>
            <ul v-else>
              <li>
                <el-button type="warning" disabled round style="width:180px;margin:20px 0">申诉中</el-button>
              </li>
              <li>请耐心等待客服审核，申诉结果会发送至您绑定的账号。</li>
            </ul>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import {imgBaseUrl} from "@/config/env";
  import CountDown from "@/components/CountDown"

  export default {
    data(){
      return {
        imgurl:'',
        trade_no:'',//订单号
        no:'',//订单id
        isbuy:'',//1买  0 卖
        state:'申诉中',//申诉状态
        is_can_appeal:false,
        is_reject:false,
        cancleDialog:false,
        payment_money:'',
        payment_unit:'',
        time:0,
        userInfo:{
          user_name:'',
          avatar:'--',
          email:'--',
          mobile:'***********',
          user_id:'--'
        }
      }

    },
    created(){
      this.no = this.$route.query.no
      this.isbuy = this.$route.query.isbuy
    },
    mounted(){
      if(this.isbuy == 1)
        this.getDetailsIn()
      if(this.isbuy == 0)
        this.getDetailsOut()
      this.imgurl = imgBaseUrl
    },
    methods: {
      //买
      getDetailsIn(){
         try {
            let url = baseUrl + "/account/trade_detail/appeal_in";
            let config = {
              method: "POST",
              url: url + "?r=" + Math.random(),
              data:{id:this.no}
            };
            this.$axios(config).then(result => {
              if (until.responesValidate(result)) {
                this.trade_no = result.data.data.trade_no
                this.payment_money = result.data.data.payment_money
                this.payment_unit = result.data.data.payment_unit
                this.time = result.data.data.residue_appeal_time
                this.userInfo  = result.data.data.user_info
                this.is_can_appeal = result.data.data.is_can_appeal
                this.is_reject = result.data.data.is_reject
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
      },
      //卖
      getDetailsOut(){
         try {
            let url = baseUrl + "/account/trade_detail/appeal_out";
            let config = {
              method: "POST",
              url: url + "?r=" + Math.random(),
              data:{id:this.no}
            };
            this.$axios(config).then(result => {
              if (until.responesValidate(result)) {
                this.trade_no = result.data.data.trade_no
                this.payment_money = result.data.data.payment_money
                this.payment_unit = result.data.data.payment_unit
                this.time = result.data.data.residue_appeal_time
                this.userInfo  = result.data.data.user_info
                this.is_can_appeal = result.data.data.is_can_appeal
                this.is_reject = result.data.data.is_reject
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
      },
      replaceX(str){
        return str.replace(/(.{2}).+(.{2})/g, "$1****$2");
      },
      countdown(){
        console.log(1)
      },
      /* //取消订单
      cancleOrder(){
         try {
            let url = baseUrl + "/account/trade_user_action/do_cancel";
            let config = {
              method: "POST",
              url: url + "?r=" + Math.random(),
              data:{trade_no:this.trade_no,pay_password:this.tradePsd}
            };
            this.$axios(config).then(result => {
              if (until.responesValidate(result)) {
                if(result.data.data.code == 1){
                  this.$message({
                    message: '订单取消成功',
                    type: 'success'
                  });
                  this.$router.push('/Order')
                }
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
      } */
    },
    components: {CountDown}
  }

</script>

<style lang="scss" scoped>
[v-clock]{
display: none;
}
.gray{
  color:#999;
}
.money{
  color:#333;
  font-size:20px;
  font-weight: bold;
}

.orderStatus{font-weight: bold;font-size: 24px;
  .el-badge{margin-left: 20px;}
}
div.details-box{
  display:flex;
  margin-top: 30px;
  height: 420px;
  border:1px solid #EEE;
  div.aside{
    width:235px;
    text-align: center;
    background: #fbfbfb;
    display:flex;
    ul{
      width:100%;
      li{
        margin-top: 30px;
      }
      li:first-child{
        text-align: left;
          span{
            background:#5BB8ED;
            color:#fff;
            display: inline-block;
            border-radius:0 10px 10px 0;
            padding:5px 8px;
          }
      }
    }
  }
  div.main{
    width:600px;
    padding-left: 50px;
    p{
      margin-top:40px;
    }
    ul{
      li:last-child{
        width:340px;
        height: 34px;
        line-height: 34px;
        background: #F8F5E6;
        padding-left:15px;
      }
    }
  }
}

.mark{
  display:inline-block;
  background:#FA8E46;
  width:100px;
  width:73px;
  height:28px;
  border-radius:12px;
  font-size:12px;
  font-family:MicrosoftYaHei;
  text-align: center;
  line-height: 28px;
  margin:0 0 0 16px;
  color:#fff;
}
</style>
