<template>
  <div style="background:#fff;">
    <div class="top">
      <img style="width: 100%;height: 100%" src="./../../assets/W1.jpg" alt="">
    </div>
    <div class="top1">
      <img style="width: 100%;height: 100%" src="./../../assets/w02.jpg" alt="">
    </div>
    <div class="top2">
      <img style="width: 100%;" src="./../../assets/w03.jpg" alt="">
    </div>
    <div class="top3">
      <img style="width: 100%;height: 100%" src="./../../assets/w04.jpg" alt="">
    </div>
    <div class="top4">
      <img style="width: 100%;height: 100%" src="./../../assets/bgbg2.jpg" alt="">
    </div>
  </div>
</template>
<script type="text/babel">
  export default {
    data(){
      return {}

    },
    mounted(){

    },
    methods: {},
    components: {}
  }

</script>

<style lang="scss" scoped>
  /* @import "./../../styles/mixin";
  .test{
    @include center();
  } */
  .top1 {
    height: 680px;
  }

  .top2 {
    height: 410px;
  }

  .top3 {
    height: 480px;
  }

  .top4 {
    height: 917px;
  }

  div.top {
    position: relative;
    height: 480px;
    img {
      position: absolute;
      top: 0;
      left: 0;
    }
    div.container {
      background: transparent;
      p:first-child {
        font-weight: bold;
        margin-top: 202px;
        font-size: 38px;
        font-family: MicrosoftYaHei-Bold;
        color: rgba(255, 255, 255, 1);
        line-height: 40px;
      }
      p:last-child {
        margin-top: 31px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(102, 102, 102, 1);
        line-height: 28px;
      }
    }
  }

  div.middle {
    margin-bottom: 80px;
    & > div:first-child {
      margin-top: 79px;
      p {
        text-align: center;
        font-weight: bold;
        font-size: 36px;
        font-family: MicrosoftYaHei-Bold;
        color: rgba(51, 51, 51, 1);
        line-height: 60px;
      }
      div {
        margin-top: 31px;
        padding: 0 165px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(102, 102, 102, 1);
        line-height: 28px;
      }
    }
    & > div:last-child {
      margin-top: 54px;
      display: flex;
      height: 242px;
      & > div:first-child {
        width: 778px;
        background: rgba(247, 247, 247, 1);
        padding: 28px 36px;
        margin-left: 19px;
        p {
          text-align: center;
          font-weight: bold;
          font-size: 28px;
          font-family: MicrosoftYaHei-Bold;
          color: rgba(51, 51, 51, 1);
          line-height: 60px;
        }
        div {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: rgba(102, 102, 102, 1);
          line-height: 28px;
        }
      }
      & > div:last-child {
        margin-left: 22px;
        font-size: 24px;
        font-family: MicrosoftYaHei;
        color: rgba(255, 255, 255, 1);
        line-height: 24px;
        display: flex;
        flex-wrap: wrap;
        /*
         div:nth-child(3){
           width:208px;
           height:110px;
           background:url('./../../assets/AB-Russia.png');
           span{
             display:block;
             margin-top:43px;
             margin-left:67px;
           }
         }
         div:nth-child(4){
           width:208px;
           height:110px;
           background:url('./../../assets/AB-NKO.png');
           span{
             display:block;
             margin-top:44px;
             margin-left:80px;
           }
         }
         div:nth-child(5){
           width:208px;
           height:110px;
           background:url('./../../assets/AB-Japan.png');
           span{
             display:block;
             margin-top:44px;
             margin-left:82px;
           }
         } */
      }
    }
  }

  .country {
    & > div:first-child {
      .singapore {
        float: left;
        margin-right: 22px;
        width: 323px;
        height: 110px;
        background: url('./../../assets/AB-Singapore.png');
        span {
          display: block;
          margin-top: 44px;
          margin-left: 124px;
        }
      }
      .usa {
        float: left;
        width: 322px;
        height: 110px;
        background: url('./../../assets/AB-USA.png');
        span {
          display: block;
          margin-top: 43px;
          margin-left: 136px;
        }
      }
    }
    & > div:last-child {
      display: flex;
      margin-top: 22px;
      .russia {
        width: 208px;
        height: 110px;
        background: url('./../../assets/AB-Russia.png');
        margin-right: 22px;
        span {
          display: block;
          margin-top: 43px;
          margin-left: 67px;
        }
      }
      .nko {
        width: 208px;
        height: 110px;
        background: url('./../../assets/AB-NKO.png');
        margin-right: 22px;
        span {
          display: block;
          margin-top: 44px;
          margin-left: 80px;
        }
      }
      .japan {
        width: 208px;
        height: 110px;
        background: url('./../../assets/AB-Japan.png');
        span {
          display: block;
          margin-top: 44px;
          margin-left: 82px;
        }
      }
    }
  }

  div.bottom {
    width: 1365px;
    margin: 0 auto;
    & > p {
      text-align: center;
      font-size: 36px;
      font-weight: bold;
      font-family: MicrosoftYaHei-Bold;
      color: rgba(51, 51, 51, 1);
      line-height: 60px;
    }
    & > div:nth-child(2) {
      margin-top: 32px;
      padding: 0 167px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: rgba(102, 102, 102, 1);
      line-height: 28px;
    }
    & > div:last-child {
      margin-top: 51px;
      img {
        width: 100%;
      }
    }
  }
</style>
