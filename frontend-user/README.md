# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Data Management

### 统一数据常量管理

为了提高代码的可维护性和一致性，项目采用了统一的数据常量管理模式：

#### 常量文件位置
`constants/data.ts` - 集中管理所有静态数据和配置常量

#### 管理的数据类型
- **城市数据** (`CITIES`) - 支持的主要城市列表
- **星级选项** (`STAR_OPTIONS`) - 酒店星级筛选选项
- **价格范围** (`PRICE_OPTIONS`) - 价格区间筛选选项
- **酒店标签** (`HOTEL_TAGS`) - 酒店特色标签
- **默认配置** - 默认城市、日期、筛选条件等
- **系统常量** - 缓存键名、超时时间、模态框配置等

#### 使用示例

```typescript
// 导入常量
import { 
  CITIES, 
  STAR_OPTIONS, 
  PRICE_OPTIONS, 
  DEFAULT_CITY 
} from '../constants/data';

// 在组件中使用
const MyComponent = () => {
  const [city, setCity] = useState<string>(DEFAULT_CITY);
  
  return (
    <FlatList
      data={CITIES}
      // ... 其他属性
    />
  );
};
```

#### 优势
- ✨ **统一管理**: 所有静态数据集中在一个文件中
- 🔧 **易于维护**: 修改数据只需在一个地方进行
- 🔄 **一致性保证**: 确保整个应用使用相同的数据源
- 📈 **扩展性强**: 添加新城市或选项非常简单
- 🎯 **类型安全**: TypeScript 提供完整的类型检查

## Components

### CitySelector 组件

这是一个可复用的城市选择组件，支持以下功能：

#### 功能特性
- 🌍 城市列表选择（支持10个主要城市）
- 📍 GPS定位获取当前位置
- 💾 自动缓存最近定位结果
- 🎨 美观的模态框界面
- 🔧 灵活的配置选项

#### 使用方法

```typescript
import CitySelector from '../components/CitySelector';

// 基础用法
<CitySelector 
  currentCity={selectedCity}
  onCityChange={setSelectedCity}
/>

// 不带定位功能的用法
<CitySelector 
  currentCity={selectedCity}
  onCityChange={setSelectedCity}
  showLocator={false}
/>
```

#### Props 说明

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| currentCity | string | 是 | - | 当前选中的城市 |
| onCityChange | (city: string) => void | 是 | - | 城市变更回调函数 |
| showLocator | boolean | 否 | true | 是否显示定位按钮 |

#### 使用示例

详细使用示例请参考 `components/CitySelectorExample.tsx` 文件。

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.