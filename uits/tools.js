//1.该模块用于实现 access-token的写入文件中 2. 实现 文件中读取access-token
const fs = require('fs');
const path = require('path')

module.exports = {
    writeFileAsync:(filePath,data)=>{
        filepath = path.join(__dirname,filePath)
        const datajson =JSON.stringify(data);
        return new Promise((resolve,reject)=>{
            fs.writeFile(filepath,datajson,(err)=>{
                if (!err){
                    resolve(data);
                } else{
                    reject(err);
                }
            })
        })
    },
    readFileAsync:(filePath)=>{
        filepath = path.join(__dirname,filePath)
        return new Promise((resolve,reject)=>{
            fs.readFile(filepath,(err,data)=>{//读取的数据是一个buffer类型的
                if (!err){
                    data = data.toString();//将读取的数据转换成
                    resolve(data);
                } else{
                    reject(err);
                }
            })
        })
    },
    getXmlDataAsyn:(req)=>{
        return new Promise((resolve,reject)=>{
            let xmlData = "";//用于储存每一次流传的数据片段
            req.on("data",data=>{ //事件监听以数据流的方式读取数据，数据是buffer类型的
                data = data.toString();
                xmlData += data;
            }).on("end",()=>{
                resolve(xmlData);
            })
        })
    },
    formatXmlDataAsyn:(xml)=>{
        return new Promise((resolve,reject)=>{
            const keys = Object.keys(xml);//返回xml对象中的所有属性名   数组
            let jsData = {}
            for (let i = 0,length = keys.length;i < length;i++){
                //xml[keys[i]] = xml[keys[i]][0]
                jsData[keys[i]] = xml[keys[i]][0];
            }
            resolve(jsData);
        })
    }
}