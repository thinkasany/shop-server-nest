```
CREATE SCHEMA `shop` DEFAULT CHARACTER SET utf8mb4 ;
```

创建一个 crud 的模块
```
nest g resource user
```

.env
```
APPID = "" # 小程序 appid
SECRET = "" # 小程序密钥
```

由于功能比较多，需要后续开发的会加上fixme 注意后续的修复工作
fixme

1. 全局的错误提示需要做一个 throw new HttpException('请求失败', 500);
2. /* eslint-disable @typescript-eslint/no-unused-vars */ 这个看着就有问题 let 的怎么就没调用了
3. entity的对照着修改一下 下划线还是驼峰要注意检查
4. ts any 可能是entity的错误 没时间搞