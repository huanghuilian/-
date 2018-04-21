目录结构
├─ config/            # 配置目录
│   ├─ config.js # 存储配置信息
├─ libs/               # 工具方法库
│   ├─ utils.js     # 读/写文件，解析字符串的工具方法
│   ├─ accessToken.txt  # 存储access_token
├── wechat/          # 核心功能库
|    ├─ reply.js # 处理用户发送的信息
│   ├─ tpl.js # 返回给用户的信息模板
│   ├─ confirm.js # 回复消息功能
│   ├─ wechat.js # 构造函数wechat
├── index.js          # 入口启动文件
├── package.json      # 配置文件
需要进行内网操作：ngrok-stable-windows-amd64
登录注册微信公众订阅号