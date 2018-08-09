<template>
  <div class="wrap">
    <div class="wrapTop">
      <img class="img1" src="./../../assets/videoBg.png" alt="">
      <div>
        <img class="img2" src="./../../assets/logg.png" alt="">
        <h4>GFC创新交易平台基本操作流程视频教程</h4>
      </div>
    </div>
    <div class="f3-video">
      <video preload id="video1" controls>
        <source src="https://gfcoffice.oss-cn-shenzhen.aliyuncs.com/GFCcommon.mp4" type="video/mp4" poster="img/封面.jpg">
        <source src="https://gfcoffice.oss-cn-shenzhen.aliyuncs.com/GFCcommon.Ogg" type="video/ogg" poster="img/封面.jpg">
      </video>
    </div>
    <!--<div id="go">-->
      <!--<img id="imgg" @click="play()" src="./../../assets/gogogo3.png" alt="">-->
      <!--<img id="stop" @click="stop()" src="./../../assets/stop.png" alt="">-->
    <!--</div>-->
  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";

  export default {
    data(){
      return {
        flag: false,
        kg: true,
        st: true,
      }

    },
    mounted(){
      /*var self = this;
      function $(id){
        return document.getElementById(id);
      }
      $("go").onmouseover=function(){
        if (self.flag) {
          $("stop").style.display="block";
        }
      }
      $("go").onmouseout=function(){
        if (self.flag) {
          $("stop").style.display="none";
        }
      }*/
    },
    methods: {
//      $(id){
//        return document.getElementById(id);
//      },
//      play() {
//        this.flag = true;
//        this.$('stop').style.display="block";
//        this.$('imgg').style.display="none";
//        this.$('video1').play();
//      },
//      stop() {
//        this.flag = false;
//        this.$('imgg').style.display="block";
//        this.$('stop').style.display="none";
//        this.$('video1').pause();
//      }
    },
    components: {

    }
  }

</script>

<style lang="scss" scoped>
  .wrap {
    height: 763px;
  }
  .wrapTop {
    height: 300px;
    position: relative;
    background: #9ea2ae;
  }
  .wrapTop img.img1 {
    width:100%;
    position: absolute;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    left: 50%;
    top: 0;
  }
  .img2 {float: left}
  h4 {
    font-size: 32px;
    font-family: "Microsoft YaHei";
    color: #fff;
    float: left;
    margin-left: 36px;
  }
  .f3-video, #go {
    position: absolute;
    top:174px;
    left: 0;
    margin: 0 auto;
    right: 0;
    width:1175px;
    height:594px;
  }
  #imgg, #stop {
    position: absolute;
    margin: 23% auto;
    left: 0;
    right: 0;
  }
  #stop {
    display: none;
  }
  #imggg, #stop2 {
    position: absolute;
    margin: 20% auto;
    display: none;
    left: 0;
    right: 0;
  }
  #video1 {
    width:1175px;
    height:594px;
  }
  .wrapTop div {
    position: absolute;
    left: 0%;
    right: 0;
    margin: 36px auto;
    width: 660px;
  }
</style>
