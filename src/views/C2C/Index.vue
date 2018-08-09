<template>
  <div class="main">
    <div class="c2cBanner"><img src="./../../assets/banner2.png" alt=""></div>
    <div class="container">
      <el-container>
        <el-main>
					<div class="joinInfo">
						<el-row class="info">
							<!-- 未参与 -->
							<el-col :span="18" class="infoBox" v-if="status==-1&&status_id==1">
								<el-col :span="8" class="account">
									<div>账户币余额</div>
									<b>{{available_coin}}</b> <span class="coin">GFC</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>可用票数</div> 
									<em>{{available_votes}}</em>
								</el-col>
								<el-col :span="8" class="account">
									<div>备用金可用余额 </div>
									<em>{{available_cny}}</em>
								</el-col>
							</el-col>
							
							<!-- 参与中 --><!-- 正在买入 -->
							<el-col :span="18" class="infoBox" v-if="(status==0||status==2)&&status_id==1">
								<el-col :span="8" class="account">
									<div>参与金额</div>
									<b>{{entrance_money}}</b> <span class="coin">CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>使用票数</div>
									<em>{{entrance_votes}}票</em>
								</el-col>
								<el-col :span="8" class="account">
									<div>冻结备用金</div>
									<em class="disable">{{frozen_cny}}</em>
								</el-col>
								<el-col :span="8" class="account">
									<div>剩余可用票数</div>
									<em>{{available_votes}}票</em>
								</el-col>
								<el-col :span="8" class="account">
									<div>使用备用金</div>
									<em>{{entrance_deduction}}</em>
								</el-col>
							</el-col>
							
							<!-- 等待卖出 -->
							<el-col :span="18" class="infoBox" v-if="status==0&&status_id==0">
								<el-col :span="8" class="account">
									<div>账户币余额</div>
									<b>{{num}}</b> <span class="coin">GFC</span>
								</el-col>								
								<el-col :span="8" class="account">
									<div>可用票数</div>
									<em>{{available_votes}}票</em>
								</el-col>
								<el-col :span="8" class="account">
									<div>冻结备用金</div>
									<em class="disable">{{frozen_cny}}</em>
								</el-col>
							</el-col>
							
							<!-- 卖出中 -->
							<el-col :span="18" class="infoBox" v-if="status==2&&status_id==0">
								<el-col :span="8" class="account">
									<div>卖出数量</div>
									<b>{{num}}</b> <span class="coin">GFC</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>单价</div>
									<em>{{price}}</em> <span>CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>交易总额</div>
									<em>{{total_amount}}</em> <span>CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>实际收款总额</div>
									<em>{{actual_amount}}</em> <span>CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>已收款</div>
									<em>{{paid_amount}}</em> <span>CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>待收款</div>
									<em>{{unpaid_amount}}</em> <span>CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>可用备用金</div>
									<em>{{available_cny}}</em>
								</el-col>
								<el-col :span="8" class="account">
									<div>冻结备用金</div>
									<em class="disable">{{frozen_cny}}</em>
								</el-col>
							</el-col>
							
							
							<el-col :span="6">
								<div class="joinBtn">
									<p>当前账户状态</p>
									<div v-if='userState.length == 1'>{{userState[0].name}}</div>
									<el-dropdown v-if="userState.length != 1" trigger="hover" placement="bottom-start"
															 @command="handleCommand">
										<span class="el-dropdown-link">
											{{status_name}}<i class="el-icon-arrow-down el-icon--right"></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item v-for='(item,index) in userState' :key='index' :command="item">{{item.name}}
											</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
									
									<!-- 未参与 -->
									<router-link style="color:#5357E2;" :to="'/lineUp'" v-if="status==-1&&status_id==1">
										<el-button type="primary" round style="">我要参与</el-button>
									</router-link>
									
									<!-- 参与中 -->
									<router-link style="color:#5357E2;" :to="'/lineUp?edit=true'"	v-if="status==0&&status_id==1">
										<el-button type="primary" round style="">修改参与信息</el-button>
									</router-link>
									
									<!-- 买入中 -->
									<router-link style="color:#5357E2;" :to="'/Order'" v-if="status==2&&status_id==1">
										<el-button type="primary" round style="">买入订单管理</el-button>
									</router-link>
									
									<!-- 等待卖出 -->
									<el-button type="primary" round style="" @click="sellOut" v-if="status===0&&status_id==0">卖出</el-button>
									
									<!-- 卖出中 -->									
									<router-link style="color:#5357E2;" :to="'/Order'" v-if="status==2&&status_id==0">
										<el-button type="primary" round style="">卖出订单管理</el-button>
									</router-link>									
									
								</div>
							</el-col>
						</el-row>
					</div>
					
					
					
					
          <!---id等于1 status等于-1  未参与-->  <!-- status等于1 等待卖出 -->
          <!-- <div class="joinInfo" v-if="status==-1&&userState.some((item)=>item.id==1)"> -->
 <!--           <el-row class="info">
              <el-col :span="18" class="infoBox">
                <el-col :span="8" class="account">
                  <div>账户币余额</div>
                  <b>{{available_coin}}</b> <span class="coin">GFC</span>
                </el-col>
                <el-col :span="8" class="account">
                  <div>可用票数</div> 
                  <em>{{available_votes}}</em>
                </el-col>
                <el-col :span="8" class="account">
                  <div>备用金可用余额 </div>
                  <em>{{available_cny}}</em>
                </el-col>
              </el-col>
              <el-col :span="6">
                <div class="joinBtn">
                  <p>当前账户状态</p>
                  <div v-if='userState.length == 1'>{{userState[0].name}}</div>
                  <el-dropdown v-if="userState.length != 1" trigger="hover" placement="bottom-start"
                               @command="handleCommand">
                    <span class="el-dropdown-link">
                      {{userState[0].name}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for='(item,index) in userState' :key='index' :command="item">{{item.name}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                  <router-link style="color:#5357E2;" :to="'/lineUp'">
                    <el-button type="primary" round style="">我要参与</el-button>
                  </router-link>
                </div>
              </el-col>
            </el-row>
          </div> -->
          <!--id等于1 status等于0 参与中-->
 <!--         <div class="joinInfo" v-if="status==0&&userState.some((item)=>item.id==1)">
            <el-row class="info">
              <el-col :span="18" class="infoBox">
                <el-col :span="8" class="account">
                  <div>参与金额</div>
                  <b>{{entrance_money}}</b> <span class="coin">CNY</span>
                </el-col>
                <el-col :span="8" class="account">
                  <div>使用票数</div>
                  <em>{{entrance_votes}}票</em>
                </el-col>
                <el-col :span="8" class="account">
                  <div>冻结备用金</div>
                  <em class="disable">{{frozen_cny}}</em>
                </el-col>
                <el-col :span="8" class="account">
                  <div>剩余可用票数</div>
                  <em>{{available_votes}}票</em>
                </el-col>
                <el-col :span="8" class="account">
                  <div>使用备用金</div>
                  <em>{{entrance_deduction}}</em>
                </el-col>
              </el-col>
              <el-col :span="6">
                <div class="joinBtn">
                  <p>当前账户状态</p>
                  <div v-if='userState.length == 1'>{{userState[0].name}}</div>
                  <!--   <div class="state-class" v-if="userState[0].one_status==0">待付款</div>-->
                  <!-- <div class="state-class" v-if="userState[0].one_status==1">审核中</div>
                  <div class="state-class" v-if="userState[0].one_status==2">审核成功</div>
                  <div class="state-class" v-if="userState[0].one_status==3">审核失败</div> -->
<!--                  <el-dropdown v-if="userState.length != 1" trigger="hover" placement="bottom-start"
                               @command="handleCommand">
										<span class="el-dropdown-link">
											{{userState[0].name}}<i class="el-icon-arrow-down el-icon--right"></i>
										</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for='(item,index) in userState' :key='index' :command="item">{{item.name}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown> -->
<!--                  <el-button type="primary" round
                             style="background-color: #F2721D;margin-bottom: 15px;border:none;margin-top: 5px;"
                             @click="showPayment" v-if="userState[0].one_status==0||userState[0].one_status==3">立即支付
                  </el-button>-->
<!--                  <router-link style="color:#5357E2;" :to="'/lineUp?edit=true'"
                               v-if="userState[0].one_status==0||userState[0].one_status==3">
                    <el-button type="primary" round style="">修改参与信息</el-button>
                  </router-link>
                </div>
              </el-col>
            </el-row>
          </div> -->
          <!--status等于2  id等于0  卖出中--><!--status等于2  id等于1  正在买入中-->
<!--          <div class="joinInfo" v-if="status==2">
            <el-row class="info">
							<el-col :span="18" class="infoBox" v-if="status_id==0">
								<el-col :span="8" class="account">
									<div>卖出数量</div>
									<b>{{num}}</b> <span class="coin">GFC</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>单价</div>
									<em>{{price}}</em> <span>CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>交易总额</div>
									<em>{{total_amount}}</em> <span>CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>实际收款总额</div>
									<em>{{actual_amount}}</em> <span>CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>已收款</div>
									<em>{{paid_amount}}</em> <span>CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>待收款</div>
									<em>{{unpaid_amount}}</em> <span>CNY</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>可用备用金</div>
									<em>{{available_cny}}</em>
								</el-col>
								<el-col :span="8" class="account">
									<div>冻结备用金</div>
									<em class="disable">{{frozen_cny}}</em>
								</el-col>
							</el-col>
              <el-col :span="18" class="infoBox" v-else-if="status_id==1">
                <el-col :span="8" class="account">
                  <div>参与金额</div>
                  <b>{{entrance_money}}</b> <span class="coin">CNY</span>
                </el-col>
                <el-col :span="8" class="account">
                  <div>使用票数</div>
                  <em>{{entrance_votes}}票</em>
                </el-col>
                <el-col :span="8" class="account">
                  <div>冻结备用金</div>
                  <em class="disable">{{frozen_cny}}</em>
                </el-col>
                <el-col :span="8" class="account">
                  <div>剩余可用票数</div>
                  <em>{{available_votes}}票</em>
                </el-col>
                <el-col :span="8" class="account">
                  <div>使用备用金</div>
                  <em>{{entrance_deduction}}</em>
                </el-col>
              </el-col>
              <el-col :span="6">
                <div class="joinBtn">
                  <p>当前账户状态</p>
                  <div v-if='userState.length == 1'>{{userState[0].name}}</div> -->
                  <!--   <div class="state-class" v-if="userState[0].one_status==0">待付款</div>-->
                  <!-- <div class="state-class" v-if="userState[0].one_status==1">审核中</div>
                  <div class="state-class" v-if="userState[0].one_status==2">审核成功</div>
                  <div class="state-class" v-if="userState[0].one_status==3">审核失败</div> -->
<!--                  <el-dropdown v-if="userState.length != 1" trigger="hover" placement="bottom-start"
                               @command="handleCommand">
										<span class="el-dropdown-link">
											{{status_name}}<i class="el-icon-arrow-down el-icon--right"></i>
										</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for='(item,index) in userState' :key='index' :command="item">{{item.name}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown> -->
<!--                  <el-button type="primary" round
                             style="background-color: #F2721D;margin-bottom: 15px;border:none;margin-top: 5px;"
                             @click="showPayment" v-if="userState[0].one_status==0||userState[0].one_status==3">立即支付
                  </el-button>-->
									<!-- <router-link style="color:#5357E2;" :to="'Order'" v-if="status_id==0">
										<el-button type="primary" round style="">卖出订单管理</el-button>
									</router-link>
                  <router-link style="color:#5357E2;" :to="'Order'" v-if="status_id==1">
                    <el-button type="primary" round style="">买入订单管理</el-button>
                  </router-link>
                </div>
              </el-col>
            </el-row>
          </div> -->
					<!-- status等于1 等待卖出 -->
					<!-- <div class="joinInfo" v-if="status==0&&userState.some((item)=>item.id==0)">
						<el-row class="info">
							<el-col :span="18" class="infoBox">
								<el-col :span="8" class="account">
									<div>账户币余额</div>
									<b>{{available_coin}}</b> <span class="coin">GFC</span>
								</el-col>
								<el-col :span="8" class="account">
									<div>可用票数</div> 
									<em>{{available_votes}}</em>
								</el-col>
								<el-col :span="8" class="account">
									<div>冻结备用金总额</div>
									<em>{{frozen_cny}}</em>
								</el-col>
							</el-col>
							<el-col :span="6">
								<div class="joinBtn">
									<p>当前账户状态</p>
									<div v-if='userState.length == 1'>{{userState[0].name}}</div>
									<el-button type="primary" round style="" @click="sellOut">卖出</el-button>									
								</div>
							</el-col>
						</el-row>
					</div> -->
					
          <!-- 	立即支付对话框 -->
          <el-dialog
            :visible.sync="dialogPayNow"
            width="500px"
            :before-close="handleClose">
            <payment-box :produId="produId" v-on:hideBox="hideBox"></payment-box>
          </el-dialog>

          <!-- <div class="listBox">
            <h2>正在卖出  <span></span></h2>
            <img-scroll :comeOutData="comeOutData"></img-scroll>
                 <div class="lists">
                    <div class="list_item" v-for="(item,index) in comeOutData" :key="index">
                      <img src="./../../assets/head.jpg">
                      <p>{{item.username}}</p>
                      <p>买 {{item.num}}</p>
                    </div>
                  </div>
          </div> -->

          <!--<div class="listBox">-->
            <!--<h2>-->
              <!--用户参与列表  <span>以下列表不代表具体参与顺序</span>-->
              <!--<div class="listNum">-->
                <!--当前参与人数：<b>{{entranceCount}}</b> 人-->
              <!--</div>-->
            <!--</h2>-->
            <!--<div class="lists">-->
              <!--<div class="list_item" v-for="(item,index) in entranceData" :key="index">-->
                <!--<img :src="item.photo">-->
                <!--<p>{{item.username}}</p>-->
                <!--<p>买 {{item.entrancemoney}}</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import ImgScroll from "@/components/ImgScroll";
  import paymentBox from "@/views/C2C/paymentBox";
	import {MessageBox} from 'element-ui';
  export default {
    data(){
      return {
        dialogPayNow: false,//支付方式
        entrance_money: '',//排队金额
        available_cny: '',//可用备用金
        available_votes: '',//可用票
        available_coin: '',//可用币
        entrance_votes: '',//使用票数
        frozen_votes: '',//冻结票数
        frozen_cny: '',//冻结备用金
        comeOutData: [],//正在卖出
        entranceData: [],//等待进场列表
        entranceCount: 0,//排队人数
        userState: [],//用户状态,
        status: '',
        entrance_deduction: '', //使用备用金（备用金抵扣）
        produId: "",
				status_id:0,
				status_name:'',
				price:'',
				num:'',
				total_amount:'',
				actual_amount:'',
				paid_amount:'',
				unpaid_amount:''				
      }

    },
    mounted(){
      this.getUsercoin();
      this.getComeout();
      this.getEntrance();			
    },
    methods: {
      hideBox(){
        this.dialogPayNow = false;
        this.getUsercoin();
        this.getComeout();
        this.getEntrance();
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
      showPayment(){
        this.dialogPayNow = true;
      },
			handleCommand(command) {
				this.status_id=command.id;
				this.status_name=command.name;
				this.getUsercoin(command.id);
      },
      //获取账户基本信息
      getUsercoin(type){
        try {
					let formdata = {};
					if(type!=undefined){
						formdata.type=type
					}
          let url = baseUrl + "/account/c2c/getusercoin";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
						data:formdata
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              if(result.data.data.type_list.find((item)=>item.id==1)){
              	this.produId = result.data.data.type_list.find((item)=>item.id==1).pid;
              } 
              this.entrance_money = result.data.data.entrance_money
              this.available_cny = result.data.data.available_cny
              this.available_votes = result.data.data.available_votes
              this.available_coin = result.data.data.available_coin
              this.frozen_votes = result.data.data.frozen_votes
              this.frozen_cny = result.data.data.frozen_cny
              this.userState = result.data.data.type_list
              this.status = result.data.data.status
              this.entrance_deduction = result.data.data.entrance_deduction
              this.entrance_votes = result.data.data.entrance_votes;
							this.price=result.data.data.price;
							this.num=result.data.data.num;
							this.total_amount=result.data.data.total_amount;
							this.actual_amount=result.data.data.actual_amount;
							this.paid_amount=result.data.data.paid_amount;
							this.unpaid_amount=result.data.data.unpaid_amount;
							if(type==undefined){
								if(this.userState.length>1){
									this.status_id=0;
									this.one_status=this.userState.find(item=>item.id==1).one_status;
								}else{
									this.status_id=this.userState[0].id;
									this.one_status=this.userState[0].one_status;
								}
								this.status_name=this.userState.find(item=>item.id==this.status_id).name;
							}						
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      //获取正在卖出
      getComeout(){
        try {
          let url = baseUrl + "/account/c2c/comeout";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random()
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              this.comeOutData = result.data.data
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      //获取等待参与
      getEntrance(){
        try {
          let url = baseUrl + "/account/c2c/entrance";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random()
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              this.entranceData = result.data.data.list;
              this.entranceCount = result.data.data.total;
              if (this.$route.path == "/C2C") {
                setTimeout(() => {
                  this.getEntrance()
                }, 10000)
              }
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
    },
    components: {
      ImgScroll,
      paymentBox
    }
  }
</script>


<style lang="scss" scoped>
  .main {
    width: 100%;
    background: #fff;
		position: relative;
  }

  .state-class {
    margin-top: 5px !important;
    font-size: 16px !important;
    color: red;
  }

  .c2cBanner {
    background-color: #f36326;
    height: 140px;
    width: 100%;
    min-width: 1200px;
    overflow: hidden;
    position: absolute;
    img {
      position: absolute;
      transform: translateX(-50%);
      left: 50%;
      top: 0;
    }
  }

  .el-main {
    overflow: inherit;
    padding: 140px 0 0 0;
  }

  .info {
    display: flex;
    padding-bottom: 20px;
  }

  .joinInfo {
    box-shadow: 0 0 10px 0 #ddd;
  }

  .infoBox {
    padding-top: 30px;
  }

  .infoBox .el-col {
    margin-bottom: 20px;
    text-align: center;
  }

  .joinBtn {
    border-left: 1px solid #F6F6F6;
    height: 100%;
    padding-top: 38px;
    display: flex;
    align-items: center;
    flex-direction: column;
    /*    justify-content: center;*/
    p {
      font-size: 14px;
      color: #666;
    }
    b {
      font-size: 24px;
      display: block;
      margin: 10px 0
    }
    .el-button {
      width: 180px;
      background: #2E6AF4;
      font-size: 16px;
    }
    div {
      font-size: 24px;
      height: 36px;
      margin-top: 10px;
    }
  }

  .listBox {
    margin: 40px 0;
    h2 {
      font-size: 20px;
      span {
        font-size: 14px;
        color: #999;
        margin-left: 20px;
      }
      .listNum {
        float: right;
        font-size: 14px;
        color: #999;
        b {
          font-size: 20px;
          color: #EB4543;
        }
      }
    }
    .lists {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap; //justify-content:space-between;
      .list_item {
        width: 10%;
        padding: 20px 0;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
        p {
          color: #666;
          margin: 10px 0 0 0;
        }
      }
    }
  }

  .el-dropdown {
    margin: 10px 0 15px;
  }

  .el-dropdown-link {
    font-size: 24px;
  }

  .changeEntrance-enter-active, .changeEntrance-leave-active {
    transition: all 1s;
  }

  .changeEntrance-enter, .changeEntrance-leave-to
    /* .list-leave-active for below version 2.1.8 */
  {
    opacity: 0;
  }

  .account {
    height: 72px;
    div {
      font-size: 14px;
      color: #666;
      margin-bottom: 15px;
      line-height: 30px;

    }
  }
</style>
