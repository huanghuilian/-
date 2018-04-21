const express = require('express');
const tools = require('./uits/tools')
const config = require('./config/config');//获取配置对象
const confirm = require('./weChat/confirm');//获取验证微信服务器有效性的认证

const router = require('./router/index')

const app = express();
app.use(express.static('public'))
app.set('view engine','ejs')
app.set('views','./views')

app.use(router)
app.use(confirm(config))
app.listen(3000,function () {
    console.log("服务器启动了")
})