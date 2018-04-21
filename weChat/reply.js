//该模块用于实现根据消息的不同类型来进行回复
const tpl = require('./tpl')
const config = require('../config/config')
const Wechat = require('./Wechat')
const upload = new Wechat(config) //创建出来的实例中有
const menu = require('../uits/menu')//定义自定义菜单的
const api = require('../uits/api')
upload.deleteMenu()//删除已定义的菜单  返回的是promise对象
    .then(res=>{
        console.log(res)
        upload.createMenu(menu)//创建自定义菜单
            .then(res=>{
                console.log(res)
            })
    })


module.exports = async (message)=>{
    let content = "";
    let options = {}
    let voiceList = [];
    if (message.MsgType === "text"){//文本消息的处理
        if (message.Content === "1"){//如果输入的内容为1
            content = "您确认提取金额5555吗？\n回复2确认\n 回复任意键进入其他服务"
        }else if ( message.Content === "2") {//如果输入的内容为2  返回的消息
            content = "确认提取成功"
        }else if (message.Content.match(3)) { //如果输入的内容中存在3
            content = "提取成功"
        }else if (message.Content === "4"){//用于测试news图文消息的响应  content要传一个数组，数组中每一个对象代表一条消息
            content = [{
                title:'微信公众号开发',
                description:'这是一个微信公众号开发的一个重要实例',
                picUrl:'https://t12.baidu.com/it/u=2725677308,1594185465&fm=173&app=25&f=JPEG?w=640&h=902&s=FF883863C9034F6C4855B5CA0000E0B3',
                urlNews:'http://nodejs.cn/'
            },{
                title:'nodejs',
                description:'Node一个javascript的运行平台',
                picUrl:'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1841004364,244945169&fm=58&bpow=121&bpoh=75',
                urlNews:'http://nodejs.cn/'
            }]
        }else if ( message.Content === "5") {//用于测试图片的消息响应
            const mediaMaterial = await upload.uploadmaterial('image','public/1.jpg',true)
            options.mediaId = mediaMaterial.media_id
            //console.log(mediaMaterial)
            options.msgType = 'image'

        }else if ( message.Content === "6") {//永久图文素材的上传
            const mediaMaterial = await upload.uploadmaterial('image','public/1.jpg',true)
            const newsList = {
                articles: [{
                    title: '这是一个永久图文素材',
                    thumb_media_id: mediaMaterial.media_id,
                    author: '佚名',
                    digest: '图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS,涉及图片url必须来源 "上传图文消息内的图片获取URL"接口获取。外部图片url将被过滤',
                    show_cover_pic: 1,
                    content: '图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS,涉及图片url必须来源 "上传图文消息内的图片获取URL"接口获取。外部图片url将被过滤',
                    content_source_url: 'https://www.baidu.com/s'
                }],
                articles: [{
                    title: '这是一个永久图文素材',
                    thumb_media_id: mediaMaterial.media_id,
                    author: '佚名',
                    digest: '图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS,涉及图片url必须来源 "上传图文消息内的图片获取URL"接口获取。外部图片url将被过滤',
                    show_cover_pic: 1,
                    content: '图文消息的具体内容，支持HTML标签，必须少于2万字符，小于1M，且此处会去除JS,涉及图片url必须来源 "上传图文消息内的图片获取URL"接口获取。外部图片url将被过滤',
                    content_source_url: 'https://www.baidu.com/s'
                }]
            }
            const uploadMaterial = await upload.uploadmaterial('news',newsList,true)
            console.log('news:'+ uploadMaterial,upload)
            options.mediaId = uploadMaterial.media_id
            options.msgType = 'image'
        }else if ( message.Content === "play") {//如果输入的内容为2  返回的消息
            content = "开启录音，开始录音\n 回复 play 进入诉说模式\n 回复listen听听他人的心声"

        }else if ( message.Content === 'listen'){
            if ( options.playId && voiceList.length ) {
                options.mediaId = voiceList[ Math.floor( Math.random() + voiceList.length )]
                options.msgType = 'voice'
            }
        }else if ( message.Content === "voice") {//
            //content = "开启录音，开始录音\n 回复 play 进入诉说模式\n 回复listen听听他人的心声"
            if ( options.playId ) {
                voiceList.push(message.MediaId)
            }
        }else if ( message.Content === "7") {//如果输入的内容为2  返回的消息
            content = "<a  href="+api.url+"/search>语音搜电影</a>"
        }
    }else if (message.MsgType === 'location'){//微信中点 +  中有一个‘位置’ 点那个会发送的消息类型
        content = '纬度:' + message.Location_X + '\n经度:' + message.Location_Y +
            '\n地图缩放：' + message.Scale + '地理位置信息：'+message.Label
    }else if (message.MsgType === "event"){//消息是事件类型时的情况
        switch (message.Event){//获取事件
            case "subscript": //表示关注订阅号的事件
                    content = "感谢您的关注"
                break
            case "SCAN"://用户已关注时的事件推送
                content = '用户已关注时的事件推送'
                break
            case "LOCATION": //这个是关注后会有个弹窗是否上报地理位置，同意后每次进入公众号会话时，都会在进入时上报地理位置
                content = '纬度:' + message.Latitude + '\n经度:' + message.Longitude + '\n精度：' + message.Precision
                break
            case "CLICK"://点击自定义菜单后，微信会把点击事件推送给开发者  点击菜单弹出子菜单，不会产生上报。
                content = message.EventKey
                break
            case "unsubscript"://取消订阅号时微信时
                console.log("用户无情取关！")
                break
            default:
                break
        }
    }

    options.fromUserName = message.FromUserName;//将微信服务器端请求的FromUserName也就是  用户的微信号
    options.toUserName = message.ToUserName //表示的是开发者的微信号
    options.createTime = Date.now()
    options.msgType = options.msgType || message.MsgType /*message.MsgType*/;
    options.content = content;//对消息处理的内容
    if ( options.msgType === 'location' || options.msgType === 'event') {
        options.msgType = 'text'
    }
    if (Array.isArray(options.content)){//如果content是数组，标识是图文消息
        options.msgType = 'news'
    }
    //options.playId = ''

    /*if ( message.Content === 'play' || message.Content === 'listen'){
        options.playId = message.MediaId
    }*/
    console.log(tpl(options))
    return tpl(options);//调用模块的方法  将响应的消息转换为xml格式
}
