<template>
  <div class="">
    <!-- 	立即支付对话框 -->
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
              :before-upload="beforeAvatarUpload"
              accept="image/jpeg,image/png"
              class="upload-demo"
              :limit="1"
              :on-remove="removeImg"
              :action="uploadUrl"
              :on-change="handleChange"
              :on-success="upload"
              :file-list="fileList">
              <el-button size="small" type="primary" style="color: #fff;">点击上传</el-button>
            </el-upload>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <div slot="tip" class="el-upload__tip" style="margin-top: 0">只能上传jpg/png文件，且不超过2M</div>
          </td>
        </tr>
      </table>
      <p>请支付 <span style="font-weight:bold;font-size:18px;"> {{payTo.needPay}} CNY</span> 至上方银行账号</p>
      <p class="remark">备注：转账时请务必输入小数点后两位数字，便于后台快速审核到账！</p>
      <p style="color: red;font-size: 18px;font-weight: 600;">转账必须备注: <span class="payid"
                                                                            style="font-weight:bold;font-size:18px;">ID：{{payTo.payid}}</span>&nbsp;&nbsp;&nbsp;
        <button class="tag-read2" :data-clipboard-text="'ID：'+payTo.payid" type='text' @click="copy(2)">复制</button>
      </p>
      <p class="nonsupport">*不支持信用卡、ATM机转账支付</p>
      <p class="paid">
        <el-button type="primary" v-dbClick @click="isPayment()" round style="width:180px;color:#fff">
          我已付款
        </el-button>
      </p>
      <p><span>付款成功后，请点击我已付款提交审核！</span></p>
    </div>
    <!-- <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span> -->
    <div class="shade-div" v-show="dialogAttentionPlease"></div>
    <div v-show="dialogAttentionPlease" class="attention-dialog">
      <h3 class="title">特别提醒</h3>
      <div class="attention-please">
        <p>1.确认转账成功后，请点击确认已付款，未转账请勿点击！！！</p>
        <p>2.转账需备注您的个人ID，如您忘记备注，请联系客服进行反馈，便于即时到账。</p>
        <div class="dialog-footer">
          <el-button v-dbClick type="primary" class="save-btn" @click="paid">确定已付款</el-button>
          <el-button class="cancel-btn" @click="dialogAttentionPlease=false">取消付款</el-button>
        </div>
      </div>
    </div>
  </div>

</template>
<script type="text/babel">
  import {baseUrl} from "@/config/env";
  import until from "@/scripts/until";
  import Clipboard from 'clipboard'
  let cliboard = new Clipboard('.coopyBtn');
  export default {
    props: ['produId'],
    data(){
      return {
        dialogAttentionPlease: false,
        payTo: {
          bankaddr: '',
          bankname: '',
          card: '',
          name: '',
          payid: '',
          needPay: '',
        },
        bankImgShow: false,
        bankImg: "",
        fileList: [],
        uploadUrl: baseUrl + "/Common/upload"
      }
    },
    mounted(){
      this.getUserMsg();
    },
    methods: {
      removeImg(file, fileList){
        this.bankImg = "";
      },
      isPayment(){
        if (this.bankImg.length == 0) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '银行截图不能为空！',
            type: 'error'
          });
          return false;
        }
        this.dialogAttentionPlease = true;
      },
      handleChange(file, fileList) {
        console.log(file);
        this.fileList = fileList.slice(-3);
      },
      //上传图片
      upload(response){
        this.bankImg = response.data.url;
      },
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      paid(){
        try {
          let url = baseUrl + "/account/c2c/oneUpEntranceStatus";
          let config = {
            method: "post",
            data: {
              id: this.produId,
              bankimg: this.bankImg
            },
            url: url + "?r=" + Math.random()
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              this.$message({
                type: "success",
                duration: 1500,
                message: "提交审核成功",
                onClose: () => {
                  this.dialogAttentionPlease = false;
                  this.$emit("hideBox");
                }
              });
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      //用户支付
      getUserMsg(){
        try {
          let url = baseUrl + "/account/account/getAdminBankOne";
          let config = {
            method: "post",
            url: url + "?r=" + Math.random(),
            data: {
              pid: this.produId
            }
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              this.payTo.name = result.data.data.name;
              this.payTo.bankaddr = result.data.data.bankaddr;
              this.payTo.bankname = result.data.data.bankname;
              this.payTo.card = result.data.data.card;
              this.payTo.needPay = result.data.data.needPay;
              this.payTo.payid = result.data.data.payid;
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
      hideBox(){
        this.$emit("hideBox");
      },
    }
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
        .save-btn {

        }
        .cancel-btn {

        }
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
      }
    }
  }

</style>
