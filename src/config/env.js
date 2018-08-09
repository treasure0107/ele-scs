/**
 * Created by 520 on 2018/6/20.
 */
let baseUrl = '';
let routerMode = 'hash';
let imgBaseUrl;
function getLocation() {
  var arr = document.domain.split('.');
  if (arr.length > 2 && arr[0] == 'www') {
    return arr.slice(1).join('.');
  } else if (arr.length == 2) {
    return arr.join('.');
  }
  return arr;
}
if (process.env.NODE_ENV == 'development') {
  baseUrl = 'http://localhost:8080/';
  imgBaseUrl = 'http://gfc-oss.oss-cn-hongkong.aliyuncs.com/';
} else if (process.env.NODE_ENV == 'production') {
  //let host = window.location.host;
  //测试环境
  baseUrl = "http://vipapi.1903.love/api/";
  imgBaseUrl = 'http://gfc-oss.oss-cn-hongkong.aliyuncs.com/';
/*  imgBaseUrl = 'http://vipapi.1903.love/api/images/';*/
  //正式环境
/*  let host = getLocation();
  baseUrl = "//api." + host + "/api/";
  imgBaseUrl = "//api." + host + "/api/images/";*/
  /*  baseUrl = '//api.gfcvip.com/api/';
   imgBaseUrl = '//api.gfcvip.com/api/images/';*/
}
export {
  baseUrl,
  routerMode,
  imgBaseUrl,
}
