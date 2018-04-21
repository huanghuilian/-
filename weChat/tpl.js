//该模块用于将需要响应的消息转换成xml格式的数据
module.exports = (message)=>{//message  为reply中调用时传的参数
    let tpl = ''//初始化响应消息的xml
    //推送XML数据的公共部分
    tpl += '<xml> ' +
        '<ToUserName><![CDATA['+message.fromUserName+']]></ToUserName> ' +
        '<FromUserName><![CDATA['+message.toUserName+']]></FromUserName> ' +
        '<CreateTime>'+message.createTime+'</CreateTime> ' +
        '<MsgType><![CDATA['+message.msgType+']]></MsgType> '
    //根据不同类型拼接xml数据
    switch (message.msgType){
        case 'text':
            tpl += '<Content><![CDATA['+message.content+']]></Content>'
            break;
        case 'image':
            tpl += '<Image><MediaId><![CDATA['+message.mediaId+']]></MediaId></Image>'
            break;
        case 'voice':
            tpl += '<Voice><MediaId><![CDATA['+message.mediaId+']]></MediaId></Voice>'
            break;
        case "video":
            tpl += '<Video>' +
                '<MediaId>< ![CDATA['+message.mediaId+'] ]></MediaId>' +
                '<Title>< ![CDATA['+message.title+'] ]></Title>' +
                '<Description><![CDATA['+message.description+']]></Description>' +
                '</Video>'
            break;
        case "music":
            tpl += '<Music>' +
                '<Title><![CDATA['+message.title+']]></Title>' +
                '<Description><![CDATA['+message.description+']]></Description>' +
                '<MusicUrl><![CDATA['+message.musicurl+']]></MusicUrl>' +
                '<HQMusicUrl><![CDATA['+message.hqmusicurl+']]></HQMusicUrl>' +
                '<ThumbMediaId><![CDATA['+message.thumbmediaId+']]></ThumbMediaId>' +
                '</Music>'
            break;
        case "news":{
            console.log(message.content)
            tpl += '<ArticleCount>'+ message.content.length +'</ArticleCount>' +
                '<Articles>'
                message.content.forEach((item)=>{//message.content是reply.js中的options对象上的响应消息的内容

                    tpl += '<item>' +
                        '<Title><![CDATA['+ item.title +']]></Title> ' +
                        '<Description><![CDATA['+ item.description +']]></Description>' +
                        '<PicUrl><![CDATA['+ item.picUrl +']]></PicUrl>' +
                        '<Url><![CDATA['+ item.urlNews +']]></Url>' +
                        '</item>'
                        //console.log('1'+tpl)
                })
                tpl +=  '</Articles>'

        }
            break;
        default:
            break
    }
    tpl += '</xml>'
    return tpl
}
