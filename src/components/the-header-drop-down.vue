<template>
  <div
    class="language"
    @click="showDropDown"
  >
    <a href="javascript:;">
      {{language}}
      <span class="icon-updown"></span>
      <ul ref="dropDown" :class="{'drop-down': true, 'drop-down-show': isShowDropDown}">
        <li @click="setLanguage('zh-CN')">简体中文</li>
        <li @click="setLanguage('en-US')">English</li>
      </ul>
    </a>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'TheHeaderDropDown',
  data () {
    return {
      language: '简体中文',
      isShowDropDown: false,
    }
  },
  computed: {
    ...mapState([
      {
        globalLanguage: 'language'
      }
    ])
  },
  watch: {
    language (value, oldValue) {
      this.setLanguage(value)
    }
  },
  props: {
    isSmallSize: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted () {
    this.setTop()
    this.setDefaultLanguage()
  },
  methods: {
    // 引入store的mutations
    ...mapMutations([
      "SET_LANGUAGE"
    ]),
    // 设置top值
    setTop () {
      const dropDown = this.$refs.dropDown
      const dropDownStyle = dropDown.style
      if (this.isSmallSize) {
        dropDownStyle.top = '60px'
      }
    },
    setDefaultLanguage () {
      const cookieLanguage = this.$_cookie.get('language')
      if (cookieLanguage) {
        this.setLanguage(cookieLanguage)
      } else {
        this.setLanguage('zh-CN')
      }
    },
    // 显示下拉框
    showDropDown () {
      this.isShowDropDown = true
    },
    // 隐藏下拉框
    hideDropDown () {
      this.isShowDropDown = false
    },
    // 设置语言
    setLanguage (language) {
      switch (language) {
        case 'zh-CN':
          this.$i18n.locale = 'zh-CN'
          this.$_cookie.set('language', 'zh-CN')
          this.language = '简体中文'
          break;
        case 'en-US':
          this.$i18n.locale = 'en-US'
          this.$_cookie.set('language', 'en-US')
          this.language = 'English'
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 语言下拉框
.language {
  position: relative;
  display: inline-block;
  > a {
    color: #fff;
    .icon-updown {
      display: inline-block;
      margin-left: 8px;
      height: 11px;
      width: 11px;
/*      background-image: url(~@/assets/icon-png/icon_zhangkai@2x.png);
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover cover;*/
    }
    .drop-down {
      display: flex;
      flex-direction: column;
      position: absolute;
      visibility: hidden;
      top: 80px;
      z-index: 900;
      right: 0;
      padding: 23px 18px;
      width:140px;
      background:rgba(255,255,255,1);
      box-shadow: 2px 2px 11px 0px rgba(0,0,0,0.04);
      border-radius: 4px;
      color: #22232F;

      > li {
        flex-basis: 40px;
        cursor: pointer;
        line-height: 40px;

        &:hover {
          font-weight: bold;
        }
      }

      &.drop-down-show {
        visibility: unset;
      }
    }
  }
}
</style>
