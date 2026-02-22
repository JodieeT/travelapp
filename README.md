# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## 后端使用方法

后端基于 Node.js + Express + SQLite，位于 `backend/` 目录。

### 安装与启动

```bash
cd backend
npm install
npm run dev
```

或使用 `npm start` 直接运行（无热重载）。服务默认运行在 **http://localhost:3000**。

### 环境变量（可选）

在 `backend/` 下新建 `.env`，可配置：

- `JWT_SECRET`：JWT 密钥（不设则使用默认占位符，仅适合本地开发）

### API 基础地址

| 类型     | 基础路径           | 说明           |
|----------|--------------------|----------------|
| 公开接口 | `GET /api/...`     | 无需登录       |
| 认证     | `POST /api/auth/...` | 注册、登录     |
| 商户     | `/api/merchant/...`  | 需登录，角色 merchant |
| 管理员   | `/api/admin/...`     | 需登录，角色 admin   |

### 主要接口一览

**公开（用户端 / 移动端）**

- `GET /api/banners` — 首页 Banner 列表
- `GET /api/cities` — 获取所有可用城市列表（用于下拉选择）
- `GET /api/tags` — 获取所有可用标签列表（用于快捷标签）
- `GET /api/hotels` — 酒店列表（分页、筛选）
  - 查询参数：
    - `city` — 城市名称（模糊匹配）
    - `keyword` — 关键字搜索（匹配酒店名、英文名、地址）
    - `star_level` — 星级（3/4/5）
    - `minPrice` / `maxPrice` — 价格区间
    - `tags` — 标签筛选（单个：`"亲子"`，多个：`"亲子,豪华"`）
    - `page` — 页码（默认1）
    - `limit` — 每页数量（默认20，最大100）
  - 响应：`{ total: 总数, list: [酒店数组] }`
  - 说明：`images`、`tags`、`facilities` 字段自动解析为数组
- `GET /api/hotels/:id` — 酒店详情
  - 查询参数（可选）：
    - `check_in` — 入住日期（格式：`YYYY-MM-DD`，如 `2025-03-01`）
    - `check_out` — 离店日期（格式：`YYYY-MM-DD`，如 `2025-03-05`）
    - `nights` — 间夜数（如果提供，会计算每个房型的总价）
  - 响应：酒店详细信息，包含房型列表（按价格从低到高排序）
  - 说明：如果提供了日期参数，每个房型会包含 `total_price`（总价 = `base_price * nights`）
- `GET /api/prices/stream` — 价格实时更新流（SSE）

**认证**

- `POST /api/auth/register` — 注册，body: `{ username, password, role? }`，role 可选 `merchant` / `admin`
- `POST /api/auth/login` — 登录，body: `{ username, password }`，返回 `token`、`user`

**商户**

- `GET /api/merchant/hotels` — 当前商户的酒店列表（需 Header: `Authorization: Bearer <token>`）
- `GET /api/merchant/hotels/:id` — 单店详情
- `POST /api/merchant/hotels` — 创建酒店（草稿），可带 `rooms: [{ type_name, base_price }]`
- `PUT /api/merchant/hotels/:id` — 编辑酒店（仅 draft/rejected）
- `POST /api/merchant/hotels/:id/submit` — 提交审核

**管理员**

- `GET /api/admin/hotels?status=&page=&limit=` — 酒店列表（按状态筛选）
- `POST /api/admin/hotels/:id/approve` — 审核通过
- `POST /api/admin/hotels/:id/reject` — 审核不通过，body: `{ reason }`
- `POST /api/admin/hotels/:id/offline` — 下线（可恢复）
- `POST /api/admin/hotels/:id/restore` — 从下线恢复

### 测试接口

在**已启动后端**的前提下，另开终端执行：

```bash
cd backend
npm run test:api      # 管理端接口（登录、商户、管理员）
npm run test:mobile   # 移动端接口（banners、cities、tags、hotels 列表/详情）
```

会依次请求上述主要接口并打印结果，用于快速验证。

### 数据库

- 使用 **SQLite**，库文件路径：`backend/database.sqlite`（相对于在 `backend/` 下启动时的当前目录）。
- 查看数据：在终端进入 `backend/` 后执行 `sqlite3 database.sqlite`，例如：
  - `.tables` — 查看表（Users、Hotels、Rooms）
  - `SELECT * FROM Hotels;` — 查询酒店（注意语句末尾加分号 `;`）
  - `.quit` — 退出

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
| status | ENUM | `draft` 草稿 / `pending` 待审核 / `approved` 已通过 / `rejected` 已拒绝 / `offline` 已下线 |
| reject_reason | STRING | 审核不通过原因（仅 status=rejected 时有值） |
| images | TEXT | JSON 数组字符串，图片 URL 列表 |
| tags | TEXT | JSON 数组字符串，标签（如亲子、豪华等） |
| facilities | TEXT | JSON 数组字符串，设施列表 |
| is_banner | BOOLEAN | 是否作为首页 Banner |
| banner_sort | INTEGER | Banner 排序，越小越靠前 |
| createdAt | DATE | 创建时间 |
| updatedAt | DATE | 更新时间 |

**Rooms**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键（自增） |
| hotel_id | INTEGER | 所属酒店，外键 → Hotels.id |
| type_name | STRING | 房型名称（如大床房、双床房） |
| base_price | FLOAT | 基础价格 |
| createdAt | DATE | 创建时间 |
| updatedAt | DATE | 更新时间 |

**表关系**

- `Users.id` ← `Hotels.merchant_id`（一个商户对应多家酒店）
- `Hotels.id` ← `Rooms.hotel_id`（一家酒店对应多种房型）
