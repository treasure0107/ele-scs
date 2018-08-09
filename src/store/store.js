/**
 * Created by 520 on 2018/7/10.
 */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export  default  new Vuex.Store({
  state: {
    getUserHead: "",
    lang: window.localStorage.getItem("lang") || "cn"
  },
  mutations: {
    getUserHead(state, info){
      state.getUserHead = info;
    },
    setLang(state, info){
      state.lang = info;
      console.log('state.userInfo');
      console.log(state.lang);
    }
  }
});
