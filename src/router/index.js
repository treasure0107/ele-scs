import Vue from 'vue';
import Router from 'vue-router';
import index from '@/views/Index';
import login from '@/views/Login/Login';
import register from '@/views/Login/Register';
import TelFind from '@/views/Login/TelFind';
import EmailFind from '@/views/Login/EmailFind';
import Account from '@/views/UserCenter/Index';
import AccountList from '@/views/UserCenter/AccountSet/AccountList';
import CollectSet from '@/views/UserCenter/CollectSet/CollectSet';
import OrderList from '@/views/UserCenter/Order/OrderList';
import OrderDetails from '@/views/UserCenter/Order/OrderDetails';
import AppeaLine from '@/views/UserCenter/AppeaLine/AppeaLine';
import RecordList from '@/views/UserCenter/Record/RecordList';
import RecordDetial from '@/views/UserCenter/Record/RecordDetial';
import InviteFriends from '@/views/UserCenter/InviteFriends/InviteFriends';
import InviteFriendsList from '@/views/UserCenter/InviteFriends/InviteFriendsList';
import InviteList from '@/views/UserCenter/InviteFriends/InviteList';
import AccountSet from '@/views/UserCenter/AccountSet/AccountSet';
import BankSet from '@/views/UserCenter/CollectSet/BankSet';
import UsdtSet from '@/views/UserCenter/CollectSet/UsdtSet';
import AlipaySet from '@/views/UserCenter/CollectSet/AlipaySet';
import WeixinSet from '@/views/UserCenter/CollectSet/WeixinSet';
import TicketRecord from '@/views/UserCenter/TurnTicket/TicketRecord';//交易记录>>>转票记录列表
import TurnTicket from '@/views/UserCenter/TurnTicket/TurnTicket';// 在线转票
import C2C from '@/views/C2C/Index';// c2c
import lineUp from '@/views/C2C/lineUp';// c2c 参与
import HelpIndex from '@/views/Help/Index';
import HelpList from '@/views/Help/HelpList';
import Video from '@/views/Help/Video';
import NewsList from '@/views/InfoShow/NewsList';//新闻列表
import AboutUs from '@/views/InfoShow/AboutUs';//新闻列表
import NewsDetails from '@/views/InfoShow/NewsDetails';//新闻详情
import NoticeList from '@/views/InfoShow/NoticeList';//公告
import NoticeDetails from '@/views/InfoShow/NoticeDetails';//公告详情
import ContactUs from '@/views/InfoShow/ContactUs';//联系我们
import getDepositList from '@/views/UserCenter/InviteFriends/getDepositList';//提现列表
/*二期*/
import Order from '@/views/UserCenter/Order/Order';
import appeal from '@/views/UserCenter/Order/appeal/appeal';  //申诉中
import hadCancel from '@/views/UserCenter/Order/hadCancel/hadCancel';//已取消
import hadDone from '@/views/UserCenter/Order/hadDone/hadDone'; //已完成
import havePay from '@/views/UserCenter/Order/havePay/havePay'; //已支付
import unPay from '@/views/UserCenter/Order/unPay/unPay'; //未支付
import appealDetails from '@/views/UserCenter/Order/appeal/Details'; //申诉中详情
import UploadProof from '@/views/UserCenter/Order/appeal/UploadProof'; //上传凭证
import hadCancelDetails from '@/views/UserCenter/Order/hadCancel/Details'; //已取消详情
import hadDoneDetails from '@/views/UserCenter/Order/hadDone/Details'; //已完成详情
import havePayDetails from '@/views/UserCenter/Order/havePay/Details'; //已支付详情
import unPayDetails from '@/views/UserCenter/Order/unPay/Details'; //未支付详情
/*邀请好友>提现记录*/
import GetMoney from '@/views/UserCenter/GetMoney/GetMoney'; //提现记录
import GetMoneyUnPayDetails from '@/views/UserCenter/GetMoney/unPay/Details';   //提现未支付
import GetMoneyhavePayDetails from '@/views/UserCenter/GetMoney/havePay/Details';   //提现已支付
import GetMoneyAppealDetails from '@/views/UserCenter/GetMoney/appeal/Details';   //提现申诉详情
import GetMoneyHadDoneDetails from '@/views/UserCenter/GetMoney/hadDone/Details';   //提现已完成详情
import GetMoneyHadCancelDetails from '@/views/UserCenter/GetMoney/hadCancel/Details';   //提现未完成详情
import DirectdriveDetail from '@/views/UserCenter/InviteFriends/DirectdriveDetail';   //直推明细
import BazaarDetail from '@/views/UserCenter/InviteFriends/BazaarDetail';   //市场津贴明细
import TeamDetail from '@/views/UserCenter/InviteFriends/TeamDetail';   //团队奖明细
Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/NewsList',
      name: 'NewsList',
      component: NewsList
    },
    {
      path: '/TelFind',
      name: 'TelFind',
      component: TelFind
    },
    {
      path: '/EmailFind',
      name: 'EmailFind',
      component: EmailFind
    },
    {
      path: '/unPayDetails',
      name: 'unPayDetails',
      component: unPayDetails
    },
    {
      path: '/havePayDetails',
      name: 'havePayDetails',
      component: havePayDetails
    },
    {
      path: '/appealDetails',
      name: 'appealDetails',
      component: appealDetails
    },
    {
      path: '/hadDoneDetails',
      name: 'hadDoneDetails',
      component: hadDoneDetails
    },
    {
      path: '/hadCancelDetails',
      name: 'hadCancelDetails',
      component: hadCancelDetails
    },
    {
      path: '/GetMoneyAppealDetails',
      name: 'GetMoneyAppealDetails',
      component: GetMoneyAppealDetails
    },
    {
      path: '/GetMoneyHadDoneDetails',
      name: 'GetMoneyHadDoneDetails',
      component: GetMoneyHadDoneDetails
    },
    {
      path: '/GetMoneyHadCancelDetails',
      name: 'GetMoneyHadCancelDetails',
      component: GetMoneyHadCancelDetails
    },
    {
      path: '/GetMoneyUnPayDetails',
      name: 'GetMoneyUnPayDetails',
      component: GetMoneyUnPayDetails
    },
    {
      path: '/GetMoneyhavePayDetails',
      name: 'GetMoneyhavePayDetails',
      component: GetMoneyhavePayDetails
    },
    {
      path: '/Account',
      component: Account,
      children: [
        {
          path: "/",
          name: "AccountList",
          component: AccountList,
        },
        {
          path: '/CollectSet',
          name: 'CollectSet',
          component: CollectSet
        },
        {
          path: '/OrderList',
          name: 'OrderList',
          component: OrderList
        },
        {
          path: '/AppeaLine',
          name: 'AppeaLine',
          component: AppeaLine
        },
        {
          path: '/RecordList',
          name: 'RecordList',
          component: RecordList,
        },
        {
          path: '/RecordDetial',
          name: 'RecordDetial',
          component: RecordDetial
        },
        {
          path: '/RecordDetial/:id/:type',
          name: 'RecordDetialIdType',
          component: RecordDetial
        },
        {
          path: '/InviteFriends',
          name: 'InviteFriends',
          component: InviteFriends
        },
        {
          path: '/InviteFriendsList',
          name: 'InviteFriendsList',
          component: InviteFriendsList
        },
        {
          path: '/InviteList',
          name: 'InviteList',
          component: InviteList
        },
        {
          path: '/AccountSet',
          name: 'AccountSet',
          component: AccountSet
        },
        {
          path: '/AccountSet/:type',
          name: 'AccountSetType',
          component: AccountSet
        },
        {
          path: '/TicketRecord',
          name: 'TicketRecord',
          component: TicketRecord
        },
        {
          path: '/TurnTicket',
          name: 'TurnTicket',
          component: TurnTicket
        },
        {
          path: '/BankSet',
          name: 'BankSet',
          component: BankSet
        },
        {
          path: '/UsdtSet',
          name: 'UsdtSet',
          component: UsdtSet
        },
        {
          path: '/WeixinSet',
          name: 'WeixinSet',
          component: WeixinSet
        },
        {
          path: '/AlipaySet',
          name: 'AlipaySet',
          component: AlipaySet
        },
        /*提现记录*/
        {
          path: "/getDepositList",
          name: "getDepositList",
          component: getDepositList,
        },
        /*二期*/
        {
          path: '/Order',
          name: 'Order',
          component: Order
        },
        //申诉中
        {
          path: '/appeal',
          name: 'appeal',
          component: appeal
        },

        //已取消
        {
          path: '/hadCancel',
          name: 'hadCancel',
          component: hadCancel
        },
        //已完成
        {
          path: '/hadDone',
          name: 'hadDone',
          component: hadDone
        },
        //已支付
        {
          path: '/havePay',
          name: 'havePay',
          component: havePay
        },

        //未完成
        {
          path: '/unPay',
          name: 'unPay',
          component: unPay
        },
        // {
        //   path: '/unPayDetails',
        //   name: 'unPayDetails',
        //   component: unPayDetails
        // },
        {
          path: '/UploadProof',
          name: 'UploadProof',
          component: UploadProof
        },
        //提现记录
        {
          path: '/GetMoney',
          name: 'GetMoney',
          component: GetMoney
        },
        /*市场津贴明细*/
        {
          path: "/BazaarDetail",
          name: "BazaarDetail",
          component: BazaarDetail,
        },
        /*直推明细*/
        {
          path: "/DirectdriveDetail",
          name: "DirectdriveDetail",
          component: DirectdriveDetail,
        },
        /*团队奖明细*/
        {
          path: "/TeamDetail",
          name: "TeamDetail",
          component: TeamDetail,
        }
      ]
    },
    {
      path: '/OrderDetails',
      name: 'OrderDetails',
      component: OrderDetails
    },
    {
      path: '/C2C',
      name: 'C2C',
      component: C2C
    },
    {
      path: '/lineUp',
      name: 'lineUp',
      component: lineUp
    },
    {
      path: '/HelpIndex',
      name: 'HelpIndex',
      component: HelpIndex
    },
    {
      path: '/Video',
      name: 'Video',
      component: Video
    },
    {
      path: '/HelpList',
      name: 'HelpList',
      component: HelpList
    },
    {
      path: '/AboutUs',
      name: 'AboutUs',
      component: AboutUs
    },
    {
      path: '/NewsDetails',
      name: 'NewsDetails',
      component: NewsDetails
    },
    {
      path: '/NoticeList',
      name: 'NoticeList',
      component: NoticeList
    },
    {
      path: '/NoticeDetails',
      name: 'NoticeDetails',
      component: NoticeDetails
    },
    {
      path: '/ContactUs',
      name: 'ContactUs',
      component: ContactUs
    },
    {
      path: '*',
      name: '404',
      component: index
    },
  ],

  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})
