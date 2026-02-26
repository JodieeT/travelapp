# 易宿酒店预订平台 - 移动端用户应用

智慧出行酒店预订平台的移动端用户应用，为终端消费者提供便捷的酒店搜索、筛选和预订服务。

## 项目结构

```
frontend-user/
├── app/               # 应用页面路由
│   ├── _layout.tsx    # 应用布局配置
│   ├── index.tsx      # 首页（Banner展示）
│   ├── list.tsx       # 酒店列表页
│   └── hotels/        # 酒店详情页
├── components/        # 可复用组件
│   ├── Banner.tsx     # 首页Banner轮播
│   ├── SearchCard.tsx # 搜索卡片组件
│   ├── HotelCard.tsx  # 酒店卡片组件
│   ├── CitySelector.tsx # 城市选择器
│   └── ...            # 其他UI组件
├── constants/         # 静态数据常量
│   └── data.ts        # 城市、标签、价格等配置
├── services/          # 业务服务
│   ├── api.ts         # 后端API接口调用
│   └── useFetch.ts    # 自定义数据获取Hook
├── interfaces/        # TypeScript接口定义
└── types/             # 类型声明文件
```

## 核心功能

### 🏠 首页展示
- **Banner轮播**：展示精选酒店推荐
- **智能搜索**：快速定位目的地和日期
- **热门推荐**：基于地理位置的酒店推荐

### 🔍 酒店搜索与筛选
- **城市选择**：支持10+主要城市选择，集成GPS定位
- **日期选择**：直观的日历组件选择入住/退房日期
- **价格筛选**：多价格区间快速筛选
- **星级筛选**：1-5星级酒店分类查找
- **标签筛选**：按设施特色（WiFi、停车场等）筛选
- **关键词搜索**：支持酒店名称模糊搜索

### 📱 用户体验优化
- **响应式设计**：适配不同屏幕尺寸
- **流畅动画**：NativeWind + React Native Reanimated
- **离线缓存**：城市选择和搜索历史自动缓存
- **触觉反馈**：iOS Haptics增强交互体验

## 技术栈

### 核心框架
- **React Native** v0.81.5 - 跨平台移动应用开发
- **Expo** v54 - React Native开发工具链
- **TypeScript** v5.9 - 类型安全的JavaScript超集

### UI与样式
- **NativeWind** v4.2 - Tailwind CSS for React Native
- **Tailwind CSS** v3.4 - 实用优先的CSS框架
- **React Navigation** v7 - 移动端导航解决方案

### 核心功能库
- **React Native Calendars** - 日历选择组件
- **React Native Gesture Handler** - 手势识别
- **React Native Reanimated** - 高性能动画库
- **Expo Location** - 地理位置服务
- **Async Storage** - 本地数据持久化

## 快速开始

### 1. 安装依赖

```bash
cd frontend-user
npm install
```

### 2. 启动开发服务器

```bash
# 启动 Expo 开发服务器
npx expo start

# 或者直接在特定平台运行
npx expo start --android  # Android 模拟器
npx expo start --ios     # iOS 模拟器
npx expo start --web     # Web 浏览器
```

### 3. 在设备上预览

- **Expo Go App**：扫描二维码在真机上预览
- **模拟器**：使用Android Studio或Xcode模拟器
- **Web**：在浏览器中直接运行

## API 集成

### 后端接口配置

```typescript
// services/api.ts
export const BACKEND_CONFIG = {
    BASE_URL: 'http://localhost:3000', // 开发环境
    // BASE_URL: 'https://your-production-api.com', // 生产环境
}
```

### 主要API接口

- `GET /api/banners` - 获取首页Banner酒店
- `GET /api/hotels` - 酒店列表搜索（支持分页和筛选）
- `GET /api/hotels/:id` - 酒店详情
- `GET /api/cities` - 城市列表
- `GET /api/tags` - 酒店标签列表

