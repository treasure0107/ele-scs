<template>
  <div class="contact">
    <h1>上传申诉凭证</h1>
    <div class="complaint">
        <P>申诉信息:</P>
        <table>
            <tr>
              <td rowspan="2"><img :src="baseImgUrl+userInfo.avatar" alt=""></td>
              <td>{{userInfo.user_name}}</td>
              <td rowspan="2">
                  <el-tooltip v-if="userInfo.country==1"  effect="light" :content="userInfo.mobile" placement="right">
                    <el-button type="primary" round plain style="width:110px;">联系TA</el-button>
                 </el-tooltip>
                  <el-tooltip v-else effect="light" :content="userInfo.email" placement="right">
                     <el-button type="primary" round plain style="width:110px;">联系TA</el-button>
                  </el-tooltip>
              </td>
            </tr>
            <tr>
              <td>{{userInfo.user_id}}</td>
            </tr>
        </table>
        <p>订单编号 :<span>{{order_no}}</span> 交易金额 :<span> {{payment_money}} {{payment_unit}}</span> 交易类型 :<span>{{isbuy==1?'买单':'卖单'}}</span> 
            <br/>申诉类型 :<span>{{appeal_type}}</span>
        </p>
    </div>
    <div class='form'>
      <el-form :model="form" label-width="100px" :rules="rules" ref="form" >
        <el-form-item label="问题描述" prop='content'>
          <el-input type="textarea" v-model="form.content" :rows="6" placeholder='请输入问题描述,字数在20-500之间'></el-input>
        </el-form-item>
        <el-form-item label="上传凭证" prop="imgs">
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
        <el-form-item label="图形验证码" prop='imgcode'>
          <el-col :span='19'>
            <el-input v-model="form.imgcode" style="width:100%" placeholder="图形验证码" maxlength="4"></el-input>
          </el-col>
          <el-col :span='5'>
            <img :src="imgUrl" style="width:100%;height:40px;cursor: pointer;" alt="" class="img-code"
                 @click="changeImgCode()"/>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button v-dbClick type="primary" round style="width:180px;" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<script type="text/babel">
  import until from "@/scripts/until";
  import {baseUrl} from "@/config/env";
  import {imgBaseUrl} from "@/config/env";
  export default {
    data(){
      /* var validateEmail = (rule, value, callback) => {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (value === '') {
          callback(new Error('请输入邮箱地址！'));
        } else if (!reg.test(value)) {
          callback(new Error('邮箱格式不正确！'));
        } else {
          callback();
        }
      }; */
  /*    var beforeAvatarUpload = function (file) {
        if (!/^image\/(jpeg|png)$/.test(file.type)) {

        }
      }*/
      return {
        url: baseUrl + '/Common/upload?type=appeal',
        baseImgUrl:'',
        appeal_type:'',//申诉类型
        payment_money:'',
        payment_unit:'',
        order_no:'',
        userInfo:{
          user_name:'',
          user_id:'',
          mobile:'',
          email:'',
          country:0,
          avatar:''
        },
        imgUrl: '',
        contactType: [],
        isbuy:1,//1买  0 卖
        trade_no:0,//订单编号
        form: {
          content: '',
          imgs: [],
          imgcode: '',
          imgkey: ''
        },
        rules: {
          /* type: [
            {required: true, message: '请选择问题类型！', trigger: 'blur'}
          ], */
          content: [
            {required: true, message: '请输入问题描述！', trigger: 'blur'},
            { min: 20, max: 500, message: '长度在 20 到 500 个字符', trigger: 'blur' }
          ],
          imgcode: [
            {required: true, message: '请输入验证码！', trigger: 'blur'}
          ],
          imgs: [
            {required: true, message: '请选择附件上传！', trigger: 'blur'}
          ]
        }
      }
    },
    beforeMount(){
      this.baseImgUrl = imgBaseUrl
      if(this.$route.query.no)
        this.trade_no = this.$route.query.no
      if(this.$route.query.isbuy)
        this.isbuy = this.$route.query.isbuy
    },
    mounted(){
      this.getImgCode()
      if(this.isbuy == 1)
        this.getIn()
      if(this.isbuy == 0)
        this.getOut()
    },
    methods: {
      //买单信息
      getIn(){
        try {
            let url = baseUrl + "/account/trade_detail/re_appeal_in";
            let config = {
              method: "POST",
              url: url + "?r=" + Math.random(),
              data:{id:this.trade_no}
            };
            this.$axios(config).then(result => {
              if (until.responesValidate(result)) {
                this.appeal_type = result.data.data.appeal_type
                this.payment_money = result.data.data.payment_money
                this.payment_unit = result.data.data.payment_unit
                this.userInfo = result.data.data.user_info
                this.order_no = result.data.data.trade_no
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
      },
      //卖单信息
      getOut(){
          try {
            let url = baseUrl + "/account/trade_detail/re_appeal_out";
            let config = {
              method: "POST",
              url: url + "?r=" + Math.random(),
              data:{id:this.trade_no}
            };
            this.$axios(config).then(result => {
              if (until.responesValidate(result)) {
                this.appeal_type = result.data.data.appeal_type
                this.payment_money = result.data.data.payment_money
                this.payment_unit = result.data.data.payment_unit
                this.userInfo = result.data.data.user_info
                this.order_no = result.data.data.trade_no
              }
            });
          } catch (ex) {
            until.consoleLog(ex);
          }
      },
      //上传图片
      upload(response){
        this.form.imgs.push(response.data.url);
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
              this.form.imgkey = result.data.data.imgkey
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
      //提交
      submitForm(formName){
        //this.$refs.upload.clearFiles()
        var $this = this
        var url 
        $this.$refs[formName].validate((valid) => {
          if (valid) {
            try {
              if($this.isbuy == 1)
                   url = baseUrl + "/account/trade_user_action/do_appeal_in"
              else
                   url = baseUrl + "/account/trade_user_action/do_appeal_out"

              let config = {
                method: "POST",
                url: url + "?r=" + Math.random(),
                data: {
                  id:$this.trade_no,
                  content: $this.form.content,
                  imgs: $this.form.imgs,
                  imgcode: $this.form.imgcode,
                  imgkey: $this.form.imgkey,
                  type:$this.appeal_type,
                }
              };
              $this.$axios(config).then(result => {
                if (until.responesValidate(result)) {
                  if (result.data.code == 1) {
                    $this.$refs.upload.clearFiles()
                    $this.clearForm()
                    $this.$alert('您的申诉已提交,请耐心等待客服审核判定。审核结果将会发送至您绑定的账号。', '提示', {
                      confirmButtonText: '确定',
                      callback: action => {
                        $this.$router.go(-1)
                      }
                    });
                    $this.changeImgCode()
                  }
                }else{
                    $this.changeImgCode()
                }
              });
            } catch (ex) {
              $this.changeImgCode()
              until.consoleLog(ex);
            }
          } else {
            console.log('error submit!!');
            return false;
            $this.changeImgCode()
          }
        });


      },
      //清空表单
      clearForm(){
        this.form.content = ''
        this.form.imgcode = ''
      },
      
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png')|| (file.type === 'application/pdf') ||(file.type === 'application/vnd.ms-excel') ||(file.type === 'application/msword') ||(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ;
        let isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传文件只能是 JPG或 PNG 或 DOC 或 XLS 或 PDF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    },
    components: {}
  }

</script>

<style lang="scss" scoped>
  /deep/ .el-upload-dragger {
    width: 500px;
  }
  div.complaint{
      width:800px;
      height:180px;
      background:#F6F6F6;
      margin-top: 20px;
      padding-left: 30px;
      p:first-child{
        font-size:16px;
        font-family:MicrosoftYaHei;
        color:#333;
        line-height:60px;
      }
      table{
        td{
          font-size:14px;
          padding-right:24px;
          img{
            height:50px;
          }
        }
      }
      p:last-child{
        margin-top:10px;
        line-height: 25px;
        font-size:14px;
        font-family:MicrosoftYaHei;
        color:#999;
        span{
          color:#333;
          margin-left: 12px;
          margin-right:40px;
        }
      }
  }
  div.contact {
    padding: 56px 99px;
    h1 {
      font-size: 24px;
      font-family: MicrosoftYaHei-Bold;
      color: #333;
      line-height: 20px;
      height: 24px;
    }
    div.form {
      width: 600px;
      margin-top: 46px;
    }
  }
</style>
