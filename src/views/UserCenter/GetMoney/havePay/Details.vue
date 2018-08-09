<template>
  <div class="noLeftBox container">
    <div>
      <el-row class="breadcrumbs">
        <el-col :span="16">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/GetMoney' }">提现管理</el-breadcrumb-item>
            <el-breadcrumb-item>提现详情</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <div class="orderStatus">提现详情
        <span class="mark">已付款</span>
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
                <img :src="imgurl+userInfo.photo" class="trader-photo">
                <p class="trader-name">{{replaceX(userInfo.uuid)}}</p>
              </li>
              <li>
                <p style="font-size:12px;margin-bottom:13px;color:#999;">ID</p>
                <p>{{userInfo.uuid}}</p>
              </li>
              <li>
                <p style="font-size:12px;margin-bottom: 13px;color:#999;">联系</p>
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
                  <label>实际支付：</label><span><b>{{payment_money}}</b> <span>{{unit}}</span></span>
                </el-col>
                <el-col :span="24">
                  <label>支付方式：</label><span>{{payment}}</span>
                </el-col>
                <el-col :span="24">
                  <label>付款参考号：</label> <strong>{{re_num}}</strong>
                </el-col>
              </el-row>
            </div>
            <div class="btn">
              <el-button style="margin-right: 60px;" type="primary" size="medium" round @click="doPay()" v-dbClick>
                确认收款
              </el-button>
              <span style="font-size:16px;">
                 未收到款？发起 <a href="javascript:void(0);" style="color:#EF6D16;" @click="cancelOrder">申诉</a>
              </span>
              <div class="iconInform">
                <div class="arrows-top"><span><em></em></span></div>
                请确认您已收到款，如未收到款请联系对方或发起申诉。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--确认收款-->
    <el-dialog
      title="确认收款"
      :visible.sync="unpaidDialog"
      width="26%" class="unpaidDialog">
      <div class="unpaidHint">请确认您已收到款，如未收到款请联系对方或发起申诉。</div>
      <el-input v-model="payPassword" @input="changeVal" type="password" placeholder="请输入六位数字的交易密码"></el-input>
      <span  class="forgetIcon" @click="$router.push('/AccountSet/1')">忘记密码</span>
      <footer slot="footer">
        <el-button type="primary" @click="sureUnpaid()" :disabled="!isBtnActive" :class="{btnActive:isBtnActive}">确认收款
        </el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl, imgBaseUrl} from "@/config/env";
  import CountDown from "@/components/CountDown";
  export default {
    data(){
      return {
        tradersPsd: '',
        payPassword: '',
        unpaidDialog: false,
        collectCodeDialog: false,
        id: '',
        userInfo: {
          user_name: '',
          phpto: '--',
          contact: '--',
          uuid: '--'
        },
        imgurl: '',
        trade_no: 0,   //订单号
        payment_money: 0,
        unit: '',
        time: 0,
        re_num: '',
        isBtnActive: false,
        isAppeal: false,
        payment: '',
        tardeid:'',   //订单ID
      }
    },
    created(){
      this.id = this.$route.query.id;
      this.imgurl = imgBaseUrl
    },
    mounted(){
      this.getIn();
    },
    methods: {
      getIn(){
        let id = this.id;
        try {
          let url = baseUrl + "account/Exchange/getTxPaidDetail";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {id: id}
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let dataObj = res.data.data;
              this.userInfo = dataObj.buy;
              this.trade_no = dataObj.trade.tardeno;
              this.payment_money = dataObj.trade.actualamount;
              this.unit=dataObj.trade.payment_unit;
              this.time = dataObj.trade.dotime;
              this.re_num = dataObj.trade.renum;
              this.payment = dataObj.trade.payment;
              this.tardeid = dataObj.trade.tardeid;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      changeVal(value){
        if (value.length == 6) {
          this.isBtnActive = true;
        }
      },
      doPay(){
        this.unpaidDialog = true;
      },
      cancelOrder(){
        let id = this.id;
        this.$router.push('/AppeaLine?isbuy=0&id=' + id);
      },
      sureUnpaid(){   //确认收款
        let reg = new RegExp("^[0-9]*$");
        if (!reg.test(this.payPassword)) {
          this.$message({
            showClose: true,
            duration: 3000,
            message: '请输入六位数字的交易密码！',
            type: 'error'
          });
          return false;
        }
        try {
          let url = baseUrl + "account/trade_user_action/confirm_rec";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              id: this.tardeid,
              pay_password: this.payPassword
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.$message({
                type: "success",
                duration: 1000,
                message: res.data.msg || "确认收款！",
                onClose: () => {
                  this.unpaidDialog = false;
                }
              });
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      formatPhone(phone) {
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      },
      formatEmail(email) {
        return email.replace(/(.{2}).+(.{2}@.+)/g, "$1****$2");
      },
      replaceX(str){
        var s = str.split('')
        s.splice(3, 4, '****')
        var result = s.join('')
        return result
      },
    },
    components: {
      CountDown
    }
  }
</script>
<style lang="scss" scoped>
  .noLeftBox {
    padding: 50px 0 50px 102px;
  }

  .orderStatus {
    font-weight: bold;
    font-size: 24px;
    .mark {
      display: inline-block;
      width: 73px;
      height: 23px;
      border-radius: 12px;
      color: #fff;
      line-height: 23px;
      background-color: #5B8BFB;
      font-size: 12px;
      text-align: center;
      margin-left: 16px;
      position: relative;
      bottom: 1px;
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
          p {
            margin-left: 40px;
            text-align: left;
            font-size: 14px;
          }
          .trader-icon {
            display: inline-block;
            font-size: 12px;
            width: 64px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background: #5BB8ED;
            border-radius: 0 10px 10px 0;
            color: #fff;
          }
          .trader-photo {
            display: inline-block;
            width: 60px;
            height: 60px;
            border-radius: 100%;
          }
          .trader-name {
            font-size: 14px;
            padding: 12px 0 18px;
            margin: 0 40px;
            border-bottom: 1px solid #EEEEEE;
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
        .paywayBox {
          display: inline-block;
          .subBox {
            display: flex;
            div {
              width: 100px;
              height: 30px;
              border: 1px solid #ddd;
              border-radius: 3px;
              margin-right: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            }
            /*:hover {*/
            /*border-color: #5357E2;*/
            /*color: #5357E2;*/
            /*}*/
            i {
              margin-right: 5px
            }
            .chooseIcon {
              position: relative;
              border-color: #5357E2;
              color: #5357E2;
            }
            .chooseIcon:after {
              content: '';
              width: 16px;
              height: 14px;
              position: absolute;
              right: 0;
              bottom: 0;
              background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAb1BMVEUAAABTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+L7+//y8v1obOaHiutxdeducedeYuSpq/GUlu2LjutjZuVXW+Oj9RxqAAAAGHRSTlMA7978z7ho9uiifTko68Onlo+GUkwYDQWVnTcHAAAAa0lEQVQI11XNRxKFIAAEUcDsz0FtwKz3P6MlhpLevdmM8LvHvm/y4/mX8L46DiC7+AvwOlllrEWHywhvKELH2j73e+U86jbc7h90HTS6xQ3/BCbTWF2D2u/BGjMAqRA5W3MPIEWu1lLpgmABDosJRducRE4AAAAASUVORK5CYII=') no-repeat center;
            }

            .pay_icon {
              width: 20px;
              height: 20px;
              background-image: url(../../../../assets/pay_icon.png);
              background-repeat: no-repeat;
              background-size: cover;
            }
            .alipay-icon {
              width: 20px;
              height: 20px;
              background-image: url(../../../../assets/alipay-icon.png);
              background-repeat: no-repeat;
              background-size: cover;
            }
            .usdt-icon {
              width: 20px;
              height: 20px;
              background-image: url(../../../../assets/usdt-icon.png);
              background-repeat: no-repeat;
              background-size: cover;
            }
          }
        }
        .bankInfo {
          border: 1px solid #3B50D2;
          border-radius: 3px;
          padding: 25px 25px 0 25px;
        }
        .borderLight {
          position: relative;
        }
        .arrows-top {
          position: absolute;
          top: 56px;
          left: 40px;
          border: none;
          z-index: 666;
          span {
            display: block;
            width: 0;
            height: 0;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent #3B50D2;
            position: absolute;
            top: -10px;
            left: 50%; /* 三角形居中显示 */
            margin-left: -10px; /* 三角形居中显示 */
          }
          em {
            display: block;
            width: 0;
            height: 0;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent #fff;
            position: absolute;
            top: 1px;
            left: -10px;
          }

        }
      }
      .orderTimeOut {
        padding: 5px 0;
        font-size: 14px;
        line-height: 26px;
        .residue_pay_time {
          color: #E6403D;
          font-size: 20px;
        }
        b {
          font-size: 20px;
        }
      }

      .btn {
        margin-top: 30px;
        margin-bottom: 10px;
        button {
          width: 136px;
        }
      }

      .iconInform {
        width: 316px;
        height: 34px;
        line-height: 34px;
        font-size: 12px;
        text-align: center;
        background-color: #F8F5E6;
        border-radius: 2px;
        margin-top: 16px;
        margin-bottom: 23px;
        position: relative;
        .arrows-top {
          position: absolute;
          top: 4px;
          left: 40px;
          span {
            display: block;
            width: 0;
            height: 0;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent #F8F5E6;
            position: absolute;
            top: -10px;
            left: 50%; /* 三角形居中显示 */
            margin-left: -10px; /* 三角形居中显示 */
          }
          em {
            display: block;
            width: 0;
            height: 0;
            border-width: 0 10px 10px;
            border-style: solid;
            border-color: transparent transparent #F8F5E6;
            position: absolute;
            top: 1px;
            left: -10px;
          }
        }
      }
    }
  }

  .unpaidDialog {
    .unpaidHint {
      font-size: 14px;
      color: #666;
      margin-top: 30px;
      margin-bottom: 40px;
    }
  }

  #qrcode {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #ccc;
    cursor: pointer;
    vertical-align: middle;
  }

  #usdtCode {
    width: 160px;
    height: 160px;
    display: inline-block;
  }

  /deep/ .unpaidDialog .el-dialog__title, .cancleDialog .el-dialog__title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  /deep/ .unpaidDialog .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    text-align: center;
  }

  /deep/ .unpaidDialog .el-dialog__body .el-input__inner {
    width: 80%;
  }

  /deep/ .unpaidDialog .el-dialog__footer footer {
    text-align: center;
    margin-top: 30px;
  }

  /deep/ .unpaidDialog .el-dialog__footer footer .el-button {
    width: 180px;
    height: 40px;
    background-color: #587ED7;
    border-radius: 20px;
  }

  .btnActive {
    background-color: #2E6AF4 !important;
  }
  .forgetIcon {
    float: right;
    margin-right: 16%;
    cursor: pointer;
    font-size: 12px;
    margin-top: 10px;
    color: #B7B7B7;
  }
</style>