### 数据转换处理

项目内置了完善的数据转换机制，自动处理：
- 图片URL标准化
- JSON字符串数组解析
- 价格计算和格式化
- 日期格式转换

## 组件开发指南

### 城市选择组件 (CitySelector)

```typescript
import CitySelector from '@/components/CitySelector';

<CitySelector 
  currentCity={selectedCity}
  onCityChange={setSelectedCity}
  showLocator={true} // 是否显示GPS定位
/>
```

### 日期选择组件 (DateRangePicker)

```typescript
import DateRangePicker from '@/components/DateRangePicker';

<DateRangePicker 
  checkInDate={checkIn}
  checkOutDate={checkOut}
  onDateChange={(dates) => {
    setCheckIn(dates.checkIn);
    setCheckOut(dates.checkOut);
  }}
/>
```

### 酒店卡片组件 (HotelCard)

```typescript
import HotelCard from '@/components/HotelCard';

<HotelCard 
  hotel={hotelData}
  onPress={() => router.push(`/hotels/${hotel.id}`)}
/>
```

## 数据管理

### 统一常量管理

所有静态数据集中在 `constants/data.ts` 管理：

```typescript
import { 
  CITIES, 
  STAR_OPTIONS, 
  PRICE_OPTIONS, 
  HOTEL_TAGS 
} from '@/constants/data';

// 使用示例
const CityList = () => (
  <FlatList data={CITIES} renderItem={renderCityItem} />
);
```

### 网络请求Hook

```typescript
import useFetch from '@/services/useFetch';
import { fetchHotels } from '@/services/api';

const HotelList = () => {
  const { data, loading, error } = useFetch(() => 
    fetchHotels(city, keyword, starLevel)
  );
  
  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;
  
  return <HotelListDisplay hotels={data?.list || []} />;
};
```

## 开发规范

### TypeScript 类型安全
- 所有组件Props必须明确定义接口
- 网络响应数据使用预定义的TypeScript接口
- 禁止使用隐式any类型

### 代码风格
- 使用ESLint进行代码质量检查
- 遵循React Native最佳实践
- 组件文件使用`.tsx`扩展名

### 样式规范
- 优先使用NativeWind的Tailwind类
- 复杂样式可以结合StyleSheet
- 响应式设计考虑不同屏幕尺寸

## 调试与测试

### 开发调试

```bash
# 启动带调试信息的开发服务器
npx expo start --dev-client

# 清除缓存重新构建
npx expo start -c
```

### 性能监控
- 使用React DevTools Profiler分析组件性能
- 监控网络请求响应时间
- 检查内存使用情况

## 部署发布

### 构建生产版本

```bash
# 构建Android APK
npx expo build:android

# 构建iOS IPA
npx expo build:ios

# 构建Web版本
npx expo build:web
```

### 发布到应用商店
- 配置应用图标和启动画面
- 设置应用元数据和截图
- 遵循各平台发布指南

## 项目特点

### 🚀 高性能
- 基于React Native原生渲染
- 虚拟列表优化长列表性能
- 图片懒加载和缓存机制

### 🎨 现代化UI
- Material Design设计语言
- 流畅的动画过渡效果
- 深色模式支持（可扩展）

### 🔧 易维护
- 模块化组件架构
- 统一的状态管理
- 完善的类型定义

### 📱 跨平台
- 一套代码多端运行
- 原生性能体验
- 平台特定优化

## 学习资源

- [Expo官方文档](https://docs.expo.dev/)
- [React Native官方文档](https://reactnative.dev/)
- [NativeWind文档](https://www.nativewind.dev/)
- [React Navigation文档](https://reactnavigation.org/)

## 社区支持

- [Expo社区论坛](https://forums.expo.dev/)
- [React Native社区](https://reactnative.dev/community)
- 项目GitHub Issues

---
*易宿酒店预订平台移动端 - 让旅行住宿更简单*