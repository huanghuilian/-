const express = require('express')
const router = express.Router()
const sha1 = require('sha1')
const config = require('../config/config');//获取配置对象
const commonUrl = require('../uits/api')
const Wechat =  require('../weChat/Wechat')
const getTicket = new Wechat(config);// 可获取ticket票据

const rp = require('request-promise')//用于向豆瓣发请求拿数据
const {douban} = require('../uits/api') //解构赋值法
router.get('/movie',async (req,res)=>{
    //使用权限签名算法 生成签名之前必须先了解一下jsapi_ticket，jsapi_ticket   jsapi_ticket是公众号用于调用微信JS接口的临时票据
    /*参与签名的字段包括：
        noncestr（随机字符串）,
        有效的jsapi_ticket,
        timestamp（时间戳）,
         url（当前网页的URL    http://b1299b95.ngrok.io/movie
         1.准备好参与的字段
    * */
    //1、准备参与签名的参数
    const noncestr = Math.random().toString().substring(2,15) //产生一个随机数，将其转换成字符串，从第二位开始截取
    const jsapi_ticket = (await getTicket.fetchTicket()).ticket//
    console.log(jsapi_ticket)
    const timestamp = Date.now()
    const url = commonUrl.url+'/movie'
    //2.将参与签名的参数放进一个数组中进行ASCII排序
    const sortArr = ['noncestr='+noncestr, 'jsapi_ticket='+jsapi_ticket,'timestamp='+timestamp,'url='+url].sort()
    //3.将排序后的数组拼接成字符串
    const str = sortArr.join('&')
    console.log(str)//jsapi_ticket=HoagFKDcsGMVCIY2vOjf9heRWDve81QVA1w4wOyxeNQZD8NLJ2h2akZOghcn_0q5coRlSGr4ffXqs4CYjanP4g&noncestr=5415304144180&timestamp=1523963793353&url=http://871ad025.ngrok.io/movie
    const signature = sha1(str)
    //console.log(signature)// df7a06a9f7642f1f4273cdc1c7174e23678709bd
    const theatersData = await rp({method:'GET',url:douban.theaters,json:true})

    const comingData = await rp({method:'GET',url:douban.coming,json:true})
    const top250Data = await rp({method:'GET',url:douban.top250,json:true})
    const data = {
        theatersData,
        comingData,
        top250Data
    }
    //console.log(theatersData,comingData,top250Data)
    res.render('movie',{//将参与签名的参数传递到页面中
        signature,
        noncestr,
        timestamp,
        data,
        commonUrl:commonUrl.url
    })
})
router.get('/details',async (req,res)=>{
    const  noncestr = Math.random().toString().substring(2,15) //产生一个随机数，将其转换成字符串，从第二位开始截取
    const jsapi_ticket = (await getTicket.fetchTicket()).ticket//
    console.log(jsapi_ticket)
    const timestamp = Date.now()
    const url = commonUrl.url + '/details'
    //2.将参与签名的参数放进一个数组中进行ASCII排序
    const sortArr = ['noncestr='+noncestr , 'jsapi_ticket='+jsapi_ticket,'timestamp='+timestamp,'url='+url].sort()
    //3.将排序后的数组拼接成字符串
    const str = sortArr.join('&')
    //console.log(str)//jsapi_ticket=HoagFKDcsGMVCIY2vOjf9heRWDve81QVA1w4wOyxeNQZD8NLJ2h2akZOghcn_0q5coRlSGr4ffXqs4CYjanP4g&noncestr=5415304144180&timestamp=1523963793353&url=http://871ad025.ngrok.io/movie
    const signature = sha1(str)
    const id = req.query.id //获取主页搜索页请求的时候传递的指定影剧的id
    const detailUrl = douban.detailUrl + id //得到指定电影的url
    const detailData = await rp({method:'GET',url:detailUrl,json:true}) //向豆瓣请求某一电影的数据
    res.render('details',{
        detailData,
        signature,
        noncestr,
        timestamp,
        commonUrl:commonUrl.url
    })
})
router.get('/search',async (req,res)=>{
    const  noncestr = Math.random().toString().substring(2,15) //产生一个随机数，将其转换成字符串，从第二位开始截取
    const jsapi_ticket = (await getTicket.fetchTicket()).ticket//
    console.log(jsapi_ticket)
    const timestamp = Date.now()
    const url = commonUrl.url + '/search'
    //2.将参与签名的参数放进一个数组中进行ASCII排序
    const sortArr = ['noncestr='+noncestr , 'jsapi_ticket='+jsapi_ticket,'timestamp='+timestamp,'url='+url].sort()
    //3.将排序后的数组拼接成字符串
    const str = sortArr.join('&')
    //console.log(str)//jsapi_ticket=HoagFKDcsGMVCIY2vOjf9heRWDve81QVA1w4wOyxeNQZD8NLJ2h2akZOghcn_0q5coRlSGr4ffXqs4CYjanP4g&noncestr=5415304144180&timestamp=1523963793353&url=http://871ad025.ngrok.io/movie
    const signature = sha1(str)
    res.render('search',{//将参与签名的参数传递到页面中
        signature,
        noncestr,
        timestamp,
        commonUrl:commonUrl.url,
        searchUrl:douban.searchUrl
    })
})
module.exports = router