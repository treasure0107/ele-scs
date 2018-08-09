<template>
  <div class="image-cut-main">
    <h1 class="img-title">设置头像 <i class="close-btn" @click="closeControls"></i></h1>
    <div class="upload-picture">
      用户上传头像：<a class="upload-btn" for="uploads">请选择图片</a>
      <input type="file" class="input-file" accept="image/png, image/jpeg, image/gif, image/jpg"
             @change="changePicture($event)"/>
    </div>
    <div class="img-container clearFix">
      <div class="img-left-view">
        <vueCropper ref="cropper"
                    :canMove="option.canMove"
                    :img="option.img"
                    :canScale="option.canScale"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :fixed="option.fixed"
                    :outputSize="option.size"
                    :outputType="option.outputType"></vueCropper>
        <!--  <img src="../assets/timg.jpg"/>-->
        <div class="img-small-btn">
          <a @click.stop="changeScale(1);">放大</a>
          <a @click.stop="changeScale(-1);">缩小</a>
          <a @click.stop="rotateLeft">向左旋转</a>
          <a @click.stop="rotateRight">向右旋转</a>
          <a @click.stop="startCrop">裁剪</a>
        </div>
      </div>
      <div class="img-right-view">
        <div class="img-item-wrap">
          <div class="font">预览</div>
          <div class="img-item img-item-80">
            <div class="width-80">
              <img :src="option.img" alt="">
            </div>
            <div class="font">80*80</div>
          </div>
          <div class="img-item img-item-60">
            <div class="width-60">
              <img :src="option.img" alt="" class="width-60">
            </div>
            <div class="font">60*60</div>
          </div>
          <div class="img-item img-item-40">
            <div class="width-40">
              <img :src="option.img" alt="" class="width-40">
            </div>
            <div class="font">40*40</div>
          </div>
        </div>
        <div class="btn-rows">
          <a v-dbClick class="save-btn" @click.stop="saveData">确定</a>
        </div>
      </div>
    </div>
    <!--<div class="img-cut-footer">
          <a href="#" class="cancel-btn">取消</a>
          <a href="#" class="save-btn">确定</a>
        </div>-->
  </div>
  <!-- <a href="#" @click="uploadPicture">上传图片</a>-->
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import VueCropper from "vue-cropper";
  import {imgBaseUrl} from "@/config/env";
  export default {
    props: ["photos"],
    data(){
      return {
        option: {
          img: this.photos || "",
          size: 200,
          outputSize: 200,
          canMove: true,
          canScale: true,
          fixed: true,
          autoCrop: true,
          autoCropWidth: 280,
          autoCropHeight: 280,
          outputType: "jpeg"
        },
        boxShow: false
      }
    },
    watch: {
      photos: {
        handler(data)
        {
          this.option.img = data;
        },
        deep: true
      }
    },
    created(){

    },
    mounted(){
      /*     if (window.localStorage.getItem("UserInfo")) {
       let userNews = JSON.parse(window.localStorage.getItem("UserInfo"));
       this.option.img = userNews.userinfo.avatar;
       }*/
    },
    methods: {
      rotateLeft(){
        this.$refs.cropper.rotateLeft();
      },
      rotateRight(){
        this.$refs.cropper.rotateRight();
      },
      changeScale(nun){
        this.$refs.cropper.changeScale(nun);
      },
      startCrop(){
        //blob 数据
        this.$refs.cropper.getCropBlob((data) => {
          // do something
          this.uploadPicture(data);
        });
        //base 64
        /*   this.$refs.cropper.getCropData((data) => {
         // do something
         this.option.img = data;
         console.log(data);
         })*/
      },
      formValidate(){
        if (this.option.img.length == 0) {
          this.$message({
            showClose: true,
            duration: 4000,
            message: '上传图片不能为空！',
            type: 'error'
          });
          return false;
        }
        return true;
      },
      saveData(){
        try {
          if (this.formValidate()) {
            let url = baseUrl + "account/account/uploadimg";
            let config = {
              method: "POST",
              url: url + "?r=" + Math.random(),
              data: {
                imageurl: this.option.img,
                width: this.$refs.cropper.trueWidth || "",
                height: this.$refs.cropper.trueHeight || ""
              }
            };
            this.$axios(config).then(res => {
              if (res.data.code) {
                this.$message({
                  type: "success",
                  duration: 1000,
                  message: "保存成功！",
                  onClose: () => {
                     this.$store.commit("getUserHead",imgBaseUrl+res.data.data.url);
                    this.$emit('sendEditAvatar', 'true');
                    this.$emit("closeImageCutControls", {photos: res.data.data.url});
                    this.option.img = "";
                    this.$refs.cropper.refresh();
                  }
                });
              } else {
                this.$message({
                  showClose: true,
                  duration: 3000,
                  message: res.data.msg || '操作失败！',
                  type: 'error'
                });
              }
            });

          }
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      closeControls(){
        this.$emit("closeImageCutControls");
      },
      uploadPicture(file){
        try {
          var formData = new FormData();
          formData.append("file", file);
          let config = {
            url: baseUrl + "Common/upload?type=member&r=" + Math.random(),
            method: "post",
            data: formData
          };
          this.$axios(config).then((result) => {
            let res = until.formatData(result);
            if (until.responesValidate(res)) {
              if (res.data.data.url) {
                this.$refs.cropper.rotate = 0;
                this.option.img = res.data.data.url;
              }
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      changePicture(e){
        let file = e.target.files[0];
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          this.$message({
            type: "error",
            duration: 3000,
            message: "上传的图片类型格式不对！"
          });
          return false;
        }
        this.uploadPicture(file);
        /* let reader = new FileReader();
         reader.onload = (e) => {
         let data;
         if (typeof e.target.result === 'object') {
         // 把Array Buffer转化为blob 如果是base64不需要
         data = window.URL.createObjectURL(new Blob([e.target.result]));
         } else {
         data = e.target.result;
         }
         this.option.img = data;
         }*/
        // 转化为base64
        // reader.readAsDataURL(file)
        // 转化为blob
        // reader.readAsArrayBuffer(file);
        //转换为base64
      }
    },
    components: {
      VueCropper
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../styles/mixin";
  .image-cut-main {
    width: 620px;
    padding: 32px 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 99999;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 5px;
    .img-title {
      @include sc(20px, #333333);
      .close-btn {
        background: url("../assets/close_btn.png") center center no-repeat;
        width: 15px;
        height: 16px;
        padding: 5px;
        float: right;
        cursor: pointer;
      }
    }
    .upload-picture {
      position: relative;
      padding: 22px 0;
      line-height: 18px;
      @include sc(14px, #333);
      .upload-btn, .input-file {
        display: inline-block;
        cursor: pointer;
      }
      .upload-btn {
        position: absolute;
        left: 100px;
        top: 15px;
        background-color: #2e6af4;
        @include sc(14px, #fff);
        padding: 8px 10px;
        border-radius: 4px;
      }
      .input-file {
        opacity: 0;
      }
    }
    .img-container {
      /* padding: 32px 0;*/
      .img-left-view {
        float: left;
        width: 460px;
        /*  height: 324px;*/
        img {
          width: 442px;
          /*  height: 312px;*/
        }
        .img-small-btn {
          margin-top: 39px;
          width: 100%;
          padding: 10px 0;
          text-align: center;
          a {
            display: inline-block;
            margin-left: 10px;
            padding: 7px 20px;
            border-radius: 15px;
            border: solid 1px #ddd;
            @include sc(12px, #333);
          }
          a:first-child {
            margin-left: 0;
          }
        }
      }
      .img-right-view {
        float: right;
        width: 120px;
        text-align: center;
        .img-item-wrap {
          background-color: #f6f6f6;
          padding: 10px 0;
          height: 303px;
          .font {
            padding: 8px 0;
          }
          .img-item-80 {
            img {
              width: 80px;
              height: 80px;
            }
          }
          .img-item {
            text-align: center;
            img {
              text-align: center;
              border-radius: 50%;
              border: solid 1px #ddd;
            }
          }
          .img-item-60 {
            img {
              width: 60px;
              height: 60px;
            }
          }
          .img-item-40 {
            img {
              width: 40px;
              height: 40px;
            }
          }
        }
        .btn-rows {
          margin-top: 30px;
          padding: 10px 0;
          a {
            display: inline-block;
            width: 95%;
            padding: 8px 0;
            margin: 5px 0;
            border-radius: 4px;
            background-color: #2e6af4;
            @include sc(15px, #ffffff);
          }
        }
      }
    }
    .img-cut-footer {
      text-align: center;
      padding: 35px 0;
      a {
        padding: 8px 55px;
        margin: 0 10px;
        border-radius: 18px;
      }
      .btn {
        background-color: #2e6af4;
        @include sc(16px, #ffffff);
      }
      .cancel-btn {
        border: solid 1px #666666;
        @include sc(16px, #333333);
      }
      .save-btn {
        background-color: #2e6af4;
        @include sc(16px, #ffffff);
      }
    }
  }
  /deep/ .vue-cropper {
    height: 324px!important;
  }
</style>
