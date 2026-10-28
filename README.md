# ShopEasy API Server

ShopEasy 电商系统后端服务（Express + JSON 文件存储，无需数据库）。

## 环境要求

- Node.js 18+

## 快速开始

```bash
npm install       # 安装依赖
npm run seed      # 初始化测试数据（生成 data.json）
npm start         # 启动服务，默认 http://localhost:3000
```

## 配置（环境变量，均有开发默认值）

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | 3000 | 服务端口 |
| `JWT_SECRET` | 开发回退值 | JWT 签名密钥（生产环境必须设置） |
| `CORS_ORIGINS` | localhost:5173 等 | 允许的跨域来源，逗号分隔 |

## 测试账号（seed 初始化）

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | 123456 |
| 普通用户 | buyer1 / buyer2 | 123456 |
| 禁用用户 | disabled_user | 123456 |

## API 测试

本服务配套的 API 自动化测试仓库：[shopeasy-api-test](https://github.com/lxf0627/shopeasy-api-test)
