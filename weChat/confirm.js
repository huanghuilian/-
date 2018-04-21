//该模块实现微信服务器的有效验证
const sha1 = require('sha1');
const rp = require('request-promise');
const tools = require("../uits/tools")
const WeChat = require('./Wechat');
const xml2js = require('xml2js').parseString;//引用一个将xml转成js的库
const reply = require('./reply')

module.exports = (config)=> {

    //new WeChat(config);
    return async (req,res)=>{
        const token = config.token;
        const signature = req.query.signature;//获取微信的加密签名
        const echostr = req.query.echostr;//获取微信的随机数字
        const nonce = req.query.nonce;
        const timestamp = req.query.timestamp;
        let xmlData ,jsData;

        const result = sha1([timestamp,nonce,token].sort().join(""));
        //微信服务器发送请求的方式：
        /*  get：验证微信服务器的有效性
            post：提取处理用户请求的信息
        * */
        if(req.method ==="GET"){
            if (result === signature){
                res.send(echostr);
            }else{
                res.send("error")
            }
        }else if (req.method==="POST"){
            /* req.query:
                { signature: '5e61e570620d049f44b1941663c5d69bde0a4c4e',//微信给的加密签名
                  timestamp: '1523855565',//时间戳
                  nonce: '1202313630',//随机数
                  openid: 'oi3991spgeDyZ4FuEIwj6sfkZSOQ' } 用户的id
               req.body：undefined
            * */
            console.log(req.query,req.body)
            //请求体中的参数以流的形参传递过来
            xmlData = await tools.getXmlDataAsyn(req);//返回promise对象 带有xml格式的数据

            xml2js(xmlData, function (err, data) {
                xmlData = data;
            });
            //console.log(xmlData)
 /*xml转换成js的结果：
         { xml:
           { ToUserName: [ 'gh_f8af38226f59' ],
             FromUserName: [ 'oi3991spgeDyZ4FuEIwj6sfkZSOQ' ],
             CreateTime: [ '1523858330' ],
             MsgType: [ 'text' ],
             Content: [ '123' ],
             MsgId: [ '6544921691516388024' ] } }
 * */
            const jsData =  await tools.formatXmlDataAsyn(xmlData.xml);
            //console.log(jsData)
            const  resultMsg = await reply(jsData)

            /*{ ToUserName: 'gh_f8af38226f59',
                  FromUserName: 'oi3991spgeDyZ4FuEIwj6sfkZSOQ',
                  CreateTime: '1523859111',
                  MsgType: 'text',
                  Content: '789',
                  MsgId: '6544925045885846380' }
            * */
           /* xmlData.then(res=>{//拿到消息之后对xml格式的数据进行转换成js对象  如果用该总方式很容易发送回调地狱
                console.log(res);
            })*/
            /*<xml><ToUserName><![CDATA[gh_f8af38226f59]]></ToUserName> //开发者的用户名
                    <FromUserName><![CDATA[oi3991spgeDyZ4FuEIwj6sfkZSOQ]]></FromUserName>  //用户列表中的用户微信号
                    <CreateTime>1523856789</CreateTime> //发送请求的时间
                    <MsgType><![CDATA[text]]></MsgType> //发送消息的消息类型  text   event
                    <Content><![CDATA[123]]></Content>   //消息的内容
                    <MsgId>6544915072971784062</MsgId>   //微信服务器中储存的消息id
               </xml>
            * */
            console.log(resultMsg)
            res.send(resultMsg);
        }

    };
}