//该模块用于实现获取access_token
const tools = require('../uits/tools');
const rp = require('request-promise');
let api = require('../uits/api')
const fs = require('fs')
//用于access_token的存储与使用
function WeChat(config){

    //获取access_token凭证；该凭证是唯一的并且每两小时都会更新，在微信服务器中；
    //所以在存进文件之前应该对有效时间进行处理，在获取时应该对access_token进行有效性认证；如果有效直接在我本地文件中读取
    //如果已经过期将重新向微信服务器请求获取新的
    this.appID = config.appID;
    this.appsecret = config.appsecret;
    /*this.getAccessToken() //调用该方法后要么返回请求到的access-token要么 不存在
        .then((res)=>{
            return this.saveAccessToken(res);
        })*/
    /*1.首先先在本地读取文件access_token
            本地有：
                直接使用
            本地没有：
                重新向微信服务器发送请求，并存入本地
      2.对读取到的数据进行有效性认证
    * */
     this.fetchAccessToken()
     this.fetchTicket()
}
WeChat.prototype.fetchAccessToken = function(){
    //看看this中有没有凭证，有表示之前已经从微信服务器中获取过了---->判断是否过期 没有获取则再走后面的逻辑
    //较少调用getAccessToken()的次数
    if (this.access_token&&this.expires_in){
        if (this.isValidAccessToken(this)) {
            return Promise.resolve(this);
        }
    }
    return this.getAccessToken()//返回一个promise对象，以及从本地读取到的数据
        .then(res=>{//进入该方法表示已经从本地拿到了数据，本地有access_token ===>判断access_token是否过期
            if (this.isValidAccessToken()) {
                return Promise.resolve(res);
            }else{
                return this.updateAccessToken()//返回从微信服务器中获取到的access_token
                /*.then(res=>{
                    return this.saveAccessToken(res);
                })*/
            }

        },err=>{//进入该回调表示本地没有数据要进行向微信服务器获取并且保存至本地
            return this.updateAccessToken()//返回从微信服务器中获取到的access_token
            /*.then(res=>{
                return this.saveAccessToken(res);
            })*/
        })
        .then(res=>{
            //无论是否从本地获取到东西都会走以下逻辑，
            // 绑给this读取之前想看看this中有没有，有表示之前已经从微信服务器中获取过了 没有则再走后面的逻辑
            this.access_token = res.access_token;
            this.expires_in = res.expires_in;
            return this.saveAccessToken(res);
        })
}
//实现access_token的有效性认证
WeChat.prototype.isValidAccessToken = function(data){//该方法是在本地获取到数据之后进行调用
    //1.对获取到的数据进行判断是否是 具有access_token  expires_in
    if (!data||!data.access_token||!data.expires_in) {//进入该判断表示数据不存在或不是有效的数据
        return false;
    }
    const now = Date.now();
    /*  if (now< data.expires_in) {//表示access_token没有过期
          return true;
      }else{
          return false;
      }*/
    return now<data.expires_in; //当没有过期的时候返回true否则返回false
}
//实现本地读取access_token的方法
WeChat.prototype.getAccessToken = function(){
    return tools.readFileAsync('accessToken.txt');//返回一个promise对象，以及读取到的数据
}
//实现将获取到的access-token写入一个文件夹中
WeChat.prototype.saveAccessToken = function(data){
    return tools.writeFileAsync('accessToken.txt',data)
}
//实现获取微信服务器访问接口的凭据
WeChat.prototype.updateAccessToken = function(){
    const url = api.accessToken+
        "&appid="+this.appID+"&secret="+this.appsecret+"";
    //向微信服务器发送请求需要引入；两个库  request  和request-promise
    return new Promise((resolve,reject)=>{
        rp({method:"GET",url,json:true})//该函数是一个异步函数  返回的是一个promise对象,向微信服务器发送请求拿到{access_token,expirse_in}
            .then((res)=>{
                const nowtime = Date.now();//得到当前事件距离格林时间的一个毫秒值
                const expires_in = nowtime+(res.expires_in-5*60)*1000;//将access_token de 过期时间提前5分钟
                res.expires_in = expires_in;
                console.log( res.expires_in)
                resolve(res);
            },(err)=>{
                reject(err);
            })
    })
}



