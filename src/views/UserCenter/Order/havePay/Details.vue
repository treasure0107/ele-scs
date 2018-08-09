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
                <!--<img src="./../../../../assets/1.jpg" class="trader-photo">-->
                <img :src="avatarPhoto" class="trader-photo">
                <p class="trader-name" v-if="userInfo.country==1">{{formatPhone(userInfo.mobile)}}</p>
                <p class="trader-name" v-else>{{formatEmail(userInfo.email)}}</p>
              </li>
              <li>
                <p style="font-size:12px;margin-bottom:13px;color:#999;">ID</p>
                <p>{{userInfo.user_id}}</p>
              </li>
              <li>
                <p style="font-size:12px;margin-bottom: 13px;color:#999;">联系</p>
                <p style="color:#347FEE;">{{userInfo.user_name}}</p>
              </li>
            </ul>
          </div>
          <div class="orderMain" v-if="paymentType">
            <div class="order-info-news">
              <el-row>
                <el-col :span="24">
                  <label>订单号：</label><span>{{trade_no}}</span>
                </el-col>
                <el-col :span="24">
                  <label>实际支付：</label><span><b>{{payment_money}}</b> </span>
                </el-col>
                <el-col :span="24">
                  <label>支付方式：</label>
                  <div class="paywayBox">
                    <div class="subBox">
                      <!--:class="{chooseIcon:bankCard}"-->
                      <div class="borderLight" @click="bankTab()" v-if="bank">
                        <i class="pay_icon"></i>
                        银行卡
                        <span class="arrows-top" v-if="bankCard"><span><em></em></span></span>
                      </div>
                      <!--:class="{chooseIcon:alipayCard}" -->
                      <div class="borderLight" @click="alipayTab()" v-if="alipay">
                        <i class="alipay-icon"></i>支付宝
                        <span class="arrows-top" v-if="alipayCard"><span><em></em></span></span>
                      </div>
                      <!--:class="{chooseIcon:usdtCard}"-->
                      <div class="borderLight" @click="usdtTab()" v-if="usdt">
                        <i class="usdt-icon"></i>USDT
                        <span class="arrows-top" v-if="usdtCard"><span><em></em></span></span>
                      </div>
                    </div>
                  </div>
                </el-col>
                <!--银行卡支付-->
                <el-col :span="23" class="bankInfo" v-if="bankCard">
                  <el-col :span="11">
                    <label>收款方姓名：</label><span>{{bankObj.user_name}}</span>
                  </el-col>
                  <el-col :span="13">
                    <label>银行名称：</label><span>{{bankObj.bank_name}}</span>
                  </el-col>
                  <el-col :span="11">
                    <label>支行：</label><span>{{bankObj.bank_addr}}</span>
                  </el-col>
                  <el-col :span="13">
                    <label>银行卡号：</label><span>{{bankObj.bank_card}}</span>&nbsp;
                  </el-col>
                </el-col>
                <!--支付宝支付-->
                <el-col :span="23" class="bankInfo" v-if="alipayCard">
                  <el-col :span="20">
                    <label>收款方姓名：</label><span>{{alipayObj.user_name}}</span>
                  </el-col>
                  <el-col :span="20">
                    <label>支付宝账号：</label><span>{{alipayObj.alipay_account}}</span>&nbsp;
                  </el-col>
                </el-col>
                <!--USDT-->
                <el-col :span="23" class="bankInfo" v-if="usdtCard">
                  <el-col :span="23">
                    <p style="font-size:14px;color:#FF6359;">提示：只能发送USDT到这个钱包地址，发送其他货币到这个地址将导致您的货币损失</p>
                    <div style="margin-top: 10px;">
                      <label>转入地址：</label><span>{{usdtObj.usdt_account}}</span>&nbsp;
                    </div>
                    <div style="margin-top: 10px;">
                      <label>收款二维码：</label><span @click="collectCode()" id="qrcode"></span>
                    </div>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <div class="orderTimeOut" style="font-size:20px; color:#333;">
              <span>剩余
                <span>
                  <template v-if="time>0">
                    <CountDown :timeCountdown="time"></CountDown>
                  </template>
                   <span v-else>0分0秒</span>
                </span>
              等待对方确认收款，付款参考号：
              </span> <strong>{{re_num}}</strong>
            </div>
            <div class="btn">
              <el-button type="text" size="medium" style="background-color: #EF6D16; color:#fff; border-radius:36px;"
                         @click="cancelOrder" v-if="isAppeal">申诉
              </el-button>
            </div>
          </div>
          <div class="orderMain" v-if="!paymentType">
            <div class="order-info-news">
              <el-row>
                <el-col :span="24">
                  <label>订单号：</label><span>{{trade_no}}</span>
                </el-col>
                <el-col :span="24">
                  <label>实际支付：</label><span><b>{{payment_money}}</b> </span>
                </el-col>
                <el-col :span="24">
                  <label>支付方式：</label>
                  <div class="paywayBox">
                    <div class="subBox">
                      <!--:class="{chooseIcon:bankCard}"-->
                      <div class="borderLight" @click="bankTab()" v-if="bank">
                        <i class="pay_icon"></i>
                        银行卡
                      </div>
                      <!--:class="{chooseIcon:alipayCard}" -->
                      <div class="borderLight" v-if="alipay">
                        <i class="alipay-icon"></i>支付宝
                      </div>
                      <!--:class="{chooseIcon:usdtCard}"-->
                      <div class="borderLight" v-if="usdt">
                        <i class="usdt-icon"></i>USDT
                      </div>
                    </div>
                  </div>
                </el-col>

              </el-row>
            </div>
            <div class="btn">
              <el-button style="margin-right: 60px;" type="primary" size="medium" round @click="doPay()" v-dbClick>
                确认收款
              </el-button>
              未收到款？发起 <a href="javascript:void(0);" style="color:#EF6D16;" @click="cancelOrder">申诉</a>
              <div class="iconInform">
                <div class="arrows-top"><span><em></em></span></div>
                请确认您已收到转账，确认收款后交易数字资产将会转给对方账户！
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="确认收款"
      :visible.sync="unpaidDialog"
      width="26%" class="unpaidDialog">
      <div class="unpaidHint">请确认您已收到转账，确认收款后交易数字资产将会转给对方账户！！</div>
      <el-input v-model="payPassword" @input="changeVal" type="password" placeholder="请输入六位数字的交易密码"></el-input>
      <span style="float:right;margin-right: 6px;cursor:pointer;font-size:12px;margin-top: 10px;color:#B7B7B7;"
            @click="$router.push('/AccountSet/1')">忘记密码</span>
      <footer slot="footer">
        <el-button type="primary" @click="sureUnpaid()" :disabled="!isBtnActive" :class="{btnActive:isBtnActive}">确 定
        </el-button>
      </footer>
    </el-dialog>
    <!--取消订单-->
    <el-dialog
      title="取消订单"
      :visible.sync="cancleDialog"
      width="30%" class="cancleDialog">
      <p style="font-size:14px;color:#EE0101; text-align: center;margin-bottom: 26px;">取消订单使用票将作废，请谨慎操作！</p>
      <el-input v-model="tradersPsd" type="password" placeholder="请输入六位数字的交易密码"></el-input>
      <span style="float:right;margin-right: 6px;cursor:pointer;font-size:12px;margin-top: 10px;color:#B7B7B7;"
            @click="$router.push('/AccountSet/1')">忘记密码</span>
      <footer slot="footer" style="text-align: center;">
        <!--<el-button @click="cancleDialog = false">取 消</el-button>-->
        <el-button type="primary" @click="cancleOrder()"
                   style="width:180px;height:40px;background-color: #2E6AF4;border-radius:20px;">确 定
        </el-button>
      </footer>
    </el-dialog>
    <!--usdt二维码-->
    <el-dialog
      :visible.sync="collectCodeDialog"
      width="20%"
      center
      class="collectCodeDialog">
      <div id="usdtCode"></div>
    </el-dialog>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl, imgBaseUrl} from "@/config/env";
  import QRCode from 'qrcodejs2';
  import CountDown from "@/components/CountDown";
  import Clipboard from 'clipboard';
  let cliboard = new Clipboard('.coopyBtn');
  export default {
    data(){
      return {
        bank: false,           //银行卡
        alipay: false,        //支付宝
        usdt: false,        //USDT  false
        bankCard: false,
        alipayCard: false,
        usdtCard: false,      //false
        cancleDialog: false,
        tradersPsd: '',
        payPassword: '',
        unpaidDialog: false,
        collectCodeDialog: false,
        usdtUrl: 'https://www.baidu.com/',
        bankObj: {
          bank_addr: "",
          bank_card: "",
          bank_name: "",
          user_name: "",
        },
        alipayObj: {
          user_name: '',
          alipay_account: '',
        },
        usdtObj: {
          usdt_account: ''
        },
        id: '',
        userInfo: {
          avatar: "",
          country: 1,
          email: "",
          mobile: "",
          user_id: "",
          user_name: "",
        },
        avatarPhoto: '',
        trade_no: 0,   //订单号
        payment_money: 0,
        payment_unit: '',
        time: 0,
        re_num: '',
        showPayment: {},
        isBuy: '',
        paymentType: true,
        isBtnActive: false,
        isAppeal: false,
        tradeId: '',    //订单Id
      }
    },
    created(){
      this.isBuy = this.$route.query.isBuy;
      this.id = this.$route.query.id;
    },
    mounted(){
      if (this.isBuy == 1) {
        this.paymentType = true;
        this.getDetailsIn();
      }
      if (this.isBuy == 0) {
        this.paymentType = false;
        this.getDetailsOut();
      }
    },
    methods: {
      getDetailsIn(){    //买入    let id = this.$route.query.id;
        let id = this.id;
        try {
          let url = baseUrl + "account/trade_detail/paid_in";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              id: id
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let dataObj = res.data.data;
              this.userInfo = dataObj.user_info;
              this.avatarPhoto = imgBaseUrl + this.userInfo.avatar;  //头像
              this.trade_no = dataObj.trade_no;
              this.payment_money = dataObj.payment_money;
              this.payment_unit = dataObj.payment_unit;
              if (dataObj.residue_currency_time > 0) {
                this.time = dataObj.residue_currency_time;
              } else {
                this.time = 0;
              }
              this.re_num = dataObj.re_num;
              this.isAppeal = dataObj.is_can_appeal;
              if (dataObj.payment == 'bank') {
                this.bank = true;
                this.bankObj = dataObj.payment_info;
                this.bankCard = true;
              }
              if (dataObj.payment == 'alipay') {
                this.alipay = true;
                this.alipayObj = dataObj.payment_info;
                this.alipayCard = true;
              }
              if (dataObj.payment == 'usdt') {
                this.usdt = true;
                this.usdtObj = dataObj.payment_info;
                this.usdtCard = true;
                this.usdtUrl = dataObj.payment_info.usdt_account;
                setTimeout(() => {
                  this.qrcode();
                }, 60)
              }

            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getDetailsOut(){
        let id = this.id;
        try {
          let url = baseUrl + "account/trade_detail/paid_out";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {id: id}
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              let dataObj = res.data.data;
              this.tradeId = dataObj.id;
              this.userInfo = dataObj.user_info;
              this.avatarPhoto = imgBaseUrl + this.userInfo.avatar;  //头像
              this.trade_no = dataObj.trade_no;
              this.payment_money = dataObj.payment_money;
              this.payment_unit = dataObj.payment_unit;
              this.re_num = dataObj.re_num;
              if (dataObj.payment == 'bank') {
                this.bank = true;
              }
              if (dataObj.payment == 'alipay') {
                this.alipay = true;
              }
              if (dataObj.payment == 'usdt') {
                this.usdt = true;
              }
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
        this.$router.push({path: '/AppeaLine', query: {id: this.id, isBuy: this.isbuy}});
      },
      collectCode(){   //USDT弹窗二维码
        this.collectCodeDialog = true;
        $("#usdtCode").html('');
        let text = this.usdtUrl;
        setTimeout(() => {
          let qrcode = new QRCode('usdtCode', {
            width: 160,
            height: 160,
            text: text,
          });
        }, 50)
      },
      cancleOrder(){   //取消订单
        try {
          let url = baseUrl + "account/trade_user_action/do_cancel";
          let tradeId = this.tradeId;  //订单ID
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              id: tradeId,
              pay_password: this.tradersPsd,
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.$message({
                type: "success",
                duration: 1000,
                message: res.data.msg || "订单取消成功！",
                onClose: () => {
                  this.cancleDialog = false;
                }
              });
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      sureUnpaid(){
        let reg = new RegExp("^[0-9]*$");
        let tradeId = this.tradeId;  //订单ID
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
            data: {id: tradeId, pay_password: this.payPassword}
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.$message({
                type: "success",
                duration: 1000,
                message: res.data.msg || "确认收款！",
                onClose: () => {
                  this.unpaidDialog = false;
                  setTimeout(() => {
                    this.$router.push('/Order');
                  }, 60);
                }
              });
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      bankTab(){   //银行卡
        this.usdtCard = false;
        this.alipayCard = false;
        this.bankCard = true;
      },
      alipayTab(){   //支付宝
        this.usdtCard = false;
        this.bankCard = false;
        this.alipayCard = true;
      },
      usdtTab(){   //USDT
        this.bankCard = false;
        this.alipayCard = false;
        this.usdtCard = true;
        if (this.usdtUrl) {
          setTimeout(() => {
            this.qrcode();
          }, 60)
        }

      },
      //复制
      copy(n){
        if (n == 1) {
          var clipboard = new Clipboard('.tag-read1');
        }
        if (n == 2) {
          var clipboard = new Clipboard('.tag-read2');
        }
        if (n == 3) {
          var clipboard = new Clipboard('.tag-read3');
        }

        clipboard.on('success', e => {
          this.$message({
            type: "success",
            duration: 2000,
            message: "复制成功",
          });   //这里你如果引入了elementui的提示就可以用，没有就注释即可
          // 释放内存
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          // 不支持复制
          console.log('该浏览器不支持自动复制');
          // 释放内存
          clipboard.destroy()
        })
      },
      formatPhone(phone) {
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      },
      formatEmail(email) {
        return email.replace(/(.{2}).+(.{2}@.+)/g, "$1****$2");
      },
      qrcode () {
        let text = "";
        if (this.usdtUrl) {
          text = this.usdtUrl;
        }
        let qrcode = new QRCode('qrcode', {
          width: 16,
          height: 16,
          text: text,
        });
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
        /*    .arrows {
              position: absolute;
              top: 0;
              left: 0;
              span {
                display: block;
                width: 0;
                height: 0;
                border-width: 0 10px 10px;
                border-style: solid;
                border-color: transparent transparent #3B50D2;
                position: absolute;
                top: -10px;
                left: 50%; !* 三角形居中显示 *!
                margin-left: -10px; !* 三角形居中显示 *!
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
            }*/
        /*.bankInfo .arrows {*/
        /*left: 130px*/
        /*}*/
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
        width: 406px;
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

  /deep/ .unpaidDialog .el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
    text-align: center;
  }
  /*/deep/ .unpaidDialog .el-dialog__body .el-input__inner {*/
    /*width: 80%;*/
  /*}*/

  /deep/ .collectCodeDialog .el-dialog__body{
    text-align: center;
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
</style>


