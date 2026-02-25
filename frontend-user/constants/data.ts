import { fetchCities, fetchTags, getFullImageUrl } from '../services/api';
import useFetch from '../services/useFetch';

// 城市数据Hook
export const useCities = () => {
  return useFetch<string[]>(fetchCities, true);
};

// 标签数据Hook
export const useTags = () => {
  return useFetch<string[]>(fetchTags, true);
};

// 城市数据服务类
class CityDataService {
  private cities: string[] | null = null;
  private loadingPromise: Promise<string[]> | null = null;

  public async getCities(): Promise<string[]> {
    if (this.cities) {
      return this.cities;
    }
    
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    
    this.loadingPromise = this.loadCities();
    this.cities = await this.loadingPromise;
    this.loadingPromise = null;
    return this.cities;
  }

  private async loadCities(): Promise<string[]> {
    try {
      const data = await fetchCities();
      return data;
    } catch (error) {
      console.error('Failed to load cities:', error);
      // 返回默认城市数据作为后备
      return ['北京', '上海', '广州', '深圳', '杭州', '成都'];
    }
  }
}

// 标签数据服务类
class TagDataService {
  private tags: string[] | null = null;
  private loadingPromise: Promise<string[]> | null = null;

  public async getTags(): Promise<string[]> {
    if (this.tags) {
      return this.tags;
    }
    
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    
    this.loadingPromise = this.loadTags();
    this.tags = await this.loadingPromise;
    this.loadingPromise = null;
    return this.tags;
  }

  private async loadTags(): Promise<string[]> {
    try {
      const data = await fetchTags();
      return data;
    } catch (error) {
      console.error('Failed to load tags:', error);
      // 返回默认标签数据作为后备
      return ["免费停车", "亲子", "机场附近", "宠物", "地铁附近", "景点附近"];
    }
  }
}

// 导出服务实例
export const cityDataService = new CityDataService();
export const tagDataService = new TagDataService();

// 酒店标签选项 - 静态后备数据
export const HOTEL_TAGS = [
  "免费停车", 
  "亲子", 
  "机场附近",
  "宠物", 
  "地铁附近", 
  "景点附近"
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