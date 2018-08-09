// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "@/styles/reset.css";
import "@/styles/public.css";
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import store from '@/store/store.js';
/*import cookie from  "js-cookie";
 Vue.prototype.$_cookie = cookie;*/
/* let UserInfo = until.getUserInfo();
 if (UserInfo) {
 Vue.prototype.$userInfo = UserInfo;
 //axios.defaults.headers.common['Authorization'] = "bearer " + UserInfo["Token"];
 } */
Vue.use(VueI18n);
/*Vue.use(ElementUI,{
 i18n: (key, value) => i18n.t(key, value)
 });*/
axios.interceptors.request.use(config => {
    if (window.localStorage.UserInfo) {
      let UserInfo = JSON.parse(window.localStorage.UserInfo);
      if (UserInfo) {
        Vue.prototype.$userInfo = UserInfo;
        config.headers["Token"] = UserInfo.userinfo.token;
      } else {
        config.headers["Token"] = "";
      }
    }
    return config;
  },
  err => {
    console.error(err);
  }
);

let errFunc = function (error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        //router.replace({
        //		path: 'login',
        //		query: {redirect: }
        //})
        break;
    }
  }
  return error.response.data
}
axios.interceptors.response.use(function (response) {
  return response
}, errFunc);
/*console.log(store);
 console.log("dasdasdasd")
 console.log(store.state.lang);*/
//let lang = store.state.lang || 'cn';
let lang = window.localStorage.getItem("lang") || "cn";
//console.log(lang);
/* if (window.localStorage) {
 let userInfo = JSON.parse(window.localStorage.getItem("UserInfo"));
 if (userInfo&&userInfo.token) {
 axios.defaults.headers.common['Authorization'] = userInfo.userinfo.token;
 }
 } */
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
/* eslint-disable no-news */
Vue.directive('dbClick', {
  inserted(el, binding) {
    el.addEventListener('click', e => {
      if (!el.disabled) {
        el.disabled = true;
        let timer = setTimeout(() => {
          el.disabled = false;
        }, 3000)
      }
    })
  }
});
const i18n = new VueI18n({
  locale: lang
});
new Vue({
  el: '#app',
  computed: {
    langState(){
      return store.state.lang;
    }
  },
  watch: {
    langState(value)
    {
      /*      console.log("watch")
       console.log(value)*/
      i18n.locale = value;
    }
  },
/*  mounted(){
    i18n.locale = lang;
  },*/
  store,
  i18n,
  router,
  mounted () {
    this.$nextTick(() => {
      window.setTimeout(() => {
        var _53code = document.createElement("script");
        _53code.src = "https://tb.53kf.com/code/code/10181543/1";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(_53code, s);
      }, 3000);
    });
  },
  components: {App},
  template: '<App/>'
});
