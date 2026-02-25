// hooks/useSearchFilters.ts
import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dateToString, stringToDate } from '@/utils/dateUtils';

/**
 * 搜索筛选状态管理Hook
 * 统一管理酒店搜索的各种筛选条件
 */

export interface SearchFilters {
  city: string;
  keyword: string;
  checkInDate: string;
  checkOutDate: string;
  starLevel?: number;
  minPrice?: number;
  maxPrice?: number;
  tags: string[];
}

const DEFAULT_FILTERS: SearchFilters = {
  city: '上海',
  keyword: '',
  checkInDate: '',
  checkOutDate: '',
  tags: []
};

export const useSearchFilters = (initialFilters?: Partial<SearchFilters>) => {
  const [filters, setFilters] = useState<SearchFilters>({ 
    ...DEFAULT_FILTERS, 
    ...initialFilters 
  });
  const [isLoading, setIsLoading] = useState(true);

  // 加载保存的筛选条件
  const loadSavedFilters = useCallback(async () => {
    try {
      const savedFilters = await AsyncStorage.getItem('searchFilters');
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        setFilters(prev => ({ ...prev, ...parsedFilters }));
      }
    } catch (error) {
      console.error('加载筛选条件失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 保存筛选条件
  const saveFilters = useCallback(async (newFilters: SearchFilters) => {
    try {
      await AsyncStorage.setItem('searchFilters', JSON.stringify(newFilters));
    } catch (error) {
      console.error('保存筛选条件失败:', error);
    }
  }, []);

  // 更新筛选条件
  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    setFilters(prev => {
      const newFilters = { ...prev, ...updates };
      saveFilters(newFilters);
      return newFilters;
    });
  }, [saveFilters]);

  // 重置筛选条件
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    AsyncStorage.removeItem('searchFilters');
  }, []);

  // 获取API参数
  const getApiParams = useCallback(() => {
    const params: any = {
      city: filters.city
    };
    
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.checkInDate) params.checkInDate = filters.checkInDate;
    if (filters.checkOutDate) params.checkOutDate = filters.checkOutDate;
    if (filters.starLevel) params.starLevel = filters.starLevel;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.tags.length > 0) params.tags = filters.tags;
    
    return params;
  }, [filters]);

  // 获取路由参数
  const getRouteParams = useCallback(() => {
    return getApiParams(); // API参数和路由参数结构相同
  }, [getApiParams]);

  // 获取筛选摘要文本
  const getFilterSummary = useCallback(() => {
    const summaries = [];
    if (filters.city) summaries.push(`城市: ${filters.city}`);
    if (filters.keyword) summaries.push(`关键词: ${filters.keyword}`);
    if (filters.starLevel) summaries.push(`${filters.starLevel}星级`);
    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice && filters.maxPrice) {
        summaries.push(`¥${filters.minPrice}-${filters.maxPrice}`);
      } else if (filters.minPrice) {
        summaries.push(`¥${filters.minPrice}以上`);
      } else if (filters.maxPrice) {
        summaries.push(`¥${filters.maxPrice}以下`);
      }
    }
    if (filters.checkInDate && filters.checkOutDate) {
      summaries.push(`入住: ${filters.checkInDate} 至 ${filters.checkOutDate}`);
    }
    if (filters.tags.length > 0) {
      summaries.push(`标签: ${filters.tags.join(', ')}`);
    }
    return summaries.join(' · ');
  }, [filters]);

  useEffect(() => {
    loadSavedFilters();
  }, [loadSavedFilters]);

  return {
    filters,
    isLoading,
    updateFilters,
    resetFilters,
    getApiParams,
    getRouteParams,
    getFilterSummary
  };
};