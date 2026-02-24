// 城市数据
export const CITIES = [
  { id: '1', name: '北京' },
  { id: '2', name: '上海' },
  { id: '3', name: '广州' },
  { id: '4', name: '深圳' },
  { id: '5', name: '杭州' },
  { id: '6', name: '成都' },
  { id: '7', name: '南京' },
  { id: '8', name: '武汉' },
  { id: '9', name: '西安' },
  { id: '10', name: '重庆' },
];

// 酒店星级选项
export const STAR_OPTIONS = [
  { id: '1', label: '不限', value: '' },
  { id: '2', label: '二星级', value: '2' },
  { id: '3', label: '三星级', value: '3' },
  { id: '4', label: '四星级', value: '4' },
  { id: '5', label: '五星级', value: '5' },
];

// 价格范围选项
export const PRICE_OPTIONS = [
  { id: '1', label: '不限', value: '' },
  { id: '2', label: '¥0-100', value: '0-100' },
  { id: '3', label: '¥100-300', value: '100-300' },
  { id: '4', label: '¥300-500', value: '300-500' },
  { id: '5', label: '¥500+', value: '500+' },
];

// 酒店标签选项
export const HOTEL_TAGS = [
  "免费停车", 
  "亲子", 
  "机场附近",
  "宠物", 
  "地铁附近", 
  "景点附近"
];

// 默认城市
export const DEFAULT_CITY = '上海';

// 定位相关常量
export const LOCATION_CACHE_KEY = 'lastLocatedCity';
export const LOCATION_TIMEOUT = 10000; // 10秒超时

// 日期相关常量
export const DEFAULT_CHECK_IN_DAYS = 0; // 今天入住
export const DEFAULT_CHECK_OUT_DAYS = 1; // 明天离店
export const MAX_STAY_DAYS = 30; // 最大住宿天数

// 筛选相关常量
export const DEFAULT_STAR_RATING = '';
export const DEFAULT_PRICE_RANGE = '';

// 模态框相关常量
export const MODAL_ANIMATION_TYPE = 'slide';
export const MODAL_TRANSPARENT = true;