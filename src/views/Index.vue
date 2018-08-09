<template>
  <div class="main">
    <index-banner></index-banner>
    <!--柱状图-->
    <index-bargraph></index-bargraph>
    <!--新闻中心-->
    <div class="news-main-wrap">
      <div class="news-main">
        <h1 class="rows-title">新闻中心</h1>
        <ul class="">
          <li v-for='(item,index) in NewList' :key='index'>
            <img :src="item.image" alt=""/>
            <dl>
              <dt>{{item.name}}</dt>
              <dd v-for='(subItem,index) in item.list' :key='index'>
                <router-link :to="'/NewsDetails/?id='+subItem.id " v-html="subItem.title"></router-link>
              </dd>
            </dl>
          </li>
          <!-- <li>
            <img src="../assets/3.jpg" alt="">
            <dl>
              <dt>区块链</dt>
              <dd>
                行业未来监管会更严格！谁都不和....
                开创多个第一！区块链端游《王者....
                万事达卡正在研究使用区块链
                比较 | 区块链的四大优势与传统金....
              </dd>
            </dl>
          </li>
          <li>
            <img src="../assets/2.jpg" alt="">
            <dl>
              <dt>区块链</dt>
              <dd>
                行业未来监管会更严格！谁都不和....
                开创多个第一！区块链端游《王者....
                万事达卡正在研究使用区块链
                比较 | 区块链的四大优势与传统金....
              </dd>
            </dl>
          </li>
          <li>
            <img src="../assets/4.jpg" alt="">
            <dl>
              <dt>区块链</dt>
              <dd>
                行业未来监管会更严格！谁都不和....
                开创多个第一！区块链端游《王者....
                万事达卡正在研究使用区块链
                比较 | 区块链的四大优势与传统金....
              </dd>
            </dl>
          </li> -->
        </ul>
      </div>
    </div>


    <!--遍布世界的服务中心-->
    <div class="service-center-main">
      <div class="service-main">
        <h1 class="rows-title">遍布世界的服务中心</h1>
        <img src="./../assets/map2.png" alt="" class="map"/>
      </div>
    </div>

    <!--合作伙伴-->
    <div class="partner-main-wrap">
      <div class="partner-main">
        <h1 class="rows-title">合作伙伴</h1>
        <ul class="map clearFix">
          <li>
            <a href="javascript:void (0)"><img src="./../assets/partner-xsn-a.png" alt=""/></a>
          </li>
          <li>
            <a href="javascript:void (0)"><img src="./../assets/partner-xsn-b.png" alt=""/></a>
          </li>
          <li>
            <a href="javascript:void (0)"><img src="./../assets/partner-xsn-c.png" alt=""/></a>
          </li>
          <li>
            <a href="javascript:void (0)"><img src="./../assets/partner-xsn-d.png" alt=""/></a>
          </li>
          <li>
            <a href="javascript:void (0)"><img src="./../assets/partner-xsn-e.png" alt=""/></a>
          </li>
        </ul>
      </div>
    </div>

    <!--二维码下载-->
    <div class="qr-main-wrap">
      <div class="qr-content">
        <img src="./../assets/weChatPic.jpg" class="weChatPicCode">
        <a href="https://download.fir.im/apps/5b5b3e50ca87a81ba5df26f8/install?download_token=fdd632d0f521a7aeb290ff9e22256236&release_id=5b5b3e55959d6938b8921fa4" class="Android"><img src="./../assets/android-icon.png" class="icon-pic">Android客户端下载</a>
        <a class="ios" style="cursor: default"><img src="./../assets/IOS-icon.png" class="icon-pic">IOS客户端即将上线...</a>
      </div>
      <!--<div class="qr-main">-->
      <!--<h1 class="rows-title">移动客户端下载</h1>-->
      <!--<p class="p1">已全面覆盖ios、Android，支持全业务功能</p>-->
      <!--</div>-->
      <!--<div class="qr-content">-->
      <!--<img src="./../assets/Android.png" alt="" class="Android"/>-->
      <!--<img src="./../assets/ios.png" alt="" class="ios"/>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";

  import IndexBanner from "@/components/IndexBanner";
  import IndexBargraph from "@/components/IndexBargraph";
  import IndexContainer from "@/components/Container";
  export default {
    data(){
      return {
        NewList: []
      }

    },
    mounted(){
      this.getNewList();
    },
    methods: {
      getNewList(){
        try {
          let url = baseUrl + 'index/getIndexNewList';
          let config = {
            method: "POST",
            url: url,
            data: {r: Math.random()}
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              this.NewList = result.data.data
            }
          })
        } catch (ex) {
          until.consoleLog(ex)
        }
      }
    },
    components: {
      IndexBanner,
      IndexContainer,
      IndexBargraph
    }
  }