/*用于获取jsapi_ticket票据 http GET方式请求获得jsapi_ticket  */
WeChat.prototype.fetchTicket = function(){
    //看看this中有没有凭证，有表示之前已经从微信服务器中获取过了---->判断是否过期 没有获取则再走后面的逻辑
    if (this.ticket&&this.ticket_expires_in){
        if (this.isValidTicket(this)) {
            return Promise.resolve(this);
        }
    }
    return this.getTicket()//返回一个promise对象，以及从本地读取到的数据
        .then(res=>{//进入该方法表示已经从本地拿到了数据，本地有access_token ===>判断access_token是否过期
            if (this.isValidTicket()) {
                return Promise.resolve(res);
            }else{
                return this.updateTicket()//返回从微信服务器中获取到的access_token
            }

        },err=>{//进入该回调表示本地没有数据要进行向微信服务器获取并且保存至本地
            return this.updateTicket()//返回从微信服务器中获取到的access_token
        })
        .then(res=>{
            //无论是否从本地获取到东西都会走以下逻辑，
            // 绑给this读取之前想看看this中有没有，有表示之前已经从微信服务器中获取过了 没有则再走后面的逻辑
            this.ticket = res.ticket;
            this.ticket_expires_in = res.ticket_expires_in;
            return this.saveTicket(res);
        })
}
//实现jsapi_ticket的有效性认证
WeChat.prototype.isValidTicket = function(data){//该方法是在本地获取到数据之后进行调用
    //1.对获取到的数据进行判断是否是 具有access_token  expires_in
    if (!data||!data.ticket||!data.ticket_expires_in) {//进入该判断表示数据不存在或不是有效的数据
        return false;
    }
    const now = Date.now();
    return now<data.ticket_expires_in//当没有过期的时候返回true否则返回false
}
//实现本地读取jsapi_ticket的方法
WeChat.prototype.getTicket = function(){
    return tools.readFileAsync('ticket.txt');//返回一个promise对象，以及读取到的数据
}
//实现将获取到的jsapi_ticket写入一个文件夹中
WeChat.prototype.saveTicket = function(data){
    return tools.writeFileAsync('ticket.txt',data)
}
//实现获取微信服务器访问接口的凭据
WeChat.prototype.updateTicket = function(){

    //向微信服务器发送请求需要引入；两个库  request  和request-promise
    return new Promise((resolve,reject)=>{
        this.fetchAccessToken()
            .then(res=>{
                const url = api.ticket+
                    "&access_token="+res.access_token+"&type=jsapi";
                rp({method:"GET",url:url,json:true})//该函数是一个异步函数  返回的是一个promise对象,向微信服务器发送请求拿到{access_token,expirse_in}
                    .then((res)=>{
                        const nowtime = Date.now();//得到当前事件距离格林时间的一个毫秒值
                        const ticket_expires_in = nowtime+(res.expires_in-5*60)*1000;//将access_token de 过期时间提前5分钟
                       const data = {
                           ticket:res.ticket,
                           ticket_expires_in:ticket_expires_in
                       }
                        console.log(data)
                        resolve(data);
                    },(err)=>{
                        reject(err);
                    })

            })

    })
}




