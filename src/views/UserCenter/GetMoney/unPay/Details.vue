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
              &nbsp</span>付款参考号：<strong>{{re_num}}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl, imgBaseUrl} from "@/config/env";
  import CountDown from "@/components/CountDown";
  export default {
    data(){
      return {
        isActive: true,
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
        payment_unit: '',
        re_num: '',
        time: 0,
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
      getIn(){    //买入
        let id = this.id;
        try {
          let url = baseUrl + "account/Exchange/getTxNoPayDetail";
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
//              this.payment_unit=dataObj.trade.payment_unit;
              this.time = dataObj.trade.dotime;
              this.re_num = dataObj.trade.renum;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      doPay(){
        alert("我已经付款")
      },
      cancelOrder(){
        alert("取消订单")
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
        span {
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
</style>
