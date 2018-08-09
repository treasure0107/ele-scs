<template>
  <div class="friendsList">
    <div style="padding-top: 20px;">
      <el-row class="breadcrumbs">
        <el-col :span="16">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/InviteFriends' }">邀请好友</el-breadcrumb-item>
            <el-breadcrumb-item>直推明细</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
    </div>
    <div style="padding:16px 0 10px; margin-bottom: 10px;">
      <div class="block" style="font-size:16px">
        用户ID/手机号码 :<el-input v-model='searchStr'  style="width:275px;height: 30px;margin-left: 20px;" placeholder="用户ID/手机号码"></el-input>
        <el-button type="danger"
                   style="background: #5357E2;height: 30px;line-height: 30px;border: none;padding: 0 20px;margin-left: 18px;"
                   @click="handleSearch" v-dbClick>搜索
        </el-button>
        <el-button type="success" style="height: 30px;line-height: 30px;border: none;padding: 0 20px;margin-left: 18px;"
                   @click="timeReset" >重置
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
          width="160">
        </el-table-column>
        <el-table-column
          prop="lower_entrancemoney"
          label="参与金额"
          align="center"
          fit=true>
        </el-table-column>
        <el-table-column
          prop="geren_moneny"
          label="个人奖"
          align="center"
          fit=true>
        </el-table-column>
        <el-table-column
          prop="addtime"
          label="结算时间"
          align="center"
          fit=true>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrap invite-page-wrap" style="text-align:center; margin-top: 30px;">
      <el-pagination
        :page-size="10"
        :current-page="page"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :total="count"
        background
      >
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
        searchStr:'',
        count:0,
        page:1,
        filters: {
          uuid: ''
        },
        startDate: '',
        endDate: ''
      }
    },
    mounted(){
      this.getIn()
    },
    methods: {
      handleSearch(){
        if(this.searchStr !=='')
          this.getIn()
      },
      timeReset(){
          this.searchStr =''
          this.getIn()
      },
      //获取页面数据
      getIn(){
          try {
            let url = baseUrl + "/friends/rewardList";
            let config = {
              method: "POST",
              url: url + "?r=" + Math.random(),
              data:{search:this.searchStr,page:this.page,type:1}
            };
            this.$axios(config).then(result => {
              if (until.responesValidate(result)) {
                this.count = result.data.data.total
                this.tableData = result.data.data.data
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
      },
      //分页
      handleCurrentChange(val){
        this.page = val
        this.getIn()
      }
    },
    computed: {
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  @import "../../../styles/mixin";
  /deep/ .invite-page-wrap .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgba(11, 12, 34, 1);
  }
</style>
