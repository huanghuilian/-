//这是自定义菜单的数据
const commonUrl = require('./api')
module.exports = {
    button:[//一级菜单按钮集合  每一个对象就是一个一级菜单
    {
        type:"view",
        name:"\ue11d电影推荐",
        url:commonUrl.url+"/movie"
    },
    {
        name:"\ue312菜单",
        sub_button:[
            {
                type:"view",
                name:"\ue326搜电影",
                url:commonUrl.url+"/search"
            },
            {
                type:"click",
                name:"\ue48b赞一下我们",
                key:"click1"
            },
            {
                type: "pic_sysphoto",
                name: "\ue008系统拍照发图",
                key: "pic_sysphoto"
            },
            {
                type: "pic_photo_or_album",
                name: "\ue008拍照相册发图",
                key: "pic_photo_or_album"
            },
            {
                type: "pic_weixin",
                name: "\ue003微信相册发图",
                key: "pic_weixin"
            }
        ]
    },
        {
            name: "\ue327扫码",
            sub_button: [
                {
                    type: "scancode_waitmsg",
                    name: "扫码带提示",
                    key: "scancode_waitmsg"
                },
                {
                    type: "scancode_push",
                    name: "扫码推事件",
                    key: "scancode_push"
                }
            ]
        }
    ]
}