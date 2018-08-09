<template>
  <div class="container noLeftBox">
    <el-container>
      <el-main>
        <el-row class="breadcrumbs">
          <el-col :span="16">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/C2C' }">C2C交易 </el-breadcrumb-item>
              <el-breadcrumb-item v-if="!form.isEdit">我要参与</el-breadcrumb-item>
              <el-breadcrumb-item v-else>修改参与信息</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <!-- <el-col :span="8"><time><router-link :to="'/TicketRecord'">查看转票记录</router-link></time></el-col>  -->
        </el-row>

        <el-row style="margin:50px 0">
          <el-col :span="14">
            <el-form :model="form" :rules="rules" ref="form" label-width="150px">
							<div style="margin: 0 0 10px 148px;" v-if="!form.isEdit">请输入参与金额，参与金额最低{{form.money_least}}CNY，最多{{form.money_max}}CNY</div>
              <div style="margin: 0 0 10px 148px;" v-if="form.isEdit">上次参与金额:{{form.last_entrance_money}}</div>
              <el-form-item :label="form.isEdit?'修改参与金额':'参与金额'" prop="entrance_money">
                <el-input v-model.trim="form.entrance_money"><i slot="suffix"
                                                                style="font-size:16px;color:#333;text-transform:uppercase;margin-right:10px;">cny</i>
                </el-input>
              </el-form-item>
              <el-form-item label="票数">
                <b>{{form.curr_available_votes}}</b> <span> (匹配成功之后取消订单票将不会退回)</span>
              </el-form-item>
              <el-form-item label="可使用备用金">
                <b>{{form.available_cny}}</b>
              </el-form-item>
              <el-form-item label="预计需支付">
                <b style="font-size:24px">{{form.neePay}}</b> CNY<span> ≈ {{needusdt}} USDT</span>
              </el-form-item>

              <el-form-item label="支付方式">
                <div class="paywayBox">
                  <div class="subBox">
                    <template v-for="(item,index) in payList">
                      <div :class="{on:item.checked}" @click="choosePayType(item) " :key='index'>
                        <i class="pay_icon" :class="item.type" size="medium"></i>{{item.name}}
                      </div>
                    </template>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="交易密码" prop="psw">
                <el-input type="password" auto-complete="new-password" v-model="form.psw"
                          placeholder="请输入交易密码"></el-input>
              </el-form-item>
              <el-form-item></el-form-item>
              <el-form-item v-if="!form.isEdit">
                <!--<el-button v-dbClick type="warning" round style="width:100px;" @click="payNow('form')">立即支付</el-button>-->
                <el-button v-dbClick type="primary" round style="width:100px;" @click="submitForm('form')">立即参与</el-button>
                <el-button v-dbClick type="button" round style="width:100px;margin-left:30px;" @click="cancelSubmit">取消参与</el-button>
                <!-- <el-button round style="width:150px;margin-left:30px;">取消修改</el-button> -->
              </el-form-item>
              <el-form-item v-else>
                <!--<el-button v-dbClick type="warning" round style="width:100px;" @click="payNow('form')">立即支付</el-button>-->
                <el-button v-dbClick type="primary" round style="width:100px;" @click="submitForm('form')">立即修改</el-button>
                <el-button v-dbClick type="button" round style="width:100px;margin-left:30px;" @click="cancelSubmit">取消修改</el-button>
              </el-form-item>

            </el-form>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <!-- 	立即支付对话框 -->
    <el-dialog
      :visible.sync="dialogPayNow"
      width="500px"
      :before-close="handleClose">
      <span style="font-size:20px;color:#333;font-weight:bold;padding-left:30px;">立即支付</span>
      <div class='payNow'>
        <table>
          <tr>
            <td>收款方姓名</td>
            <td>{{payTo.name}}</td>
          </tr>
          <tr>
            <td>银行名称</td>
            <td>{{payTo.bankname}}</td>
          </tr>
          <tr>
            <td>开户支行</td>
            <td>{{payTo.bankaddr}}</td>
          </tr>
          <tr>
            <td>银行卡号</td>
            <td>{{payTo.card}}&nbsp;&nbsp;&nbsp;
              <button class="tag-read1" :data-clipboard-text="payTo.card" @click="copy(1)" type='text'>复制</button>
            </td>
          </tr>
          <tr>
            <td valign="top">转账截图</td>
            <td valign="top">
              <el-upload
                class="upload-demo"
                accept="image/jpeg,image/png"
                :action="url"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :limit="1"
                :on-success="upload"
                :before-upload="beforeAvatarUpload">
                <el-button size="small" type="primary" style="color: #fff">点击上传</el-button>
              </el-upload>
            </td>
          </tr>
          <tr style="height:56px">
            <td colspan="2" style="height:56px;font-size:12px;text-align:center;">
              只能上传jpg/png文件，且不超过2M
            </td>
          </tr>
        </table>
        <p>请支付 <span style="font-weight:bold;font-size:18px;"> {{payTo.needPay}} CNY</span> 至上面银行账号</p>
        <p class="remark">备注：转账时请务必输入小数点后两位数字，便于后台快速审核到账！</p>
        <p style="color:red;font-weight:bold;font-size:18px;">付款参考号(转账备注): <span class="payid">ID:{{payTo.payid}}</span>&nbsp;&nbsp;&nbsp;
          <button class="tag-read2" :data-clipboard-text='"ID:"+payTo.payid' type='text' @click="copy(2)">复制</button>
        </p>
        <p class="nonsupport">*不支持信用卡、ATM机转账支付</p>
        <p class="paid">
          <el-button v-dbClick type="primary" round @click="payment()" style="width:180px;color:#fff">我已付款</el-button>
        </p>
        <p><span>付款成功后，请点击我已付款提交审核！</span></p>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span> -->
    </el-dialog>
    <div class="shade-div" v-show="dialogAttentionPlease"></div>
    <div width="600px" v-show="dialogAttentionPlease" class="attention-dialog">
      <h3 class="title">特别提醒</h3>
      <div class="attention-please">
        <p>1.确认转账成功后，请点击确定已付款，未转账请勿点击！！！</p>
        <p>2.转账需备注您的个人ID，如您忘记备注，请联系客服进行反馈，便于即时到账。</p>
        <div class="dialog-footer">
          <el-button type="primary" v-dbClick class="save-btn" @click="paid">确定已付款</el-button>
          <el-button class="cancel-btn" @click="dialogAttentionPlease=false">取消付款</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import {baseUrl} from "@/config/env";
  import until from "@/scripts/until";
  import Vue from 'vue';
  import {MessageBox} from 'element-ui';
  import router from '@/router';
  import Clipboard from 'clipboard'
  let cliboard = new Clipboard('.coopyBtn')
  export default {
    data(){
      var validateEntrance_money = (rule, value, callback) => {
        if (!until.RegExps.isNumber(value)) {
          callback(new Error('请输入数字'));
        } else if (this.form.last_entrance_money != '' && Number(this.form.last_entrance_money) > Number(this.form.entrance_money)) {
          callback(new Error('参与金额不能小于上次参与金额' + this.form.last_entrance_money));
        } else if (this.form.money_least && (Number(value) < this.form.money_least)) {
          callback(new Error('参与金额最少为' + this.form.money_least));
        } else if ((typeof this.form.money_max == "number") && (Number(value) > this.form.money_max)) {
          callback(new Error('参与金额最大为' + this.form.money_max));
        } else if (Number(value) === 0) {
          callback(new Error('参与金额不能为0'));
        } else if (this.form.money_int && (Number(value) % (this.form.money_int) != 0)) {
          callback(new Error('参与金额必须是' + this.form.money_int + '的整数倍'));
        }
        else {
          callback();
        }
      };
      return {
        url: baseUrl + '/Common/upload',
        form: {
          isEdit: false,
          last_entrance_money: '',
          entrance_money: '',
          available_cny: 0.00,//可用备用金
          available_votes: 0,  //可用票数
          curr_available_votes: 0, //当前参与金额可用票数
          money_int: 1000,//全额整数倍
          money_least: 1000,
          money_max: 30000,
          neePay: 0,
          psw: '',
          yzm: '',
          type_list: [],
          status: '',
          img: ''
        },
        paymentlist: [],
        rules: {
          entrance_money: [
            {required: true, message: "请输入参与金额", trigger: "blur"},
            {validator: validateEntrance_money, trigger: "blur"}
          ],
          psw: [
            {required: true, message: "请输入交易密码", trigger: "blur"}
          ]
        },
        payTo: {
          bankaddr: '',
          bankname: '',
          card: '',
          name: '',
          payid: '',
          needPay: '',
          paydian: ''
        },
        dialogPayNow: false,
        dialogAttentionPlease: false,
      }

    },
    beforeRouteEnter: function (to, from, next) {
      try {
        let url = baseUrl + "/friends/getProfile";
        let config = {
          method: "post",
          url: url + "?r=" + Math.random()
        };
        Vue.prototype.$axios(config).then(result => {
          if (until.responesValidate(result)) {
            let data = result.data.data;
            if (data.approvestatus != 1) {
              MessageBox.confirm("<span class='tips'></span><p>您还未通过实名认证,请先进行实名认证</p>", '提示', {
                dangerouslyUseHTMLString: true,
                customClass: 'customAlert',
                confirmButtonText: '去认证',
                showCancelButton: false,
                confirmButtonClass: 'customAlertConfirm',
                callback: (action, instance) => {
                  if (action == "confirm") {
                    router.push({path: "/AccountSet"})
                  }
                }
              })
              next(false);
              return;
            }
            if (data.paypassword == 0) {//未设置交易密码
              MessageBox.confirm("<span class='tips'></span><p>您还未设置交易密码,请先设置交易密码</p>", '提示', {
                dangerouslyUseHTMLString: true,
                customClass: 'customAlert',
                confirmButtonText: '去设置',
                showCancelButton: false,
                confirmButtonClass: 'customAlertConfirm',
                callback: (action, instance) => {
                  if (action == "confirm") {
                    router.push({path: "/AccountSet"})
                  }
                }
              })
              next(false);
              return;
            }
            if (data.plist.length == 0) {
              MessageBox.confirm("<span class='tips'></span><p>您还未设置支付方式,请先设置支付方式</p>", '提示', {
                dangerouslyUseHTMLString: true,
                customClass: 'customAlert',
                confirmButtonText: '去设置',
                showCancelButton: false,
                confirmButtonClass: 'customAlertConfirm',
                callback: (action, instance) => {
                  if (action == "confirm") {
                    router.push({path: "/CollectSet"})
                  }
                }
              })
              next(false);
              return;
            }
            try {
              let url = baseUrl + "/account/c2c/getusercoin";
              let config = {
                method: "post",
                url: url + "?r=" + Math.random()
              };
              Vue.prototype.$axios(config).then(result => {
                if (until.responesValidate(result)) {
                  let data = result.data.data;
									if(((data.status==-1&&data.type_list.some(item=>item.id==1))||(data.status==0&&data.type_list.some(item=>item.id==0)))&&(data.available_votes == 0)){
                    MessageBox.confirm("<span class='tips'></span><p>账户没有可用参与票，无法参与!<p><p>购票请与卖票人联系！</p>", '提示', {
                      dangerouslyUseHTMLString: true,
                      customClass: 'customAlert',
                      confirmButtonText: '知道了',
                      showCancelButton: false,
                      confirmButtonClass: 'customAlertConfirm'
                    })
                    next(false);
                  } else {
                    next();
                  }
                }
              });
            } catch (ex) {
              until.consoleLog(ex);
            }
          } else {
            next(false);
          }
        });
      } catch (ex) {
        until.consoleLog(ex);
      }
    },
    mounted(){
      this.form.isEdit = this.$route.query.edit ? true : false;
      this.getusercoin();
      this.getpaymentlist();
    },
    methods: {
      //资金账户基本信息
      getusercoin(){
        try {
          let url = baseUrl + "/account/c2c/getusercoin";
          let config = {
            method: "post",
            url: url + "?r=" + Math.random()
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              let data = result.data.data;
              this.form.type_list = data.type_list;
              this.form.status = data.status;
              this.lineup();
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      //我要排队，加载用户资金基本信息
      lineup(){
        try {
          if (this.form.type_list.some((item) => item.id == 1) &&(this.form.status == 0||this.form.status==2)) {
            this.form.isEdit = true;
          }
          let url = "";
          if (this.form.isEdit) {
            url = baseUrl + "/account/c2c/editdetail";
          } else {
            url = baseUrl + "/account/c2c/adddetail";
          }
          let config = {
            method: "post",
            url: url + "?r=" + Math.random()
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              let data = result.data.data;
              this.form.available_votes = data.available_votes;
              this.form.available_cny = data.available_cny;
              this.form.money_least = data.money_least;
              this.form.money_int = data.money_int;
              this.form.money_max = data.money_max;
              if (this.form.isEdit) {
                this.form.last_entrance_money = data.entrance_money;
              }
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getpaymentlist(){
        try {
          let url = baseUrl + "account/c2c/getpaymentlist";
          let config = {
            method: "post",
            url: url + "?r=" + Math.random()
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              let data = result.data.data;
              this.paymentlist = data;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      choosePayType(item){
        if (typeof item.checked == 'undefined') {
          this.$set(item, 'checked', true);
        } else if (item.checked) {
          item.checked = false;
        } else {
          item.checked = true;
        }
      },
      getPayTypeArr(){
        let arr = [];
        this.payList.forEach((item) => {
          if (item.checked) {
            arr.push(item.type);
          }
        });
        return arr;
      },
      cancelSubmit(){
        this.$router.push({path: "/C2C"});
      },
      submitForm(formName) {
        if (this.getPayTypeArr().length == 0) {
          this.$message({
            type: "error",
            duration: 3000,
            message: "请至少选择一种支付方式"
          });
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            try {
              let url = "";
              if (this.form.isEdit) {
                url = baseUrl + "account/c2c/editEntrance";
              } else {
                url = baseUrl + "account/c2c/addentrance";
              }
              let formdata = {
                "entrance_money": this.form.entrance_money,
                "payment": this.getPayTypeArr(),
                "password": this.form.psw,
								"paydian":this.payTo.paydian
              };
              let config = {
                method: "post",
                url: url + "?r=" + Math.random(),
                data: formdata
              };
              this.$axios(config).then(result => {
                if (until.responesValidate(result)) {
                  let msg = this.form.isEdit ? '修改参与信息成功!' : '参与成功!';
                  this.$message({
                    type: "success",
                    duration: 3000,
                    message: result.Msg || msg,
                    onClose: () => {
                      this.$router.push({path: "/C2C"});
                      //this.$router.go(-1);
                    }
                  });
                }
              });
            } catch (ex) {
              until.consoleLog(ex);
            }
          }
        });
      },
      //关闭对话框
      handleClose(done) {
        this.dialogPayNow = false;
        /*       this.$confirm('确认关闭？')
         .then(_ => {
         done();
         })
         .catch(_ => {});*/
      },
      //点击立即支付
      payNow(formName){
        if (this.getPayTypeArr().length == 0) {
          this.$message({
            type: "error",
            duration: 3000,
            message: "请至少选择一种支付方式"
          });
          return;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.getAdminBank()
          }
        });
      },
      //用户支付
      getAdminBank(){
        try {
          let url = baseUrl + "/account/account/getAdminBank";
          let config = {
            method: "post",
            url: url + "?r=" + Math.random(),
            data: {
              password: this.form.psw,
            }
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              if (result.data.msg == '查询成功') {
                this.dialogPayNow = true
                this.payTo.name = result.data.data.name
                this.payTo.bankaddr = result.data.data.bankaddr
                this.payTo.bankname = result.data.data.bankname
                this.payTo.card = result.data.data.card
                this.payTo.payid = result.data.data.payid
              }
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      //已支付
      paid(){
        try {
          if (this.form.type_list.some((item) => item.id == 1) && this.form.status == 0) {
            this.form.isEdit = true;
          }
          let url = "";
          if (this.form.isEdit) {
            url = baseUrl + "/account/c2c/editEntrance";
          } else {
            url = baseUrl + "/account/c2c/addentrance";
          }
          let config = {
            method: "post",
            url: url + "?r=" + Math.random(),
            data: {
              entrance_money: this.form.entrance_money,
              payment: this.getPayTypeArr(),
              password: this.form.psw,
              paystatus: 1,
              bankimg: this.form.img,
              paydian: this.payTo.paydian
            }
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              this.dialogPayNow = false
              this.dialogAttentionPlease = false
              this.$message({
                type: "success",
                duration: 2000,
                message: "提交成功",
                onClose: () => {
                  this.$router.push({path: "/C2C"});
                }
              });

            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      //复制
      copy(n){
        if (n == 1)
          var clipboard = new Clipboard('.tag-read1')
        if (n == 2)
          var clipboard = new Clipboard('.tag-read2')
        clipboard.on('success', e => {
          this.$message({
            type: "success",
            duration: 2000,
            message: "复制成功",
          })//这里你如果引入了elementui的提示就可以用，没有就注释即可
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          // 不支持复制
          console.log('该浏览器不支持自动复制')
          // 释放内存
          clipboard.destroy()
        })
      },
      //上传截图
      handleRemove(file, fileList) {
        this.form.img = "";
      },
      handlePreview(file) {
        console.log(file);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      //上传图片
      upload(response){
        this.form.img = response.data.url;
      },
      //上传类型
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png');
        let isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传文件只能是 JPG或 PNG');
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //点击我已付款
      payment(){
        if (this.form.img == "")
          this.$message.error('银行截图不能为空');
        else
          this.dialogAttentionPlease = true
      }
    },
    computed: {
      change_entrance_money() {
        return this.form.entrance_money
      },
      payList(){
        let newArr = this.paymentlist.map((item) => {
          switch (item.type.toLowerCase()) {
            case 'bank':
              item.name = '银行卡';
              break;
            case 'alipay':
              item.name = '支付宝';
              break;
            case 'wxpay':
              item.name = '微信';
              break;
            case 'usdt':
              item.name = 'USDT';
              break;
            default:
              break;
          }
          return item;
        })
        return newArr;
      },
			needusdt(){
				return (Number(this.form.neePay)/6.7).toFixed(8)
			}
    },
    watch: {
      change_entrance_money(newVal){
        if (until.RegExps.isNumber(newVal)) {
          this.form.curr_available_votes = (Math.ceil(Number(newVal) / 6000) > this.form.available_votes) ? this.form.available_votes : Math.ceil(Number(newVal) / 6000);
          this.form.neePay = (Number(newVal) - this.form.curr_available_votes * 300 - Number(this.form.available_cny)).toFixed(2);
          if (this.form.neePay < 0) {
            this.form.neePay = 0.00;
          }
        } else {
          this.form.curr_available_votes = 0;
          this.form.neePay = 0;
        }
				this.payTo.paydian=1;
				do{
					this.payTo.paydian=Math.random().toFixed(2);
				}while (this.payTo.paydian>=0.5)
				this.payTo.needPay = Number(this.form.neePay)+Number(this.payTo.paydian)
      }
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  .attention-dialog {
    width: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 8000;
    background-color: #fff;
    border-radius: 4px;
    padding: 25px;
    h3.title {
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
    .attention-please {
      padding: 20px 0;
      p {
        height: 25px;
        line-height: 25px;
        text-align: left;
        font-size: 14px;
        color: red;
      }
      .dialog-footer {
        padding: 35px 0 0 0;
        text-align: center;
      }
    }
  }

  .orderStatus {
    font-weight: bold;
    font-size: 24px;
    .el-badge {
      margin-left: 20px;
    }
  }

  .receiving {
    background: #F6F6F6;
    padding: 25px 25px 0 25px;
    margin: 30px 0;
    .el-col {
      margin-bottom: 25px;
      font-size: 14px;
      label {
        color: #999;
      }
    }
  }

  .orderInfos {
    margin: 50px 0 0;
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

  .paywayBox {
    display: inline-block;
    .subBox {
      display: flex;
      div {
        width: 115px;
        height: 40px;
        border: 1px solid #ddd;
        border-radius: 3px;
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        -webkit-user-select: none;
      }
      :hover, .on {
        border-color: #5357E2;
        color: #5357E2;
      }
      i {
        margin: 0 14px
      }
    }

  }

  .borderLight {
    border: 1px solid #3B50D2;
    border-radius: 3px;
    padding: 25px 25px 0 25px;
    position: relative;
  }

  .arrows {
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

  .bankInfo .arrows {
    left: 130px
  }

  .orderTimeOut {
    padding: 5px 0;
    font-size: 14px;
    span {
      color: #E6403D
    }
    b {
      font-size: 20px
    }
  }

  .el-form-item span {
    color: #B7B7B7;
    font-size: 12px;
  }

  //支付图标
  .subBox .pay_icon {
    width: 28px;
    height: 28px;
    background-image: url(../../assets/pay_icon.png);
    background-repeat: no-repeat;
    background-size: 122px 28px;
  }

  .subBox .bank {
    background-position: -1px 0;
  }

  .subBox .weixin {
    background-position: -32px 0;
  }

  .subBox .alipay {
    background-position: -62px 0;
  }

  .subBox .usdt {
    background-position: -92px 0;
  }

  .subBox .on:after {
    content: '';
    width: 16px;
    height: 14px;
    position: absolute;
    right: -1px;
    bottom: 0;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAb1BMVEUAAABTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+JTV+L7+//y8v1obOaHiutxdeducedeYuSpq/GUlu2LjutjZuVXW+Oj9RxqAAAAGHRSTlMA7978z7ho9uiifTko68Onlo+GUkwYDQWVnTcHAAAAa0lEQVQI11XNRxKFIAAEUcDsz0FtwKz3P6MlhpLevdmM8LvHvm/y4/mX8L46DiC7+AvwOlllrEWHywhvKELH2j73e+U86jbc7h90HTS6xQ3/BCbTWF2D2u/BGjMAqRA5W3MPIEWu1lLpgmABDosJRducRE4AAAAASUVORK5CYII=') no-repeat center;
  }

  //立即支付dialog
  .payNow {
    padding: 24px 38px 39px 24px;
    p.remark {
      text-align: left;
      color: red;
      line-height: 20px;
    }
    button {
      color: #5357E2
    }
    table {
      background: #f6f6f6;
      width: 100%;
      margin-bottom: 25px;
      tr {
        line-height: 54px;
        font-size: 14px;
        td:first-child {
          width: 120px;
          font-family: MicrosoftYaHei;
          color: #999;
          text-align: right;
        }
        td:last-child {
          color: #333;
          padding-left: 29px;
        }
      }
    }
    p {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 1);
      line-height: 34px;
    }
    p.nonsupport {
      color: #F89617;
    }
    p.paid {
      text-align: center;
      margin-top: 39px;
    }
    p:last-child {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #666;
      line-height: 36px;
      text-align: center;
      margin-top: 17px;
      span {
        background: #F8F5E6;
        padding: 11px 26px;
        font-weight: bold;
      }
    }
  }
</style>