//用于实现本地素材的上传：临时上传永久性上传
/* 1.新增临时素材：https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE
        请求方式post，该post类似于form表单中的post请求方式，设置rp中配置对象  formData:form{media:fs.createStream(path)}
*  2.上传永久性素材
*       **新增永久性图文素材 ：https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=ACCESS_TOKEN
*           post请求，将请求参数设置在请求体中
*       **新增永久性图文内的url：https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=ACCESS_TOKEN
*           请求方式post，该post类似于form表单中的post请求方式，设置rp中配置对象  formData:form{media:fs.createReadStream(path)}
*       **新增其他永久性素材：https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=ACCESS_TOKEN&type=TYPE
*           请求方式post，该post类似于form表单中的post请求方式，设置rp中配置对象  formData:form{media:fs.createReadStream(path)}
*
* */
WeChat.prototype.uploadmaterial = function(type,material,permanent){
    //  调用上传临时素材返回的结果 {"type":"TYPE","media_id":"MEDIA_ID","created_at":123456789}
    let urlApi = api.temporary.upload //默认情况下使用的是临时上传素材的api
    let form = {}
    if (permanent){ //如果是其他永久性素材上传
         urlApi = api.permanent.addMaterial
    }
    if (type === 'newsPicUrl') { //newsPicUrl为自定义一个可以先获取图文路径的标识
        urlApi = api.permanent.uploadImg
    }
    if (type === 'news'){
         urlApi = api.permanent.addNews
        form = material //请求的参数应该要设置在请求体中的
    }else{
        form = {
            media: fs.createReadStream(material)//默认为临时素材上传  material为路径
        }
    }
    return new Promise((resolve,reject)=>{
        this.fetchAccessToken()//返回的是一个promise对象   存在access_type   expires_in
            .then(res=>{
                let url = urlApi + 'access_token='+ res.access_token

                if (type !== 'news' || type !== 'newsPicUrl') {
                     url += '&type='+type
                }
                let options = {method:'POST',url:url,json:true}
                //type === 'news'?(options.body = form):(options.formData = form)
                if ( type ==='news'){
                    options.body = form
                } else {
                    options.formData = form
                }
                console.log("上传素材option："+ options)
                rp(options)
                    .then(res=>{//从微信服务器中得到的响应 一个带有media_id的对象 或者图文的url
                        console.log("上传素材："+ res)
                        resolve(res)
                    },err=>{
                        reject(err)
                    })
            })

    })

}
//用于实现获取素材
WeChat.prototype.getMaterial = function (type, mediaId, permanent) {
    let getApi = api.temporary.get
    let method = 'GET'
    if (permanent) { //如果是获取永久性素材
        method = 'POST'
        getApi = api.permanent.get
    }
    return new Promise((resolve, reject) => {
        this.fetchAccessToken()
            .then(res => {
                let url = getApi + 'access_token=' + res.access_token
                let options = {method: method, url: url, json: true}
                if (permanent) {
                    options.body = {
                        media_id: mediaId
                    }
                } else {
                    if (type === 'video') {
                        url.replace('https//', 'http://')
                    }
                    url += '&media_id=' + mediaId
                }
                if (type === 'video' || type === 'news') {
                    rp(options)
                        .then(res => {// 获取到了{ "media_id":MEDIA_ID }
                            resolve(res)
                        }, err => {
                            reject(err)
                        })
                } else {
                    resolve(url) // 临时素材: {"video_url":DOWN_URL}
                }
            })
    })

}
//用于创建自定义菜单
WeChat.prototype.createMenu = function(data){

    return new Promise((resolve,reject)=>{
        this.fetchAccessToken()
            .then(res=>{
                let url = api.createMenu.create + 'access_token=' + res.access_token
                rp({method:'POST',url:url,body:data,json:true})
                    .then(res=>{
                        resolve(res)
                    },err=>{
                        reject(err)
                    })
            })
    })
}

//定义自定义菜单删除接口
WeChat.prototype.deleteMenu = function(){

    return new Promise((resolve,reject)=>{
        this.fetchAccessToken()
            .then(res=>{
                let url = api.createMenu.delete + 'access_token=' + res.access_token
                rp({method:'GET',url:url,json:true})
                    .then(res=>{

                        resolve(res)
                    },err=>{
                        reject(err)
                    })
            })
    })
}
module.exports = WeChat