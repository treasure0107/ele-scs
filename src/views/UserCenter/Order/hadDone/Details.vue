<template>
  <div class="noLeftBox container">
    <div>
      <el-row class="breadcrumbs">
        <el-col :span="16">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Order' }">订单列表</el-breadcrumb-item>
            <el-breadcrumb-item>订单详情</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <div class="orderStatus">订单详情
        <el-badge class="mark" value="已完成"/>
      </div>
    </div>
    <div>
      <div>
        <div class="details-box">
          <div class="aside clearFix">
            <ul>
              <li style="text-align: left">
                <span class="trader-icon">交易对象</span>
              </li>
              <li>
                <img src="./../../../../assets/1.jpg" class="trader-photo">
                <!--<img :src="avatarPhoto" class="trader-photo">-->
                <p class="trader-name" v-if="userInfo.country==1">{{formatPhone(userInfo.mobile||'')}}</p>
                <p class="trader-name"  v-else>{{formatEmail(userInfo.email||'')}}</p>
              </li>
              <li>
                <p style="font-size:12px;margin-bottom:13px;color:#999;">ID</p>
                <p>{{userInfo.user_id}}</p>
              </li>
              <li>
                <p style="font-size:12px;margin-bottom: 13px;color:#999;">账号</p>
                <p style="color:#347FEE;">{{userInfo.user_name}}</p>
              </li>
            </ul>
          </div>
          <div class="orderMain">
            <div class="order-info-news">
              <el-row>
                <el-col :span="24">
                  <label>订单号：</label><span>{{trade_no}}</span>
                </el-col>
                <el-col :span="24">
                  <label>收款金额：</label><span><b>{{payment_money}}</b> {{payment_unit}} </span>
                </el-col>
                <el-col :span="24">
                  <img id="img1" style="display:none;float: left;margin-top: 10px;" src="./../../../../assets/fin.png" alt="">
                  <img id="img2" style="display:none;float: left;margin-top: 10px;" src="./../../../../assets/shengsu.png" alt="">
                  <img id="img3" style="display:none;float: left;margin-top: 10px;" src="./../../../../assets/baisu.png" alt="">
                  <div class="con">
                  <p>{{test}}<span style="font-size: 20px;color:#EE8F15">{{sr}}</span><span style="font-size: 20px;color:#EE0404">{{sc}}</span></p>
                  <p style="display: none;font-size: 14px" id="pp">败诉原因：由于买方上传凭证真实有效，确认已给您转账。</p>
                  <p style="display: none;font-size: 14px" id="vv">交易数字资产已转至您的账户。</p>
                  <p style="font-size: 14px">如有疑问，请<span style="color:#5357E2">联系我们</span></p>
                </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl,imgBaseUrl} from "@/config/env";
  import CountDown from "@/components/CountDown";
  import Clipboard from 'clipboard';
  let cliboard = new Clipboard('.coopyBtn');
  export default {
    data(){
      return {
        userInfo:{},
        avatarPhoto:'',
        trade_no:0,   //订单号
        payment_money:0,
        flag: false,
        test: '',
        sr: '',
        sc: '',
        payment_unit: ''
      }
    },
    mounted(){
      let buySel=this.$route.query.buySel;
      if (buySel==1) {
        this.getDetailsIn();
      } else {
        this.getDetailsOut();
      }
    },
    methods: {
      getDetailsIn(){    //买入
        let id=this.$route.query.id;
//        let id=this.$route.params.id;
        try {
          let url = baseUrl + "account/trade_detail/finish_in";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              id:id
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let dataObj=res.data.data;
              this.userInfo=dataObj.user_info;
              this.avatarPhoto=imgBaseUrl+this.userInfo.avatar;  //头像
              this.trade_no=dataObj.trade_no;
              this.payment_unit = dataObj.payment_unit;
              this.flag = dataObj.is_appeal;
              if (!dataObj.is_appeal) {
                document.getElementById('img1').style.display='block';
                document.getElementById('img2').style.display='none';
                document.getElementById('img3').style.display='none';
                this.test = '订单交易已完成'
                this.sr = '';
                this.sc = '';
              } else {
                document.getElementById('img1').style.display='none';
                document.getElementById('img2').style.display='block';
                document.getElementById('img3').style.display='none';
                document.getElementById('vv').style.display='block';
                this.test = '申诉结果：'
                this.sr = '胜诉'
                this.sc = ''
              }
              this.payment_money=dataObj.payment_money;

            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getDetailsOut(){    //卖出
        let id=this.$route.query.id;
//        let id=this.$route.params.id;
        try {
          let url = baseUrl + "account/trade_detail/finish_out";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              id:id
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let dataObj=res.data.data;
              this.userInfo=dataObj.user_info;
              this.avatarPhoto=imgBaseUrl+this.userInfo.avatar;  //头像
              this.trade_no=dataObj.trade_no;
              this.payment_unit = dataObj.payment_unit;
              this.flag = dataObj.is_appeal;
              if (!dataObj.is_appeal) {
                document.getElementById('img1').style.display='block';
                document.getElementById('img2').style.display='none';
                document.getElementById('img3').style.display='none';
                this.test = '订单交易已完成'
                this.sr = ''
                this.sc = ''
              } else {
                document.getElementById('img1').style.display='none';
                document.getElementById('img2').style.display='none';
                document.getElementById('img3').style.display='block';
                document.getElementById('pp').style.display='block';
                this.test = '申诉结果：'
                this.sr = ''
                this.sc = '败诉'
              }
              this.payment_money=dataObj.payment_money;

            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      doPay(){
        alert("我已经付款")
      },
      formatPhone(phone) {
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      },
      formatEmail(email) {
        return email.replace(/(.{2}).+(.{2}@.+)/g, "$1****$2");
      },
    },
    components: {
      CountDown
    }
  }
</script>
<style lang="scss" scoped>
  .noLeftBox{
    padding: 50px 0 50px 102px;
  }

  .orderStatus {
    font-weight: bold;
    font-size: 24px;
    .el-badge {
      margin-left: 20px;
    }
  }

  .details-box {
    display: flex;
    margin-top: 30px;
    height: 608px;
    border: 1px solid #EEE;
    .aside {
      width: 235px;
      text-align: center;
      background: #FBFBFB;
      display: flex;
      ul {
        width: 100%;
        li {
          margin-top: 20px;
          p{
            margin-left: 40px;
            text-align: left;
            font-size:14px;
          }
          .trader-icon{
            display: inline-block;
            font-size:12px;
            width:64px;
            height:20px;
            line-height: 20px;
            text-align: center;
            background:#5BB8ED;
            border-radius:0 10px 10px 0;
            color:#fff;
          }
          .trader-photo{
            display: inline-block;
            width:60px;
            height:60px;
            border-radius: 100% ;
          }
          .trader-name{
            font-size:14px;
            padding:12px 0 18px ;
            margin:0 40px;
            border-bottom:1px solid #EEEEEE;
            text-align: center;
          }
        }
      }
    }
    .orderMain {
      width: 762px;
      padding-left: 85px;
      .order-info-news {
        margin-top: 43px;
        .el-col {
          margin-bottom: 25px;
          font-size: 14px;
          label {
            color: #999;
          }
          b {
            font-size: 24px
          }
        }

      }
    }
  }
  .con {
    margin-left: 20px;
    float: left;
    height: 50px;
    width: 600px;
  }
  .con p {
    font-size:20px;
    font-family:MicrosoftYaHei;
    color:rgba(51,51,51,1);
    line-height:36px;
  }
</style>
