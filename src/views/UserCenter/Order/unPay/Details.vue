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
        <span class="mark">待支付</span>
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
                      <div class="borderLight" :class="{chooseIcon:bankCard}" @click="bankTab()" v-if="bank">
                        <i class="pay_icon"></i>银行卡
                        <span class="arrows-top" v-if="bankCard"><span><em></em></span></span>
                      </div>
                      <div class="borderLight" :class="{chooseIcon:alipayCard}" @click="alipayTab()" v-if="alipay">
                        <i class="alipay-icon"></i>支付宝
                        <span class="arrows-top" v-if="alipayCard"><span><em></em></span></span>
                      </div>
                      <div class="borderLight" :class="{chooseIcon:usdtCard}" @click="usdtTab()" v-if="usdt">
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
                    <el-button style="color:#2E6AF4;" size="mini" class="tag-read1" type="text"
                               :data-clipboard-text="bankObj.bank_card" @click="copy(1)">复制
                    </el-button>
                  </el-col>
                </el-col>
                <!--支付宝支付-->
                <el-col :span="23" class="bankInfo" v-if="alipayCard">
                  <el-col :span="20">
                    <label>收款方姓名：</label><span>{{alipayObj.user_name}}</span>
                  </el-col>
                  <el-col :span="20">
                    <label>支付宝账号：</label><span>{{alipayObj.alipay_account}}</span>&nbsp;
                    <el-button style="color:#2E6AF4;" size="mini" class="tag-read2" type="text"
                               :data-clipboard-text="alipayObj.alipay_account" @click="copy(2)">复制
                    </el-button>
                  </el-col>
                </el-col>
                <!--USDT-->
                <el-col :span="23" class="bankInfo" v-if="usdtCard">
                  <el-col :span="23">
                    <p style="font-size:14px;color:#FF6359;">提示：只能发送USDT到这个钱包地址，发送其他货币到这个地址将导致您的货币损失</p>
                    <div style="margin-top: 10px;">
                      <label>转入地址：</label><span>{{usdtObj.usdt_account}}</span>&nbsp;
                      <el-button style="color:#2E6AF4;" size="mini" class="tag-read3" type="text"
                                 :data-clipboard-text="usdtObj.usdt_account" @click="copy(3)">复制
                      </el-button>
                    </div>
                    <div style="margin-top: 10px;">
                      <label>收款二维码：</label><span @click="collectCode" id="qrcode"></span>
                    </div>
                  </el-col>
                </el-col>
              </el-row>
            </div>
            <div class="orderTimeOut">
              请于<span class="residue_pay_time">
              <template v-if="time>0">
                <CountDown :timeCountdown="time"></CountDown>
              </template>
               <span v-else>0分0秒</span>
            </span>
              内向 <span class="trader-name" v-if="userInfo.country==1">{{formatPhone(userInfo.mobile)}}</span>
              <span class="trader-name" v-else>{{formatEmail(userInfo.email)}}</span>
              支付 <strong>{{payment_money}} {{payment_unit}}</strong>，付款参考号：<strong>{{re_num}}</strong>
            </div>
            <div class="btn">
              <el-button type="primary" size="medium" round @click="doPay" v-dbClick>我已付款</el-button>
              <el-button type="text" size="medium" @click="cancelOrder">取消订单</el-button>
              <div class="iconInform">
                <div class="arrows-top"><span><em></em></span></div>
                付款成功后点击按钮告知对方
              </div>
              <div style="font-size:12px;color:#999;line-height: 22px;">
                <p>1.您的汇款将直接进入卖方账户，交易过程中卖方出售的数字资产由平台托管保护。</p>
                <p>2.请在规定的时间内完成付款，并务必点击“我已付款”，卖方确认收款后系统会将数字资产划转到您的账户。</p>
                <p>3.取消订单则所使用票将不会退回账户.</p>
              </div>
            </div>
          </div>
          <div class="orderMain" v-if="!paymentType">
            <div class="order-info-news">
              <el-row>
                <el-col :span="24">
                  <label>订单号：</label><span>{{trade_no}}</span>
                </el-col>
                <el-col :span="24">
                  <label>收款金额：</label><span><b>{{payment_money}}</b> </span>
                </el-col>
              </el-row>
            </div>
            <div class="orderTimeOut">
              剩余支付时间<span class="residue_pay_time">&nbsp;
              <template v-if="time>0">
                <CountDown :timeCountdown="time"></CountDown>
              </template>
               <span v-else>0分0秒</span>
              &nbsp;</span>付款参考号：<strong>{{re_num}}</strong>
            </div>
            <div style="font-size:12px;color:#999;line-height: 22px;">
              <p>1、若对方超时未支付，订单将会自动取消。</p>
              <p> 2、订单取消后将会自动为您匹配新的买家。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="待支付"
      :visible.sync="unpaidDialog"
      width="36%" class="unpaidDialog">
      <div class="icon-c">付款方式：
        <span v-if="bankCard"><span class="icon-pay icon-p"></span><span>银行卡</span></span>
        <span v-if="alipayCard"><span class="icon-alipay icon-p"></span>支付宝</span>
        <span v-if="usdtCard"><span class="icon-usdt icon-p"></span>USDT</span>
      </div>
      <div class="unpaidHint">
        <p>亲爱的用户：</p>
        <p>1、如果您已支付完成请点击下方【确认付款】</p>
        <p>2、对于未支付完成，却点击【确认付款】的用户会降低信用权重，甚至
          冻结账户使用权限，请您知悉。</p>
      </div>
      <el-input v-model="payPassword" type="password" placeholder="请输入六位数字的交易密码"></el-input>
      <span style="float:right;margin-right: 6px;cursor:pointer;font-size:12px;margin-top: 10px;color:#B7B7B7;"
            @click="$router.push('/AccountSet/1')">忘记密码</span>
      <footer slot="footer" class="dialog-footer">
        <span class="icon-c" style="float:left;">支付金额：<span class="paymentAmount">{{payment_money}}</span> <span
          class="paymentUnit">{{payment_unit}}</span></span>
        <el-button style="width:180px;height:40px;background-color: #2E6AF4;border-radius:20px;" type="primary"
                   @click="sureUnpaid()">确 定
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
      <span class="forgetIcon" @click="$router.push('/AccountSet/1')">忘记密码</span>
      <footer slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="cancleOrder()"
                   style="width:180px;height:40px;background-color: #2E6AF4;border-radius:20px;">确 定
        </el-button>
      </footer>
    </el-dialog>
    <!--usdt二维码-->
    <el-dialog
      :visible.sync="collectCodeDialog"
      width="20%"
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
        usdtUrl: '',
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
        paymentMethod: '',
        paymentType: true,
        tradeId: '',
      }
    },
    created(){
      this.paymentMethod = this.$route.query.isBuy;
      this.id = this.$route.query.id;
    },
    mounted(){
      if (this.paymentMethod == 1) {
        this.getDetailsIn();
        this.paymentType = true;
      }
      if (this.paymentMethod == 0) {
        this.getDetailsOut();
        this.paymentType = false;
      }
    },
    methods: {
      getDetailsIn(){    //买入
        try {
          let url = baseUrl + "account/trade_detail/unpaid_in";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {id: this.id}
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
              if (dataObj.residue_pay_time > 0) {
                this.time = dataObj.residue_pay_time;
              } else {
                this.time = 0;
              }
              this.re_num = dataObj.re_num;
              this.showPayment = dataObj.show_payment;
              for (var i in this.showPayment) {
                if (i == 'bank') {
                  this.bank = true;
                  this.bankObj = this.showPayment[i];
                }
                if (i == 'alipay') {
                  this.alipay = true;
                  this.alipayObj = this.showPayment[i];
                }
                if (i == 'usdt') {
                  this.usdt = true;
                  this.usdtObj = this.showPayment[i];
                  this.usdtUrl = this.usdtObj.usdt_account;
                }
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
          let url = baseUrl + "account/trade_detail/unpaid_out";
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
              if (dataObj.residue_pay_time > 0) {
                this.time = dataObj.residue_pay_time;
              } else {
                this.time = 0;
              }
              this.re_num = dataObj.re_num;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      formValidate(){
        if (this.bankCard || this.alipayCard || this.usdtCard) {
          return true;
        }
        this.$message({
          showClose: true,
          duration: 4000,
          message: '请选择支付方式！',
          type: 'error'
        });
        return false;
      },
      doPay(){
        if (this.formValidate()) {
          this.unpaidDialog = true;
        }
      },
      cancelOrder(){
        this.cancleDialog = true;
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
            data: {id: tradeId, pay_password: this.tradersPsd,}
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.$message({
                type: "success",
                duration: 1000,
                message: res.data.msg || "订单取消成功！",
                onClose: () => {
                  this.cancleDialog = false;
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
      sureUnpaid(){  //确认收款
        try {
          let url = baseUrl + "account/trade_user_action/do_pay";
          let tradeId = this.tradeId;  //订单ID
          let paymentType = '';
          if (this.bankCard) {
            paymentType = 'bank';
          }
          if (this.alipayCard) {
            paymentType = 'alipay';
          }
          if (this.usdtCard) {
            paymentType = 'usdt';
          }
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              id: tradeId,
              payment: paymentType,
              pay_password: this.payPassword
            }
          };
          this.$axios(config).then(res => {
            if (until.responesValidate(res)) {
              this.$message({
                type: "success",
                duration: 1000,
                message: res.data.msg || "订单取消成功！",
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
      background-color: #E65364;
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
            :hover {
              border-color: #5357E2;
              color: #5357E2;
            }
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
          width: 140px;
        }
      }

      .iconInform {
        width: 197px;
        height: 34px;
        line-height: 34px;
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
    .icon-c {
      color: #999;
      font-size: 14px;
      .paymentAmount {
        font-size: 20px;
        color: #FD8238;
      }
      .paymentUnit {
        font-size: 14px;
        color: #FD8238;
      }
    }
    .unpaidHint {
      padding: 20px;
      background-color: #FEF2F2;
      border-radius: 2px;
      color: #797979;
      font-size: 14px;
      line-height: 24px;
      border: 1px solid #FFB4A8;
      margin: 23px 0;
    }
    .icon-p {
      display: inline-block;
      width: 18px;
      height: 18px;
      background-repeat: no-repeat;
      background-size: cover;
      position: relative;
      top: 3px;
      margin-right: 3px;
    }
    .icon-pay {
      background-image: url(../../../../assets/pay_icon.png);
    }
    .icon-alipay {
      background-image: url(../../../../assets/alipay-icon.png);
    }
    .icon-usdt {
      background-image: url(../../../../assets/usdt-icon.png);
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

  /deep/ .el-dialog__title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  /deep/ .collectCodeDialog .el-dialog__body, .collectCodeDialog .el-dialog__header, .cancleDialog .el-dialog__body .el-input {
    padding-left: 0;
    padding-right: 0;
    text-align: center;
  }

  /deep/ .cancleDialog .el-dialog__body .el-input__inner {
    width: 69%;
  }

  .cancleDialog .forgetIcon {
    float: right;
    margin-right: 16%;
    cursor: pointer;
    font-size: 12px;
    margin-top: 10px;
    color: #B7B7B7;
  }
</style>