</script>

<style lang="scss" scoped>
  @import "./../styles/mixin";

  .news-main-wrap {
    background-color: #fafbfb;
    padding: 65px 0;
    .news-main {
      @include marginAuto();
      ul {
        padding-top: 50px;
        @include flexAuto();
        width: 100%;
        li {
          display: inline-block;
          background-color: #ffffff;
          width: 272px;
          padding-bottom: 22px;
          border: solid 1px #ffffff;
          img {
            max-width: 100%;
            height: 180px;
          }
          dl {
            padding: 0 18px;
            dt {
              padding: 18px 0;
              @include sc(16px, #333333);
              font-weight: 600;
            }
            dd {
              text-align: left;
              line-height: 35px;
              @include sc(14px, #333333);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

            }
          }
        }
      }
    }
  }

  .qr-content {
    position: relative;
    margin: 0 auto;
    width: 1200px;
  }

  .partner-main-wrap {
    background: #fff;
    padding: 0px 0;
    /* background: url("./../assets/partnerbg.png") center top repeat;*/
    .partner-main {
      @include marginAuto();
      ul.map {
        padding: 70px 0;
        @include flexAuto();
        /* margin-left: -20px; */
        li {
          display: inline-block;
          /* margin-bottom: 20px;*/
          /*width: 240px;*/
          /*height: 68px;*/
          margin-left: 20px;
          a {
            cursor: default;
            img {
              /*width: 100%;*/
              width: 142px;
              height: 68px;
              max-height: 60px;
            }
          }
        }
      }
    }
  }

  .service-center-main {
    background: #fff;
    padding: 60px 0;
    .service-main {
      @include marginAuto();
      img.map {
        padding-top: 50px;
        width: 100%
      }
    }
  }

  .qr-main-wrap {
    position: relative;
    font-size: 16px;
    img {
      /*cursor: pointer;*/
      /*top: 420px;*/
      z-index: 9999;
    }
    .weChatPicCode {
      position: absolute;
      top: 240px;
      right: 369px;
      max-width: 115px;
    }
    .icon-pic {
      position: relative;
      top: 3px;
      margin-left: 10px;
      margin-right: 6px;
    }
    .Android {
      width: 204px;
      height: 42px;
      line-height: 42px;
      color: #333;
      background: #d6d6d6;
      border-radius: 4px;
      position: absolute;
      top: 246px;
      right: 142px;
    }
    .ios {
      width: 204px;
      height: 42px;
      line-height: 42px;
      color: #333;
      background: #d6d6d6;
      border-radius: 4px;
      position: absolute;
      top: 303px;
      right: 142px;
    }
    background: #07060c url("./../assets/saoma-b.jpg") center top no-repeat;
    height: 800px;
    //background-color: #f5f5fb;
    padding-top: 104px;
    .qr-main {
      @include marginAuto();
      p.p1 {
        text-align: center;
        padding: 36px 0 111px 0;
        @include sc(30px, #666666);
      }
    }
  }

  .rows-title {
    text-align: center;
    /*  padding: 50px 0;*/
    @include sc(36px, #333333);
  }
</style>
