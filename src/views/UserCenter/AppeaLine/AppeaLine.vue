<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/OrderList' }">订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      <el-breadcrumb-item>申诉</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="center-main">
      <div class="formWarp">
        <el-form :model="appealForm" ref="appealForm" label-width="100px"
                 label-position="right" :rules="rules" class="register-form">

          <el-form-item label="申诉订单号">
            <el-input :disabled="true"  v-model="appealForm.appealOrder"  name="appealOrder" id="appealOrder"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="appealType" style="margin-top:40px;">
            <el-select v-model="appealForm.appealType" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="(item,index) in appealForm.options"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题描述" prop="describe" style="margin-top:40px;">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入问题描述,字数在20-500之间"
              v-model="appealForm.describe">
            </el-input>
          </el-form-item>
          
          <el-form-item label="附件上传" prop="imgs">
            <el-upload  accept="image/gif, image/jpeg,image/png,.doc,.xls,.pdf,.xlsx,.docx"
              class="upload-demo"
              list-type="picture"
              drag
              :action='url'
              multiple
              ref="upload"
              :on-success="upload"
              :before-upload="beforeAvatarUpload">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png/doc/xls/pdf文件，且不超过2M</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="图形验证码" prop='imgcode' style="margin-top:40px;">
            <el-col :span='19'>
              <el-input v-model="appealForm.imgcode" style="width:100%" placeholder="图形验证码" maxlength="4"></el-input>
            </el-col>
            <el-col :span='5'>
              <img :src="imgUrl" style="width:100px;height:40px;cursor: pointer;" alt="" class="img-code"
                  @click="changeImgCode()"/>
            </el-col>
          </el-form-item>
          <el-form-item label="" prop="" style="padding-left: 70px;margin-top: 50px">
            <el-button v-dbClick type="primary" round size="long" @click="submitForm('appealForm')">立即上传</el-button>           
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
//  import {baseUrl} from "../../config/env";
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";

  export default {
    data(){
      return {
        isbuy: 1,
        url: baseUrl + '/Common/upload?type=contact?type=appeal',
        imgUrl: '',
        appealForm: {
          appealOrder: 1,
          appealType: '',
          describe: '',
          imgcode:'',
          imgkey:'',
          imgs:[],
          options: []
        },
        rules: {
          appealType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          describe: [
            { required: true, message: '请输入简单的描述', trigger: 'blur' },
            { min: 20, max: 500, message: '长度在 20 到 500 个字符', trigger: 'blur' }
          ],
          fileList: [
            { required: true, message: '请上传照片', trigger: 'change' }
          ],
          imgcode: [
            {required: true, message: '请输入验证码！', trigger: 'blur'}
          ],
        },
        uploadPath: '/ToolkitApi/Upload',
      }

    },
    mounted(){
      if(this.$route.query.id)
      this.appealForm.appealOrder = this.$route.query.id
      if(this.$route.query.isbuy)
      this.isbuy = this.$route.query.isbuy
      this.getImgCode()
      this.getType()
    },
    methods: {
      //获取申诉类型
      getType(){
          try {
            let url = baseUrl + "/account//trade_list/get_appeal_type";
            let config = {
              method: "POST",
              url: url + "?r=" + Math.random(),
            };
            this.$axios(config).then(result => {
              if (until.responesValidate(result)) {
                this.appealForm.options = result.data.data
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
      },
      //ildsolsljo
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png')|| (file.type === 'application/pdf') ||(file.type === 'application/vnd.ms-excel') ||(file.type === 'application/msword') ||(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ;
        let isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传文件只能是 JPG或 PNG 或 DOC 或 XLS 或 PDF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
     /*  beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleRemove(file, fileList) {
        console.log(file);
      },
      handleAvatarSuccessFront(res, file) {
        this.CardFrontFileUrl=URL.createObjectURL(file.raw);
        this.CardFrontFileName=res.Data.FileName;
      }, */
      clearForm(){
          this.appealForm.describe = ''
          this.appealForm.imgcode = ''
      },
      submitForm(formName) {
        let u
        if(this.isbuy == 1)
           u = baseUrl + "account/trade_user_action/do_appeal_in";
        else
           u = baseUrl + "account/trade_user_action/do_appeal_out";

        this.$refs[formName].validate((valid) => {
          if (valid) {
            try {
              let config = {
                method: "POST",
                url: u+ "?r=" + Math.random(),
                data: {
                  id:this.appealForm.appealOrder,
                  type: this.appealForm.appealType,
                  content: this.appealForm.describe,
                  imgs: this.appealForm.imgs,
                  imgcode: this.appealForm.imgcode,
                  imgkey: this.appealForm.imgkey
                }
              };
              this.$axios(config).then(result => {
                if (until.responesValidate(result)) {
                  if (result.data.code == 1) {
                    this.$refs.upload.clearFiles()
                    this.clearForm()
                    this.$message({
                      message: '信息提交成功',
                      type: 'success'
                    });
                    this.changeImgCode()
                  }
                }else{
                    this.changeImgCode()
                }
              });
            } catch (ex) {
              until.consoleLog(ex);
            }
          } else {
            console.log('error submit!!');
            return false;
            this.changeImgCode()
          }
        });
      },
      //验证码
      getImgCode(){
        try {
          let url = baseUrl + "/common/getcaptcha";
          let config = {
            method: "POST",
            url: url + "?r=" + Math.random(),
          };
          this.$axios(config).then(result => {
            if (until.responesValidate(result)) {
              this.imgUrl = result.data.data.imguri
              this.appealForm.imgkey = result.data.data.imgkey
            }
          });
        } catch (ex) {
          until.consoleLog(ex);
        }
      },
      //切换验证码
      changeImgCode(){
        this.getImgCode()
      },
      //上传图片
      upload(response){
        this.appealForm.imgs.push(response.data.url);
      },
    },
    components: {}
  }

</script>

<style lang="scss" scoped>

  .formWarp{
    margin-top: 48px;
    width: 60%;
    padding-left: 50px;
  }
  .el-button.is-round {
    padding: 12px 46px!important;
  }
  .title {
    font-size: 14px;
  }
  .warp {
    width: 90%;
    background: #F6F6F6;
    padding: 35px 20px;
    margin-top: 40px;
  }
</style>
