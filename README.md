# Easy Stay Client

一个现代化的酒店预订移动应用客户端，使用React Native和Expo构建。

## 🏗️ 项目架构

### 技术栈
- **框架**: React Native + Expo
- **路由**: Expo Router (基于React Navigation)
- **状态管理**: React Hooks + AsyncStorage
- **UI库**: Tailwind CSS (NativeWind)
- **类型检查**: TypeScript
- **数据获取**: 自定义Hook + Fetch API

### 目录结构
```
easy-stay-client/
├── app/                    # 页面路由组件
│   ├── _layout.tsx        # 根布局
│   ├── index.tsx          # 首页
│   ├── list.tsx           # 酒店列表页
│   └── hotels/            # 酒店详情页
│       └── [id].tsx
├── components/            # 可复用组件
│   ├── ui/               # 基础UI组件
│   ├── Banner.tsx        # 首页横幅
│   ├── CitySelector.tsx  # 城市选择器
│   ├── DateRangePicker.tsx # 日期选择器
│   ├── HotelCard.tsx     # 酒店卡片
│   ├── PriceStarFilter.tsx # 价格星级筛选
│   ├── SearchCard.tsx    # 搜索卡片
│   └── TagSelector.tsx   # 标签选择器
├── constants/            # 常量定义
│   ├── data.ts          # 静态数据和配置
│   └── images.ts        # 图片资源
├── hooks/               # 自定义Hooks
│   └── useSearchFilters.ts # 搜索筛选状态管理
├── interfaces/          # TypeScript接口定义
│   └── interfaces.d.ts
├── services/            # 业务逻辑层
│   ├── api.ts          # API服务
│   └── useFetch.ts     # 数据获取Hook
├── utils/              # 工具函数
│   └── dateUtils.ts    # 日期处理工具
└── package.json
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16
- npm 或 yarn
- Expo CLI

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
# 启动Web开发服务器
npm run web
开发者模式运行手机模拟
# 使用expo选择web/ios
npm expo start
```
如果处于同一网络，使用expo go扫描二维码，即可打开
### 构建生产版本
```bash
# Web构建
npm run build

# 移动端构建
npm run build:mobile
```

## ⚙️ 后端配置

### API服务配置说明

本项目采用**前后端分离架构**，前端通过API与后端服务通信。

#### BASE_URL配置机制
```typescript
// services/api.ts 中的配置
const BASE_URL = 'http://192.168.71.54:3000'; // 由后端部署地址决定
```

**配置说明：**
- `BASE_URL` 应设置为后端服务的实际部署地址
- 由后端开发团队提供具体的IP地址和端口号
- 本地开发时可根据后端实际运行地址进行调整
- 生产环境应使用域名而非IP地址

#### 支持的API端点：
- `GET /api/hotels` - 获取酒店列表（支持分页和筛选）
- `GET /api/hotels/:id` - 获取酒店详情
- `GET /api/banners` - 获取首页横幅数据
- `GET /api/cities` - 获取城市列表
- `GET /api/tags` - 获取标签列表


## 📱 功能特性

### 核心功能
- 🔍 **智能搜索**: 支持城市、关键词、日期等多维度搜索
- 🏨 **酒店浏览**: 流畅的酒店列表展示和详情查看
- 📅 **日期选择**: 直观的日历式日期选择器
- 💰 **价格筛选**: 灵活的价格区间和星级筛选
- 🏷️ **标签过滤**: 基于特色的标签筛选系统
- 📱 **响应式设计**: 适配不同屏幕尺寸的移动端体验

### 技术亮点
- **分页加载**: 上滑自动加载更多数据
- **状态持久化**: 搜索条件自动保存到本地存储
- **组件复用**: 高度模块化的组件设计
- **类型安全**: 完整的TypeScript类型定义
- **性能优化**: 虚拟列表和懒加载技术

## 🛠️ 开发规范

### 代码组织原则
1. **组件复用**: 相同功能的UI组件统一抽象到components目录
2. **状态管理**: 复杂状态逻辑提取到自定义Hooks
3. **工具函数**: 通用工具函数集中到utils目录
4. **常量管理**: 静态数据统一在constants中定义

### 命名规范
- 组件文件: PascalCase (`HotelCard.tsx`)
- Hook文件: use开头 (`useSearchFilters.ts`)
- 工具函数: camelCase (`dateToString`)
- 常量: UPPER_SNAKE_CASE (`DEFAULT_CITY`)

### TypeScript规范
- 所有组件和函数都需要明确的类型定义
- 接口定义集中管理在`interfaces/`目录
- 避免使用`any`类型，优先使用具体类型或泛型

## 🔄 数据流说明

### 搜索状态管理
```typescript
// 使用统一的搜索筛选Hook
const { 
  filters,           // 当前筛选条件
  updateFilters,     // 更新筛选条件
  getApiParams,      // 获取API参数
  getRouteParams     // 获取路由参数
} = useSearchFilters();
```

### 数据获取流程
1. 用户操作触发筛选条件更新
2. `useSearchFilters`自动保存到本地存储
3. `useFetch`根据条件自动获取数据
4. 组件渲染更新后的数据

### 分页机制
- 初始加载第1页数据
- 上滑到底部时自动加载下一页
- 支持加载状态和结束状态提示

## 🎨 UI组件库

### 基础组件
- `LoadingState`: 统一的加载状态组件
- `ErrorState`: 统一的错误状态组件  
- `EmptyState`: 统一的空状态组件

### 业务组件
- `CitySelector`: 城市选择下拉框
- `DateRangePicker`: 日期范围选择器
- `PriceStarFilter`: 价格星级筛选面板
- `TagSelector`: 标签选择器
- `HotelCard`: 酒店信息卡片

## 🔧 配置说明

### 环境变量
在`.env`文件中配置：
```bash
API_BASE_URL=http://localhost:3000
DEFAULT_CITY=上海
```

### 路由配置
使用Expo Router的文件系统路由：
- `app/index.tsx` → `/`
- `app/list.tsx` → `/list`
- `app/hotels/[id].tsx` → `/hotels/123`

## 📊 性能优化

### 已实现的优化
- ✅ 虚拟列表渲染（FlatList）
- ✅ 图片懒加载
- ✅ 组件记忆化（useMemo, useCallback）
- ✅ 防抖搜索
- ✅ 分页加载

### 待优化项
- [ ] 图片压缩和CDN加速
- [ ] 数据缓存策略优化
- [ ] Bundle拆分和懒加载

## 🐛 常见问题

### 开发环境问题
1. **Metro打包失败**: 清除缓存 `npx react-native start --reset-cache`
2. **TypeScript类型错误**: 检查接口定义是否完整
3. **样式不生效**: 确认NativeWind配置正确

### 运行时问题
1. **API请求失败**: 检查后端服务是否启动，确认BASE_URL配置正确
2. **数据不更新**: 检查筛选条件和分页状态
3. **组件渲染异常**: 查看控制台错误信息

## 🤝 贡献指南

### 开发流程
1. Fork项目仓库
2. 创建功能分支 `git checkout -b feature/new-feature`
3. 提交更改 `git commit -am 'Add new feature'`
4. 推送到分支 `git push origin feature/new-feature`
5. 创建Pull Request

### 代码审查要点
- [ ] TypeScript类型是否完整
- [ ] 组件是否可复用
- [ ] 是否有必要的注释
- [ ] 是否符合项目规范
- [ ] 测试是否通过

## 📄 许可证

MIT License

## 📞 联系方式

如有问题，请提交Issue或联系项目维护者。