<template>
  <div class="center-main" style="padding: 10px 30px">
    <h2 class="center-title">账户总览</h2>
    <el-row class="infoBox" style="padding-bottom: 0">
      <el-col :span="6" class="account" style="margin-bottom: 30px;">
        <div>账户币可用余额</div>
        <b v-text="available_coin || 0">365.46</b> <span class="coin">GFC</span>
      </el-col>
      <el-col :span="6" class="account">
        <div style="margin-bottom: 17px">当前账户状态</div>
        <!--<p class="lineUp">排队中<i class="el-icon-arrow-down"></i></p>-->
        <div class="choce">
          <!--<span v-text="name || ''" class="sp1"></span>-->
          <div style="cursor: pointer" v-if='type_list.length == 1'>{{type_list[0].name}}</div>
          <el-dropdown  v-if="type_list.length != 1" trigger="hover" placement="bottom-start"
                       @command="handleCommand">
										<span style="cursor: pointer" class="el-dropdown-link">
											{{status_name}}<i class="el-icon-arrow-down el-icon--right"></i>
										</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for='(item,index) in type_list' :key='index' :command="item">{{item.name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <!-- 未参与 -->
          <router-link style="color:#5357E2;" :to="'/lineUp'" v-if="status==-1&&status_id==1">
            <el-button size="mini" type="primary" round style="background: #2E6AF4">我要参与</el-button>
          </router-link>

          <!-- 参与中 -->
          <router-link style="color:#5357E2;" :to="'/lineUp?edit=true'"	v-if="status==0&&status_id==1">
            <el-button size="mini" type="primary" round style="background: #2E6AF4">修改参与信息</el-button>
          </router-link>

          <!-- 买入中 -->
          <router-link style="color:#5357E2;" :to="'/Order'" v-if="status==2&&status_id==1">
            <el-button size="mini" type="primary" round style="background: #2E6AF4">买入订单管理</el-button>
          </router-link>

          <!-- 等待卖出 -->
          <el-button size="mini" type="primary" round style="background: #2E6AF4" @click="sellOut" v-if="status==0&&status_id==0">卖出</el-button>

          <!-- 卖出中 -->
          <router-link style="color:#5357E2;" :to="'/Order'" v-if="status==2&&status_id==0">
            <el-button size="mini" type="primary" round style="background: #2E6AF4">卖出订单管理</el-button>
          </router-link>
          <!--<span v-if="!isA" v-text="retFn()" class="sp2"></span>-->
        </div>
      </el-col>
    </el-row>
    <el-row class="infoBox border_b" style="padding-top: 0">
      <el-col :span="6" class="account">
        <div>冻结币
          <el-popover
            placement="top"
            width="200"
            trigger="hover"
            content="卖出中的币数量">
            <el-button type="text" slot="reference" size="mini" icon="el-icon-question" circle></el-button>
          </el-popover>
        </div>
        <em class="disable" v-text="frozen_coin || 0">25
          <small>XRP</small>
        </em>
      </el-col>

      <el-col :span="6" class="account">
        <div>可用票数</div>
        <em v-text="available_votes || 0">225</em>
        <el-button type="primary" size="mini" round @click="turnTickets" style="background: #2E6AF4">转票</el-button>
      </el-col>
      <!--<el-col :span="6" class="account">-->
      <!--<div>冻结票数-->
      <!--<el-popover-->
      <!--placement="top"-->
      <!--width="200"-->
      <!--trigger="hover"-->
      <!--content="参与中使用的票数">-->
      <!--<el-button type="text" slot="reference" size="mini" icon="el-icon-question" circle></el-button>-->
      <!--</el-popover>-->
      <!--</div>-->
      <!--<em class="disable" v-text="frozen_votes || 0">225</em>-->
      <!--</el-col>-->
      <el-col :span="6" class="account">
        <div>账户备用金余额</div>
        <em v-text="available_cny || 0">225</em>
      </el-col>
      <!--<el-col :span="6" class="account">-->
      <!--<div>冻结票数-->
      <!--<el-popover-->
      <!--placement="top"-->
      <!--width="200"-->
      <!--trigger="hover"-->
      <!--content="参与中使用的票数">-->
      <!--<el-button type="text" slot="reference" size="mini" icon="el-icon-question" circle></el-button>-->
      <!--</el-popover>-->
      <!--</div>-->
      <!--<em class="disable" v-text="frozen_votes || 0">225</em>-->
      <!--</el-col>-->
      <el-col :span="6" class="account">
        <div>冻结备用金
          <el-popover
            placement="top"
            width="200"
            trigger="hover"
            content="参与中所抵扣的备用金">
            <el-button type="text" slot="reference" size="mini" icon="el-icon-question" circle></el-button>
          </el-popover>
        </div>
        <em class="disable" v-text="frozen_cny || 0">225</em>
      </el-col>
    </el-row>
    <p class="curListNum">最近8条交易记录 <a href="javascript:void(0)" @click="$router.push('/RecordList')">查看更多 ></a></p>

    <div class="tab-list">
    <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column
    label="交易时间"
    width="200"
    align="center">
    <template slot-scope="scope">
    <span style="margin-left: 5px">{{ scope.row.addtime }}</span>
    </template>
    </el-table-column>
    <el-table-column
    prop="title"
    label="交易类型"
    width="100"
    align="center">
    </el-table-column>
    <el-table-column
    label="交易总额"
    width="200"
    align="center">
    <template slot-scope="scope">
    <span style="margin-left: 5px">{{ scope.row.amount }} {{ scope.row.xnb }}</span>
    </template>
    </el-table-column>
      <el-table-column
        prop="periods_name"
        label="期数"
        width="110"
        align="center">
        <template slot-scope="scope">
          <span style="margin-left: 5px">{{ !scope.row.periods_name?'-----': scope.row.periods_name}}</span>
        </template>
      </el-table-column>
    <el-table-column
    prop="status"
    label="状态"
    width="100"
    align="center">
    </el-table-column>
    <el-table-column
    width="170"
    label="操作"
    align="center">
    <template slot-scope="scope">
    <router-link style="color:#5357E2;" :to="'/RecordDetial/' + scope.row.id + '/' + scope.row.type">查看详情</router-link>
    </template>
    </el-table-column>
    </el-table>
    </div>
    <!--立即支付对话框-->
    <el-dialog
      :visible.sync="dialogPayNow"
      width="500px"
      :before-close="handleClose">
      <payment-box :produId="produId" v-on:hideBox="hideBox"></payment-box>
    </el-dialog>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import {MessageBox} from 'element-ui';
  import paymentBox from "@/views/C2C/paymentBox";
  const obj = {
    id: 1,
    date: "2018-10-10 10:10:10",
    type: '买入',
    money: '5000XRP',
    tradeId: 'A45111',
    tradeState: '待付款'
  }
  export default {
    data(){
      return {
        available_coin: '',
        available_cny: '',
        available_votes: '',
        frozen_votes: '',
        frozen_cny: '',
        frozen_coin: '',
        currentPage: 1,
        tableData: [],
        type_list: [],
        status: '',
        value: '',
        type: '',
        paypassword: 0,
        name: '',
        isT: '',
        isA: '',
        dialogPayNow: false,//支付方式
        produId: "",
        status_name:'',
        status_id:0,
      }

    },
    mounted(){
      this.getCoin(1);
      this.getProfile();
      this.getMs();
    },
    methods: {
      changer () {
        this.getCoin();
      },
      hideBox(){
        this.dialogPayNow = false;
        this.getCoin(1);
        this.getProfile();
        this.getMs();
      },
      handleCommand(command) {
        this.status_id=command.id;
        this.status_name=command.name;
        //this.getUsercoin(command.id);
      },
      retFn(){
        if (this.type_list[0]) {
          if (this.type_list[0].one_status == '0') {
            return '未审核'
          } else if (this.type_list[0].one_status == '1') {
            return '审核中'
          } else if (this.type_list[0].one_status == '2') {
            return '审核成功'
          } else if (this.type_list[0].one_status == '3') {
            return '审核失败'
          }
        }
      },
      sellOut(){
        MessageBox.confirm("<p style='margin:15px 20px;text-align:left;color:red'>1.请务必确认您的姓名和银行卡信息准确无误！！！</p><p style='text-align:left;margin:0 20px'>2.卖出前需先再参与一轮，且这次参与金额不得少于上一次参与金额。点击我要参与之后，系统会自动匹配卖出。</p>", '提示', {
          dangerouslyUseHTMLString: true,
          customClass: 'customAlert autoWidth',
          confirmButtonText: '我要参与',
          showCancelButton: false,
          confirmButtonClass: 'customAlertConfirm',
          callback: (action, instance) => {
            if (action == "confirm") {
              console.log(this)
              this.$router.push({path: "/lineUp"})
            }
          }
        })
      },
      getProfile(){
        try {
          let url = baseUrl + "/friends/getProfile";
          let config = {
            method: "post",
            url: url + "?r=" + Math.random()
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              let data = result.data.data;
              this.paypassword = data.paypassword;
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
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
      turnTickets(){
        if (this.paypassword == 0) {
          MessageBox({
            title: "提示",
            message: '您还未设置交易密码,请先设置交易密码',
            confirmButtonText: '去设置',
            type: "info",
            showClose: true,
            callback: (action, instance) => {
              if (action == "confirm") {
                router.push({path: "/AccountSet"})
              }
            }
          });
        } else {
          this.$router.push('/TurnTicket')
        }
      },
      //获取账户基本信息
      /*			getProfile(){
       try {
       let	url = baseUrl + "/friends/getProfile";
       let config = {
       method: "post",
       url: url + "?r=" + Math.random()
       };
       this.$axios(config).then(result => {
       if (until.responesValidate(result)) {
       let data=result.data.data;
       this.paypassword=data.paypassword
       }
       });
       } catch (ex) {
       until.consoleLog(ex);
       }
       },*/
      turnTickets(){
        if (this.paypassword == 0) {
          MessageBox({
            title: "提示",
            message: '您还未设置交易密码,请先设置交易密码',
            confirmButtonText: '去设置',
            type: "info",
            showClose: true,
            callback: (action, instance) => {
              if (action == "confirm") {
                router.push({path: "/AccountSet"})
              }
            }
          });
        } else {
          this.$router.push('/TurnTicket')
        }
      },
      getCoin (it) {
        let self = this;
        try {
          this.$axios({
            method: "post",
            url: baseUrl + 'account/c2c/getusercoin?r=' + Math.random(),
            data: {
              "type": self.type
            }
          }).then((result) => {
            if (until.responesValidate(result)) {
              let res = result.data.data;
              self.available_coin = res.available_coin;
              self.available_cny = res.available_cny;
              self.available_votes = res.available_votes;
              self.frozen_votes = res.frozen_votes;
              self.frozen_cny = res.frozen_cny;
              self.frozen_coin = res.frozen_coin;
              self.status = result.data.data.status
              self.type_list = res.type_list;
              self.name = self.type_list[0].name;
              self.produId = result.data.data.type_list[0].pid;
//              if (self.type_list[0].one_status == '0' || self.type_list[0].one_status == '3') {
//                self.isT = true;
//              } else if (self.type_list[0].one_status == '1' || self.type_list[0].one_status == '2') {
//                self.isT = false;
//              }
//              if (self.type_list[0].one_status == '0') {
//                self.isA = true;
//              } else if (self.type_list[0].one_status == '1' || self.type_list[0].one_status == '2' || self.type_list[0].one_status == '3') {
//                self.isA = false;
//              }

              if(this.type_list.length>1){
                self.status_id=0;
                self.one_status=self.type_list.find(item=>item.id==1).one_status;
              }else{
                self.status_id=self.type_list[0].id;
                self.one_status=self.type_list[0].one_status;
              }
              self.status_name=self.type_list.find(item=>item.id==this.status_id).name;
//              if(it) {
//                setTimeout(function () {
//                  if (res.type_list[0]) {
//                    document.getElementsByClassName('el-input__inner')[0].value = res.type_list[0].name
//                    self.type = res.type_list[0].id
//                  }
//                },50)
//              }
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      getMs () {
        let self = this;
        try {
          this.$axios({
            method: "post",
            url: baseUrl + 'account/Record/getAccountRecodelist?r=' + Math.random(),
            data: ''
          }).then((result) => {
            if (until.responesValidate(result)) {
              let res = result.data.data;
              self.tableData = res
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      payNow(){
        this.dialogPayNow = true;
      },
      handleSizeChange(){

      },
      handleCurrentChange(){

      }
    },
    components: {
      paymentBox
    }
  }

</script>

<style lang="scss" scoped>
</style>
<style lang="css">
  .choce .el-input__inner {
    border: none;
    color: #606266;
    font-size: 16px;
    margin-bottom: 0px !important;
    height: 41px;
    padding-right: 0px !important;
    padding-left: 0px !important;
  }

  .choce .el-input__suffix {
    right: 69px;
  }

  .choce {
    margin-bottom: 0 !important;
    position: relative;
  }

  .choce .el-button {
    position: absolute;
    top: -10px;
    left: 106px;
  }

  .sp1 {
    font-size: 18px;
    margin-top: 5px;
  }

  .sp2 {
    margin-left: 10px;
  }
</style>
