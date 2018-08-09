<template>
  <div class="noLeftBox container">
    <div>
      <el-row class="breadcrumbs">
        <el-col :span="16">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/GetMoney' }">提现列表</el-breadcrumb-item>
            <el-breadcrumb-item>提现详情</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <div class="orderStatus">订单详情
        <el-badge class="mark" value="已取消"/>
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
                <!--<img src="./../../../../assets/1.jpg" class="trader-photo">-->
                <!--<img :src="avatarPhoto" class="trader-photo">-->
                <img :src="imgurl+userInfo.photo" style="width:100px;">
                <p class="trader-name">{{formatPhone(userInfo.username||'')}}</p>
                <!--<p class="trader-name"  v-else>{{formatEmail(userInfo.email||'')}}</p>-->
              </li>
              <li>
                <p style="font-size:12px;margin-bottom:13px;color:#999;">ID</p>
                <p>{{userInfo.uuid}}</p>
              </li>
              <li>
                <p style="font-size:12px;margin-bottom: 13px;color:#999;">账号</p>
                <p style="color:#347FEE;">{{userInfo.contact}}</p>
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
                  <label>收款金额：</label><span><b>{{payment_money}}</b> {{payment_unit}}</span>
                </el-col>
                <el-col :span="24">
                  <img id="img1" style="display:none;float: left;margin-top: 10px;" src="./../../../../assets/yiqux.png" alt="">
                  <img id="img2" style="display:none;float: left;margin-top: 10px;" src="./../../../../assets/shengsu.png" alt="">
                  <img id="img3" style="display:none;float: left;margin-top: 10px;" src="./../../../../assets/baisu.png" alt="">
                  <div class="con">
                    <p>{{test}}<span style="font-size: 20px;color:#EE8F15">{{sr}}</span><span style="font-size: 20px;color:#EE0404">{{sc}}</span></p>
                    <p style="display: none;font-size: 14px" id="pp">败诉原因：由于买方上传凭证真实有效，确认已给您转账。</p>
                    <p style="display: none;font-size: 14px" id="vv">交易数字资产将会重新匹配买家</p>
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
        imgurl:'',
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
      this.imgurl = imgBaseUrl
      //let buySel=this.$route.query.buySel;
      this.getDetailsInqq();
    },
    methods: {
      getDetailsInqq(){    //买入
        var self = this;
        let id=self.$route.query.id;
//        let id=this.$route.params.id;
        try {
          let url = baseUrl + "account/Exchange/getTxCancleDetail";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              id:id
            }
          };
          self.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let dataObj=res.data.data;
              self.userInfo=dataObj.buy;
              self.trade_no=dataObj.trade.tardeno;
              self.payment_money=dataObj.trade.actualamount;
              self.payment_unit=dataObj.trade.payment_unit;
              self.flag = dataObj.trade.appeal;//5败6胜0未申诉
              if (!self.flag) {
                document.getElementById('img1').style.display='block';
                document.getElementById('img2').style.display='none';
                document.getElementById('img3').style.display='none';
                self.test = '订单已取消，付款参考号：'+ dataObj.trade.renum
                self.sr = '';
                self.sc = '';
              } else if (self.flag == 5) {
                document.getElementById('img1').style.display='none';
                document.getElementById('img2').style.display='block';
                document.getElementById('img3').style.display='none';
                document.getElementById('vv').style.display='block';
                self.test = '申诉结果：'
                self.sr = '胜诉'
                self.sc = ''
              } else if (self.flag == 6) {
                document.getElementById('img1').style.display='none';
                document.getElementById('img2').style.display='none';
                document.getElementById('img3').style.display='block';
                document.getElementById('pp').style.display='block';
                self.test = '申诉结果：'
                self.sr = ''
                self.sc = '败诉'
              }
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
