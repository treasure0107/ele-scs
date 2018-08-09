<template>
  <div class="center-main">
    <h2 class="center-title">
      邀请好友
      <router-link to="/GetMoney">
        <el-button type="text" style="float:right;">提现记录</el-button>
      </router-link>
    </h2>
    <el-row class="infoBox">
      <el-col :span="9" class="account">
        <div>邀请人数据
          <router-link :to="'/InviteFriendsList'" style="color: #409EFF;margin-left: 10px;"> 查看详情</router-link>
        </div>
        <em>
          <router-link :to="'/InviteFriendsList'"> {{inviteFriendsNews.levelcount}}人</router-link>
          <label>(只显示一级邀请人数)</label>
        </em>
      </el-col>
      <el-col :span="9" class="account">
        <div>累计可提现奖励</div>
        <b>{{inviteFriendsNews.rewardtotal}}</b> <span class="coin">CNY</span>&nbsp;&nbsp;
        <el-button type="primary" size="mini" round @click='cashBonuses'>申请提现</el-button>
      </el-col>
      <el-col :span="6" class="account">
        <div>累计奖金金额</div>
        <b>{{inviteFriendsNews.total_reward}}</b> <span class="coin">CNY</span>&nbsp;
      </el-col>
    </el-row>
    <div class="receiving">
      <div class="arrows"><span><em></em></span></div>
      <el-row>
        <el-col>
          <div style="font-size:14px;color: #FF6359;line-height:16px;">
            提现说明：
            <span>当天19:00前的提现当天处理完毕；</span>&nbsp;
            <span>当天19:00后的提现次日进行处理完毕</span>
          </div>
        </el-col>
        <el-col :span="8" class="account">
          <div>团队奖
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              content="团队奖">
              <el-button type="text" slot="reference" size="mini" icon="el-icon-question" circle></el-button>
            </el-popover>
            <router-link to="/TeamDetail" class="link-btn">团队业务详情</router-link>
          </div>
          <em style="font-size: 14px;">等待结算</em>
          <!--<em>{{inviteFriendsNews.gro_reward}} CNY</em>-->
        </el-col>
        <el-col :span="8" class="account">
          <div>个人奖
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              content="个人奖">
              <el-button type="text" slot="reference" size="mini" icon="el-icon-question" circle></el-button>
            </el-popover>
            <router-link to="/DirectdriveDetail" class="link-btn">个人业务详情</router-link>
          </div>
          <em>{{inviteFriendsNews.per_reward}} CNY</em>
        </el-col>
        <el-col :span="8" class="account" v-if="marketSubsidies">
          <div>市场补贴
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              content="市场补贴">
              <el-button type="text" slot="reference" size="mini" icon="el-icon-question" circle></el-button>
            </el-popover>
            <router-link to="/BazaarDetail" class="link-btn">市场津贴详情</router-link>
          </div>
          <em>{{inviteFriendsNews.mark_reward}} CNY</em>
        </el-col>
      </el-row>
    </div>
    <h3 class="friends_title">邀请有礼</h3>
    <div class="friends">
      <div class="steps">
        <span class="stepIcon1"></span>
        <div>链接或邀请码分享给好友</div>
      </div>
      <div class="line">-----------------------></div>
      <div class="steps">
        <span class="stepIcon2"></span>
        <div>好友注册并完成一笔交易</div>
      </div>
      <div class="line">-----------------------></div>
      <div class="steps">
        <span class="stepIcon3"></span>
        <div>即可获得奖励</div>
      </div>
    </div>
    <div class="copyCode">我的邀请码：
      <span style="padding-right: 30px;">{{inviteFriendsNews.invtcode}}</span>
      <el-button class="tag-read1" :data-clipboard-text="inviteFriendsNews.invtcode" @click="copy(1)" type='text'>复制
      </el-button>
    </div>
    <div class="copyLink">
      <span style="padding-right: 30px;">{{inviteFriendsNews.url}}</span>
      <el-button class="tag-read2" icon="el-icon-document" :data-clipboard-text="inviteFriendsNews.url" @click="copy(2)"
                 type='text'>复制
      </el-button>
    </div>
    <div class="bdsharebuttonbox share bdshare-button-style0-16" data-tag="share_1">
      <div class="qrcode-box">
        <p class="weChat-text" v-if="weChatTit">用微信扫一扫</p>
        <div id="qrcode"></div>
      </div>
      <div class="weChat shareIcon" @mouseenter="weChatShow()" @mouseleave="weChatHidden()">
        <img src="./../../../assets/share_wx.png">
        <p>分享到微信</p>
      </div>
      <a data-cmd="sqq" class="shareIcon qq">
        <p>分享到QQ</p>
      </a>
      <div @click="shareTo('qzone')" class="shareIcon">
        <img src="./../../../assets/share_qqkj.png">
        <p>分享到QQ空间</p>
      </div>
      <div @click="shareTo('sina')" class="shareIcon">
        <img src="./../../../assets/share_xl.png">
        <p>分享到微博</p>
      </div>
    </div>
    <div class="bdsharebuttonbox">
      <a href="javascript:void(0);" class="bds_more" data-cmd="more"></a>
      <a href="javascript:void(0);" class="bds_qzone" data-cmd="qzone"></a>
      <a href="javascript:void(0);" class="bds_tsina" data-cmd="tsina"></a>
      <a href="javascript:void(0);" class="bds_tqq" data-cmd="tqq"></a><a href="#" class="bds_renren"
                                                                          data-cmd="renren"></a>
      <a href="javascript:void(0);" class="bds_weixin" data-cmd="weixin"></a>
    </div>
    <!--兑换奖金-->
    <el-dialog title="提现奖金" width="580px" :visible.sync="dialogExchangeBonus" :before-close="handleClose"
               class="cash-bonuses">
      <div class="diaCont">
        <div class="ContTop">可提现奖金：<span
          style="font-size:20px;color:#333333;font-weight: bold;">{{inviteFriendsNews.rewardtotal}}</span> CNY
        </div>
        <div class="diaInputs">
          <label>提现金额</label>
          <el-input placeholder="请输入500的倍数" v-model="amountNum">
            <i slot="suffix" style="display:inline-block;line-height:40px;padding-right:20px;color:#333;">CNY</i>
          </el-input>
        </div>
        <div class="diaInputs">
          <label>交易密码</label>
          <el-input type="password" placeholder="请输入交易密码" v-model="payPassword"></el-input>
        </div>
      </div>
      <footer slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="dialogExchangeBonus = false">取 消</el-button>
        <el-button type="primary" v-dbClick @click="ExchangeBonus">申请提现</el-button>
      </footer>
    </el-dialog>
    <!--提现提示-->
    <el-dialog title="提现提示" custom-class="cashBonuses-model" width="400px" :visible.sync="dialogCashBonusesVisible">
      <div class="cashBonusesCon">{{cashBonusesMsg}}</div>
      <footer slot="footer" class="dialog-footer">
        <el-button v-dbClick type="primary" @click="dialogCashBonusesVisible = false">确定</el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import QRCode from 'qrcodejs2';
  import "@/scripts/share/share.min.css";
  import "@/scripts/share/jquery.share.min.js";
  import Clipboard from 'clipboard'
  import ElCol from "element-ui/packages/col/src/col";
  let cliboard = new Clipboard('.coopyBtn');
  export default {
    data(){
      return {
        dialogExchangeBonus: false,
        inviteFriendsNews: {},
        weChatUrl: '',
        weChatTit: false,
        marketSubsidies: false,
        dialogCashBonusesVisible: false,
        cashBonusesMsg: '',
        payPassword: '',
        amountNum: ''
      }
    },
    mounted(){
      this.getFriendsMain();
    },
    methods: {
      initBaiduShare(){
        window._bd_share_config = {
          common: {
            bdText: '',
            bdDesc: '',
            bdUrl: this.weChatUrl,
            bdPic: ''
          },
          share: [{
            "tag": "share_1",
            "bdSize": 78
          }]
        };
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5);
        document.body.appendChild(s);
      },
      shareTo(stype){
        //qq空间接口的传参
        if (stype == 'qzone') {
          this.qqZone();
//          window.open('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + this.weChatUrl + '?sharesource=qzone&title=' + "会员系统" + '');
        }
        //新浪微博接口的传参
        if (stype == 'sina') {
          window.open('http://service.weibo.com/share/share.php?url=' + this.weChatUrl + '?sharesource=weibo&title=' + "会员系统" + '');
        }
        //qq好友接口的传参
        if (stype == 'qq') {
          this.qqShare();
//          window.open('http://connect.qq.com/widget/shareqq/index.html?url='+this.weChatUrl+'?sharesource=qzone&title=' + "会员系统" + '');
        }
      },
      qqShare(){
        var p = {
          url: this.weChatUrl, /*获取URL，可加上来自分享到QQ标识，方便统计*/
          desc: '发送信息给好友',
          title: '发送信息给好友', /*分享标题(可选)*/
          summary: '', /*分享摘要(可选)*/
          pics: '', /*分享图片(可选)*/
          flash: '', /*视频地址(可选)*/
          site: this.weChatUrl, /*分享来源(可选) 如：QQ分享*/
          style: '203',
          width: 16,
          height: 16
        };
        var s = [];
        for (var i in p) {
          s.push(i + '=' + encodeURIComponent(p[i] || ''));
        }
        var qhref = "http://connect.qq.com/widget/shareqq/index.html?" + s.join('&');
//        $(".shareIcon").attr({href: qhref, target: "_blank"});
        window.open(qhref)
      },
      qqZone(){
        var _url = this.weChatUrl;
        var _showcount = 0;
        var _desc = '';
        var _summary = "";
        var _title = '会员系统';
        var _site = "";
        var _width = "600px";
        var _height = "800px";
        var _summary = "";
        var _pic = "http://www.junlenet.com/uploads/allimg/150510/1-150510104044.jpg";
        var _shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
        _shareUrl += 'url=' + encodeURIComponent(_url || document.location);    //参数url设置分享的内容链接|默认当前页location
        _shareUrl += '&showcount=' + _showcount || 0;       //参数showcount是否显示分享总数,显示：'1'，不显示：'0'，默认不显示
        _shareUrl += '&desc=' + encodeURIComponent(_desc || '分享的描述');     //参数desc设置分享的描述，可选参数
        //_shareUrl += '&summary=' + encodeURIComponent(_summary||'分享摘要');     //参数summary设置分享摘要，可选参数
        _shareUrl += '&title=' + encodeURIComponent(_title || document.title);    //参数title设置分享标题，可选参数
        //_shareUrl += '&site=' + encodeURIComponent(_site||'');   //参数site设置分享来源，可选参数
        _shareUrl += '&pics=' + encodeURIComponent(_pic || '');    //参数pics设置分享图片的路径，多张图片以＂|＂隔开，可选参数
        window.open(_shareUrl, 'width=' + _width + ',height=' + _height + ',top=' + (screen.height - _height) / 2 + ',left=' + (screen.width - _width) / 2 + ',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
      },

      getFriendsMain(){  //获取用户信息
        try {
          let url = baseUrl + "friends/getFriendsMain";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
          };
          this.$axios(config).then(res => {
            if (res.data.code) {
              let getFriendsNews = res.data.data;
              this.weChatUrl = getFriendsNews.url;
              this.inviteFriendsNews = res.data.data;
              if (getFriendsNews.vip == 0) {
                this.marketSubsidies = false;
              }
              if (getFriendsNews.vip == 1) {
                this.marketSubsidies = true;
              }
              this.qrcode();
              this.initBaiduShare();
              $("#qrcode").html('');

            } else {
              this.$message({
                showClose: true,
                duration: 3000,
                message: res.data.msg || '操作失败！',
                type: 'error'
              });
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      weChatShow(){
        this.$nextTick(function () {
          this.qrcode();
          this.weChatTit = true;
        })
      },
      weChatHidden(){
        $("#qrcode").html('');
        this.weChatTit = false;
      },
      qrcode () {
        let text = "";
        if (this.weChatUrl) {
          text = this.weChatUrl;
        }
        let qrcode = new QRCode('qrcode', {
          width: 100,
          height: 100,
          text: text,
        });
      },
      handleClose(){
        this.dialogExchangeBonus = false;
        this.payPassword = '';
        this.amountNum = '';
      },
      cashBonuses(){
        try {
          let url = baseUrl + "account/Exchange/getExchangeStatus";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random()
          };
          this.$axios(config).then(res => {
            if (res.data.code == 1) {
              this.dialogExchangeBonus = true;
            } else if (res.data.code == 0) {
              this.dialogCashBonusesVisible = true;
              this.cashBonusesMsg = res.data.msg;
            } else {
              this.$message({
                showClose: true,
                duration: 6000,
                message: res.data.msg || '操作失败！',
                type: 'error'
              });
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      formValidate(){
        let reg = new RegExp("^[0-9]*$");
        if (!reg.test(this.amountNum)) {
          this.$message({
            showClose: true,
            duration: 3000,
            message: '提现金额输入的格式不对！',
            type: 'error'
          });
          return false;
        }

        if (this.amountNum % 500 != 0) {
          this.$message({
            showClose: true,
            duration: 3000,
            message: '输入的金额不是500的倍数！',
            type: 'error'
          });
          return false;
        }

        if (!reg.test(this.payPassword)) {
          this.$message({
            showClose: true,
            duration: 3000,
            message: '密码格式不对！',
            type: 'error'
          });
          return false;
        }
        if (this.payPassword.length == 0) {
          this.$message({
            showClose: true,
            duration: 3000,
            message: '密码不能为空！',
            type: 'error'
          });
          return false;
        }

        if (this.payPassword.length != 6) {
          this.$message({
            showClose: true,
            duration: 3000,
            message: '请输入六位数字的交易密码！',
            type: 'error'
          });
          return false;
        }
        return true;
      },
      ExchangeBonus(){   //提现
        try {
          if (this.formValidate()) {
            let url = baseUrl + "account/Exchange/getAddExchange";
            let config = {
              method: "POST",
              url: url + "?r=" + Math.random(),
              data: {
                amount: this.amountNum,
                paypassword: this.payPassword
              }
            };
            this.$axios(config).then(res => {
              if (until.responesValidate(res)) {
                if (res.data.code) {
                  this.$message({
                    type: "success",
                    duration: 1000,
                    message: res.data.msg || "提现成功！",
                    onClose: () => {
                      this.getFriendsMain();
                      this.handleClose();

                    }
                  });

                } else {
                  this.$message({
                    showClose: true,
                    duration: 3000,
                    message: res.data.msg || '操作失败！',
                    type: 'error'
                  });
                }
              }
            });
          }
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      //复制
      copy(n){
        if (n == 1)
          var clipboard = new Clipboard('.tag-read1');
        if (n == 2)
          var clipboard = new Clipboard('.tag-read2');
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
    },
    components: {ElCol}
  }

</script>

<style lang="scss" scoped>
  #copyCode {
    width: 130px;
    font-size: 14px;
    margin: 20px 0;
    font-weight: bold;
    overflow: hidden;
  }

  #copyUrl {
    background: #FAFAFA;
    height: 35px;
    line-height: 35px;
    padding: 0 5px;
    width: 50%;
    overflow: hidden;
  }

  .share {
    position: relative;
  }

  .qrcode-box {
    position: absolute;
    top: -60px;
    left: 40px;
  }

  #qrcode {
    width: 100px;
    height: 100px;
    position: absolute;
    top: -10px;
    left: 0;
  }

  .weChat-text {
    width: 90px;
    position: absolute;
    top: 96px;
    left: 6px;
    font-size: 12px;
    color: rgba(102, 102, 102, 1);
  }

  .shareIcon {
    cursor: pointer;
  }

  .infoBox .el-col label {
    font-size: 14px;
    color: #999;
  }

  .receiving {
    background: #F6F6F6;
    padding: 25px 25px 0 25px;
    margin: 0 0 30px 0;
    position: relative;
    .el-col {
      margin-bottom: 25px;
      font-size: 14px;
      label {
        color: #999;
      }
    }
  }

  .link-btn {
    cursor: pointer;
    color: rgb(64, 158, 255);
    margin-left: 10px;
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
      border-color: transparent transparent transparent;
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
      border-color: transparent transparent #F6F6F6;
      position: absolute;
      top: 1px;
      left: -10px;
    }
  }

  .receiving .arrows {
    /*  left: 515px*/
    left: 425px
  }

  .friends_title {
    font-size: 20px;
    font-weight: normal;
    margin: 30px 0;
  }

  .friends {
    display: flex;
    padding: 0 20px;
    .steps {
      width: 100px;
      text-align: center;
      font-size: 14px;
      text-align: center;
      line-height: 25px;
      span {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      span.stepIcon1 {
        background: url(./../../../assets/step1.png) no-repeat center center;
      }
      span.stepIcon2 {
        background: url(./../../../assets/step2.png) no-repeat center center;
      }
      span.stepIcon3 {
        background: url(./../../../assets/step3.png) no-repeat center center;
      }
    }
    .line {
      flex: 1;
      text-align: center;
      line-height: 100px;
      font-size: 20px;
      color: #999;
    }

  }

  .copyCode {
    font-size: 14px;
    margin: 20px 0;
  }

  .copyLink {
    background: #FAFAFA;
    height: 35px;
    line-height: 35px;
    padding: 0 5px;
  }

  .share {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px;
  }

  .share {
    text-align: center;
  }

  .ContTop {
    text-align: center;
    font-size: 14px;
    b {
      font-size: 24px;
    }
  }

  .diaInputs {
    display: flex;
    margin: 40px 0 20px;
    align-items: center;
    color: #999;
    label {
      width: 140px;
      text-align: center;
    }
    .el-input {
      flex: 1;
    }
    img {
      width: 150px;
      height: 40px;
      margin-left: 20px;
    }
  }

  .share .shareIcon {
    height: 93px;
    margin: 0;
    padding: 0;
    background-size: 78px 78px;
  }

  .share .shareIcon.qq p {
    margin-top: 77px;
  }

  .shareIcon.qq {
    background: url(./../../../assets/share_qq.png) no-repeat center top;
  }

  .bdshare-button-style0-16 a {
    line-height: inherit;
  }

  .bdshare-button-style0-16:after {
    content: none;
  }

  .bdshare-button-style0-16 a:hover {
    color: inherit;
    opacity: inherit;
    filter: inherit;
  }

  .cashBonusesCon {
    height: 14px;
    font-size: 14px;
    color: #333;
    line-height: 20px;
    margin-bottom: 20px;
    padding-left: 16px;
  }
</style>
<style>
  .cash-bonuses .el-dialog__header .el-dialog__title {
    font-size: 20px !important;
    color: #333333;
    font-weight: bold;
  }

  .cash-bonuses .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 16px;
  }

  .cash-bonuses .dialog-footer .el-button {
    width: 180px;
    height: 39px;
    border-radius: 20px;
  }

  .cash-bonuses .dialog-footer .el-button--primary {
    background-color: #2E6AF4;
    border: 1px solid #2E6AF4;
    margin-left: 30px;
  }

  .cashBonuses-model .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 16px;
  }
</style>
