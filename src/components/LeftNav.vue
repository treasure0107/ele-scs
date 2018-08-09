<template>
  <div class="left-nav">
    <div class="msg-box clearFix" v-if="userInfo!=null">
      <img :src="userHead" alt="" class="head"/>
      <div class="user-msg">
        <span class="tel" v-text="userInfo.username" :title="userInfo.username"></span>
        <span class="id">ID&nbsp;{{userInfo.uuid}}</span>
      </div>
    </div>
    <ul class="nav-item">
      <li :class="[{active:1==tabIndex}]" @click="tabs(1)">
        <router-link to="/Account">账户总览</router-link>
      </li>
      <li :class="[{active:2==tabIndex}]" @click="tabs(2)">
        <router-link to="/CollectSet">收款设置</router-link>
      </li>
      <li :class="[{active:3==tabIndex}]" @click="tabs(3)">
        <router-link to="/Order">订单列表</router-link>
      </li>
      <!--<li>
        <router-link to="/AppeaLine">发起申诉</router-link>
      </li> -->
      <li :class="[{active:4==tabIndex}]" @click="tabs(4)">
        <router-link to="/RecordList">委托记录</router-link>
      </li>
      <li :class="[{active:5==tabIndex}]" @click="tabs(5)">
        <router-link to="/InviteFriends">邀请好友</router-link>
      </li>
      <li :class="[{active:6==tabIndex}]" @click="tabs(6)">
        <!--   <router-link to="/GetDepositList">提现记录</router-link>-->
        <router-link to="/GetMoney">提现记录</router-link>
      </li>
      <li :class="[{active:7==tabIndex}]" @click="tabs(7)">
        <router-link to="/AccountSet">账户设置</router-link>
      </li>
    </ul>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import {imgBaseUrl} from "@/config/env";
  export default {
    data(){
      return {
        userInfo: null,
        imgBaseUrl: "",
        tabIndex: localStorage.getItem("navTabIndex") || 1
      }
    },
    computed: {
      userHead(){
        return  this.$store.state.getUserHead;
      }
    },
    mounted(){
      if (imgBaseUrl) {
        this.imgBaseUrl = imgBaseUrl;
      }
      if (window.localStorage.getItem("UserInfo")) {
        let userNews = JSON.parse(window.localStorage.getItem("UserInfo"));
        this.userInfo = userNews.userinfo;
        /*  this.$store.commit("getUserHead", this.imgBaseUrl + userNews.userinfo.avatar);*/
        if (this.isEmail(this.userInfo.username)) {
          this.userInfo.username = this.formatEmail(this.userInfo.username);
        } else {
          this.userInfo.username = this.formatPhone(this.userInfo.username);
        }
      }

      var orignalSetItem = localStorage.setItem;
      localStorage.setItem = function (key, newValue) {
        var setItemEvent = new Event("setItemEvent");
        setItemEvent.newValue = newValue;
        setItemEvent.key = key;
        window.dispatchEvent(setItemEvent);
        orignalSetItem.apply(this, arguments);
      }
      window.addEventListener("setItemEvent", (obj) => {
        if (obj.key == "UserInfo") { //判断是否UserInfo
          this.userInfo.avatar = JSON.parse(obj.newValue).userinfo.avatar;
        }
        if (obj.key == "navTabIndex") {//判断是否navTabIndex
          this.tabIndex = JSON.parse(obj.newValue);
        }
      });
    },
    methods: {
      tabs(_index){
        this.tabIndex = _index;
        if (window.localStorage) {
          localStorage.setItem("navTabIndex", _index);
        }
      },
      formatPhone(phone) {
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      },
      formatEmail(email) {
        return email.replace(/(.{2}).+(.{2}@.+)/g, "$1****$2");
      },
      isEmail(str){
        var re = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        if (re.test(str) != true) {
          return false;
        } else {
          return true;
        }
      }
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  @import "./../styles/mixin";

  .left-nav {
    background-color: #f2f6fe;
    width: 220px;
    height: 100%;
    .msg-box {
      padding: 25px 0;
      width: 155px;
      margin: 0 auto;
      img.head, .user-msg {
        float: left;
      }
      img.head {
        border-radius: 50%;
        width: 42px;
        height: 42px;
      }
      .user-msg {
        width: 90px;
        padding-left: 6px;
        span {
          display: inline-block;
          text-align: left;
          height: 22px;
          line-height: 22px;

        }
        span.tel {
          @include sc(14px, #333333);
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        span.id {
          @include sc(12px, #333333);
        }
      }
    }
    ul.nav-item {
      li {
        height: 55px;
        line-height: 55px;
        text-align: center;
        @include sc(16px, #333333);
        a {
          display: block;
          width: 100%;
        }
      }
      li.active {
        background-color: #ffffff;
        border-left: 4px solid #5357e2;
        display: block;
        height: 55px;
        line-height: 55px;
        color: #5357e2;
      }
    }
  }
</style>
