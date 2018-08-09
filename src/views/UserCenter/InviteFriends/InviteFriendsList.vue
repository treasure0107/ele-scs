<template>
  <div class="friendsList">
    <div style="padding-top: 20px;">
      <el-row class="breadcrumbs">
        <el-col :span="16">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/InviteFriends' }">邀请好友</el-breadcrumb-item>
            <el-breadcrumb-item>详情列表</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
    </div>
    <div style="padding:16px 0 10px; margin-bottom: 10px;">
      <div class="block">
        <el-date-picker
          v-model="startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期" style="width:160px;height:30px;">
        </el-date-picker>
        <el-date-picker
          v-model="endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期" style="width:160px;height: 30px;">
        </el-date-picker>
        <el-input v-model="filters.uuid" style="width:275px;height: 30px;margin-left: 20px;" placeholder="请输入ID/账号">
        </el-input>
        <el-button type="danger"
                   style="background: #5357E2;height: 30px;line-height: 30px;border: none;padding: 0 20px;margin-left: 18px;"
                   @click="handleSearch" :disabled="timeDiff">搜索
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
          prop="uuid"
          label="ID"
          width="130"
          align="center"
          fit=true>
        </el-table-column>
        <el-table-column
          prop="username"
          label="账号"
          align="center"
          fit=true>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="姓名"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="addtime"
          label="时间"
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
        @current-change="getFriendsSettingPage"
        layout="prev, pager, next, jumper"
        :total="paginationNews.total"
        :page-size="paginationNews.pageSize"
        :current-page.sync="paginationNews.pageNum"
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
        paginationNews: {
          pageNum: 1,
          total: 2,
          pageSize: 10
        },
        filters: {
          uuid: ''
        },
        startDate: '',
        endDate: ''
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
        this.startDate = '';
        this.endDate = '';
        this.filters.uuid = '';
        this.getFriendsList();
      },
      getFriendsSettingPage(){
        this.getFriendsList();
      },
      getFriendsList(){
        try {
          let url = baseUrl + "friends/datalist";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
            data: {
              search: this.filters.uuid,
              begintime: this.startDate,
              endtime: this.endDate,
              page: this.paginationNews.pageNum,       //当前分页，默认为1
              pagesize: this.paginationNews.pageSize,    //每页记录数，默认为10
            }
          };
          this.$axios(config).then(res => {
            if (res.data) {
              let list = res.data.data;
              this.paginationNews.total = list.total;
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
    computed: {
      timeDiff: function () {
        if (this.filters.uuid != '') {
          return false;
        }
        if (this.startDate == "" || this.endDate == "")
          return true;
        else {
          var e = new Date(this.endDate);
          var s = new Date(this.startDate);
          var result = e - s;
          if (result >= 0)
            return false;
          else
            return true
        }
      }
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  @import "../../../styles/mixin";

  .center-title {

  }
</style>
<style>
  .invite-page-wrap .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgba(11, 12, 34, 1);
  }
</style>
