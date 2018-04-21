//该模块用于定义调用微信api时用到的url
const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const dbprefix = 'https://api.douban.com/v2/movie/'
module.exports = {
    accessToken:prefix + 'token?grant_type=client_credential',
    //https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi   type=jsapi是固定不变的
    ticket: prefix + 'ticket/getticket?',
    url:'http://d8dc87e0.ngrok.io',
    temporary:{
        //https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE
        upload:prefix + 'media/upload?',
        get: prefix + 'media/get?'
    },
    permanent:{
        //新增永久图文素材https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=ACCESS_TOKEN
        addNews:prefix + 'material/add_news?',
        //获取图文素材的url 服务于上面api
        //https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=ACCESS_TOKEN
        uploadImg:prefix + 'media/uploadimg?',
        //https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=ACCESS_TOKEN&type=TYPE
        addMaterial:prefix + 'material/add_material?',
        get: prefix + 'material/get_material?'
    },
    createMenu:{
        create:prefix + 'menu/create?',
        delete: prefix + 'menu/delete?'
    },
    douban:{//豆瓣电影的的三个接口
        theaters: dbprefix + 'in_theaters',
        coming: dbprefix + 'coming_soon',
        top250: dbprefix + 'top250',
        detailUrl:dbprefix + 'subject/',
        search:dbprefix + 'search?'
    }

}