<template>
  <div class="friendsList">
    <div style="padding-top: 20px;">
      <el-row class="breadcrumbs">
        <el-col :span="16">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/InviteFriends' }">邀请好友</el-breadcrumb-item>
            <el-breadcrumb-item>团队业务详情</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
    </div>
    <!--<p class='info'>-->
      <!--用户ID : <span>8888888888888</span>-->
      <!--手机号码 : <span>18888888888</span>-->
      <!--总团队奖 : <span>2040</span>-->
      <!--参与金额 : <span>300000</span>-->
    <!--</p>-->
    <div style="padding:16px 0 10px; margin-bottom: 10px;">
      <div class="block" style="font-size:16px;">
        用户ID/手机号码 :
        <el-input style="width:275px;height: 30px;margin-left: 20px;" v-model="searchStr"
                  placeholder="用户ID/手机号码"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="danger"
                   style="background: #5357E2;height: 30px;line-height: 30px;border: none;padding: 0 20px;margin-left: 18px;"
                   @click="handleSearch">搜索
        </el-button>
        <el-button type="success" style="height: 30px;line-height: 30px;border: none;padding: 0 20px;margin-left: 18px;"
                   @click="timeReset">重置
        </el-button>
      </div>
    </div>
    <div class="tab-list">
      <el-table
        width="100%"
        :data="tableData"
        stripe>
        <el-table-column
          prop="last_uuid"
          label="用户ID"
          width="130"
          align="center"
          fit=true>
        </el-table-column>
        <el-table-column
          prop="last_mobile"
          label="手机号码"
          align="center"
          fit=true>
        </el-table-column>
        <el-table-column
          prop="periods_name"
          label="期数"
          align="center"
          width="90">
        </el-table-column>
        <el-table-column
          prop="lower_userleval"
          label="用户等级"
          align="center"
          width="90">
        </el-table-column>
        <el-table-column
          prop="lower_entrancemoney"
          label="参与金额"
          align="center"
          width="130">
        </el-table-column>
        <el-table-column
          prop="team_moneny"
          label="团队奖"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="addtime"
          label="结算时间"
          align="center"
          fit=true>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrap invite-page-wrap" style="text-align:center; margin-top: 30px;"
         v-if="tableData && tableData.length">
      <el-pagination
        prevText="<"
        nextText=">"
        @size-change="handleSizeChange"
        @current-change="getFriendsPage"
        layout="prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page.sync="pageNum"
        background>
      </el-pagination>
    </div>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";

  export default {
    data(){
      return {
        tableData: [],
        pageNum: 1,
        total: 1,
        pageSize: 10,
        searchStr:'',
      }
    },
    mounted(){
      this.getFriendsList();
    },
    methods: {
      handleSizeChange(){

      },
      handleSearch(){
        this.getFriendsList();
      },
      timeReset: function () {
        this.searchStr = '';
        this.getFriendsList();
      },
      getFriendsPage(){
        this.getFriendsList();
      },
      getFriendsList(){
        try {
          let url = baseUrl + "friends/rewardList";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              search: this.searchStr,
              page: this.pageNum,       //当前分页，默认为1
              pagesize: this.pageSize,    //每页记录数，默认为10
              type: 2
            }
          };
          this.$axios(config).then(res => {
            if (res.data) {
              let list = res.data.data;
              this.total = list.total;
              this.tableData = list.data;
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
      }
    },
    computed: {},
    components: {}
  }

</script>

<style lang="scss" scoped>
  @import "../../../styles/mixin";

  /deep/ .invite-page-wrap .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgba(11, 12, 34, 1);
  }

  p.info {
    font-size: 16px;
  }

  p.info span {
    color: red;
    margin-right: 30px;
    font-weight: 900;
  }
</style>
