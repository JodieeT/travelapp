# 易宿酒店预订平台

智慧出行酒店预订平台是一个面向现代旅游出行场景的综合服务体系，旨在为酒店商家与终端消费者之间搭建高效、便捷的信息交互桥梁。

本项目为 **管理酒店信息系统（PC 站点）**，包含商户端和管理员端的酒店信息管理功能。

## 项目结构

```
travelapp/
├── backend/           # Node.js + Express + SQLite 后端服务
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由
│   │   ├── middlewares/   # 中间件
│   │   └── services/      # 服务
│   └── database.sqlite    # SQLite 数据库
├── frontend/          # PC 管理端 (React + Vite)
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── api/           # API
│   │   ├── hooks/         # 自定义 Hooks
│   │   └── context/       # 上下文
│   └── ...
└── docs/              # 文档
```

## 功能一览

- **用户登录/注册**：支持商户、管理员两种角色
- **酒店信息录入/编辑**：商户录入、编辑、保存酒店信息
- **酒店信息审核/发布/下线**：管理员审核通过/不通过、发布、下线（可恢复）

## 快速开始

### 1. 启动后端

```bash
cd backend
npm install
npm run dev
```

后端服务运行在 **http://localhost:3000**

### 2. 启动 PC 管理端

```bash
cd frontend
npm install
npm run dev
```

管理端运行在 **http://localhost:5173**

## API 接口

### 基础路径

| 类型 | 基础路径 | 说明 |
|------|----------|------|
| 公开接口 | `GET /api/...` | 无需登录 |
| 认证 | `POST /api/auth/...` | 注册、登录 |
| 商户 | `/api/merchant/...` | 需登录，角色 merchant |
| 管理员 | `/api/admin/...` | 需登录，角色 admin |

### 认证接口

- `POST /api/auth/register` — 注册，body: `{ username, password, role }`，role 为 `merchant` 或 `admin`
- `POST /api/auth/login` — 登录，body: `{ username, password }`，返回 `token`、`user`

### 商户接口（需 Header: `Authorization: Bearer <token>`）

- `GET /api/merchant/hotels` — 当前商户的酒店列表
- `GET /api/merchant/hotels/:id` — 单店详情
- `POST /api/merchant/hotels` — 创建酒店（草稿），可带 `rooms: [{ type_name, base_price }]`
- `PUT /api/merchant/hotels/:id` — 编辑酒店（仅 draft/rejected）
- `POST /api/merchant/hotels/:id/submit` — 提交审核

### 管理员接口

- `GET /api/admin/hotels?status=&page=&limit=` — 酒店列表（按状态筛选）
- `POST /api/admin/hotels/:id/approve` — 审核通过
- `POST /api/admin/hotels/:id/reject` — 审核不通过，body: `{ reason }`
- `POST /api/admin/hotels/:id/offline` — 下线（可恢复）
- `POST /api/admin/hotels/:id/restore` — 从下线恢复

### 测试接口

```bash
cd backend
npm run test:api
```

## 技术亮点

- **角色权限**：JWT 认证 + 角色中间件实现商户/管理员权限控制
- **状态管理**：完整的审核流程（草稿→待审核→已通过/已拒绝→已下线）
- **路由保护**：ProtectedRoute 组件根据用户角色控制页面访问权限，未登录自动跳转登录页
- **SSE 实时价格更新**：使用 Server-Sent Events 实现价格实时推送，后端维护长连接并广播价格变动
- **草稿自动保存**：商户录入表单时自动保存草稿到 localStorage，意外关闭可恢复
- **批量审核操作**：管理员支持批量通过/驳回酒店，提高审核效率
- **Banner 管理**：可设置酒店为首页展示 Banner，支持排序
- **分页查询**：酒店列表支持分页加载，避免大数据量渲染
- **图片上传**：支持本地上传图片到服务器
- **完整数据维度**：包含酒店名称、地址、星级、房型、价格、开业时间、周边交通、热门景点等字段

## 数据库

- 使用 **SQLite**，库文件路径：`backend/database.sqlite`
- 查看数据：在终端进入 `backend/` 后执行 `sqlite3 database.sqlite`

### 数据库结构

共三张表：**Users**（用户）、**Hotels**（酒店）、**Rooms**（房型）。关系：用户（商户）一对多酒店，酒店一对多房型。

| 表名 | 说明 |
|------|------|
| Users | 账号（商户 / 管理员），用于登录与权限 |
| Hotels | 酒店信息及审核状态 |
| Rooms | 房型及价格，归属某家酒店 |

**Users**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键（自增） |
| username | STRING | 登录名，唯一 |
| password_hash | STRING | 密码哈希 |
| role | ENUM | `merchant` / `admin` |
| createdAt | DATE | 创建时间 |
| updatedAt | DATE | 更新时间 |

**Hotels**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键（自增） |
| merchant_id | INTEGER | 所属商户，外键 → Users.id |
| name_cn | STRING | 酒店中文名 |
| name_en | STRING | 酒店英文名 |
| city | STRING | 城市 |
| address | STRING | 地址 |
| star_level | INTEGER | 星级 |
| open_date | DATE | 开业日期 |
| status | ENUM | `draft` / `pending` / `approved` / `rejected` / `offline` |
| reject_reason | STRING | 审核不通过原因 |
| images | TEXT | JSON 数组字符串，图片 URL 列表 |
| tags | TEXT | JSON 数组字符串，标签 |
| facilities | TEXT | JSON 数组字符串，设施列表 |
| is_banner | BOOLEAN | 是否作为首页 Banner |
| banner_sort | INTEGER | Banner 排序 |
| createdAt | DATE | 创建时间 |
| updatedAt | DATE | 更新时间 |

**Rooms**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键（自增） |
| hotel_id | INTEGER | 所属酒店，外键 → Hotels.id |
| type_name | STRING | 房型名称 |
| base_price | FLOAT | 基础价格 |
| createdAt | DATE | 创建时间 |
| updatedAt | DATE | 更新时间 |

**表关系**

- `Users.id` ← `Hotels.merchant_id`（一个商户对应多家酒店）
- `Hotels.id` ← `Rooms.hotel_id`（一家酒店对应多种房型）

## 开发指南

### 数据库操作

```bash
cd backend
sqlite3 database.sqlite
```

### 测试接口

```bash
cd backend
npm run test:api      # 测试管理端接口
```

## License

MIT
