import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link } from 'expo-router'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TagSelector from './TagSelector';
import PriceStarFilter from './PriceStarFilter';
import DateRangePicker from './DateRangePicker';
import CitySelector from './CitySelector';
import { 
  HOTEL_TAGS, 
  DEFAULT_CITY, 
  LOCATION_CACHE_KEY,
  DEFAULT_CHECK_IN_DAYS,
  DEFAULT_CHECK_OUT_DAYS
} from '../constants/data';

const SearchCard = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentCity, setCurrentCity] = useState<string>(DEFAULT_CITY);
  const [keyword, setKeyword] = useState<string>(''); // 添加keyword状态
  const [isPriceStarFilterVisible, setIsPriceStarFilterVisible] = useState<boolean>(false); // 新增状态
  const [priceStarFilters, setPriceStarFilters] = useState({ // 新增筛选状态
    starRating: '',
    priceRange: ''
  });
  // 新增日期状态
  const [checkInDate, setCheckInDate] = useState<Date>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + DEFAULT_CHECK_OUT_DAYS);
    return tomorrow;
  });

  // 切换标签选中状态
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 处理日期选择变化
  const handleDateChange = (startDate: Date, endDate: Date) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
  };

  // 处理价格星级筛选应用
  const handlePriceStarFilterApply = (filters: { starRating: string; priceRange: string }) => {
    setPriceStarFilters(filters);
    console.log('价格星级筛选:', filters);
    // 这里可以添加实际的筛选逻辑
  };

  // 获取当前筛选显示文本
  const getPriceStarDisplayText = () => {
    const { starRating, priceRange } = priceStarFilters;
    const starLabel = starRating ? `${starRating}星级` : '';
    const priceLabel = priceRange ? `¥${priceRange}` : '';
    
    if (!starLabel && !priceLabel) {
      return '价格/星级';
    }
    
    const parts = [];
    if (starLabel) parts.push(starLabel);
    if (priceLabel) parts.push(priceLabel);
    
    return parts.join(' · ');
  };

  // 获取API参数对象
  const getApiParams = () => {
    const params: any = {
      city: currentCity
    };
    
    if (keyword) params.keyword = keyword;
    
    // 添加日期参数
    params.checkInDate = checkInDate.toISOString().split('T')[0];
    params.checkOutDate = checkOutDate.toISOString().split('T')[0];
    
    // 处理星级
    if (priceStarFilters.starRating) {
      params.starLevel = parseInt(priceStarFilters.starRating);
    }
    
    // 处理价格范围
    if (priceStarFilters.priceRange) {
      const priceRange = priceStarFilters.priceRange;
      if (priceRange.includes('-')) {
        const [min, max] = priceRange.split('-');
        if (min) params.minPrice = parseInt(min);
        if (max) params.maxPrice = parseInt(max);
      } else {
        params.minPrice = parseInt(priceRange);
      }
    }
    
    // 处理标签
    if (selectedTags.length > 0) {
      params.tags = selectedTags;
    }
    
    return params;
  };

  // 获取路由参数对象（用于导航）- 保持与API参数一致
  const getRouteParams = () => {
    const routeParams: any = {
      city: currentCity
    };
    
    if (keyword) routeParams.keyword = keyword;
    
    // 添加日期参数
    routeParams.checkInDate = checkInDate.toISOString().split('T')[0];
    routeParams.checkOutDate = checkOutDate.toISOString().split('T')[0];
    
    // starLevel应该传递数值而不是字符串
    if (priceStarFilters.starRating) {
      routeParams.starLevel = parseInt(priceStarFilters.starRating);
    }
    
    // priceRange需要分解为minPrice和maxPrice
    if (priceStarFilters.priceRange) {
      const range = priceStarFilters.priceRange;
      if (range.includes('-')) {
        const [min, max] = range.split('-');
        if (min) routeParams.minPrice = parseInt(min);
        if (max) routeParams.maxPrice = parseInt(max);
      } else {
        routeParams.minPrice = parseInt(range);
      }
    }
    
    // tags应该传递数组而不是字符串
    if (selectedTags.length > 0) {
      routeParams.tags = selectedTags;
    }
    
    return routeParams;
  };

  // 打开价格星级筛选
  const openPriceStarFilter = () => {
    setIsPriceStarFilterVisible(true);
  };

  // 关闭价格星级筛选
  const closePriceStarFilter = () => {
    setIsPriceStarFilterVisible(false);
  };

  // 组件挂载时初始化城市
  useEffect(() => {
    const initializeCity = async () => {
      // 首先尝试从缓存获取城市
      const cachedCity = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
      if (cachedCity) {
        setCurrentCity(cachedCity);
      } else {
        // 如果没有缓存，默认设置为上海
        setCurrentCity(DEFAULT_CITY);
      }
    };

    initializeCity();
  }, []);

  return (
    <View className="mx-0 mt-0 p-4 bg-white rounded-2xl shadow-lg">
      {/* 1️⃣ 城市 + 搜索 */}
      <View className="flex-row items-center justify-between mb-3">
        <CitySelector 
          currentCity={currentCity}
          onCityChange={setCurrentCity}
        />
        
        <TextInput
          placeholder="位置/品牌/酒店"
          placeholderTextColor="grey"
          value={keyword}
          onChangeText={setKeyword}
          className="flex-1 ml-3 bg-gray-100 px-3 py-2 rounded-lg"
        />
      </View>
      
      {/* 2️⃣ 日期选择器 */}
      <DateRangePicker
        startDate={checkInDate}
        endDate={checkOutDate}
        onDateChange={handleDateChange}
        className="mb-3"
      />
      
      {/* 3️⃣ 价格/星级筛选 */}
      <TouchableOpacity 
        className="mb-3 p-3 bg-gray-50 rounded-lg"
        onPress={openPriceStarFilter}
      >
        <Text className="text-gray-700">{getPriceStarDisplayText()}</Text>
      </TouchableOpacity>
      
      {/* 4️⃣ 标签 */}
      <TagSelector selectedTags={selectedTags} onToggleTag={toggleTag} />
      
      {/* 5️⃣ 查询按钮 - 传递筛选参数 */}
      <Link 
        href={{
          pathname: "/list",
          params: getRouteParams()
        }} 
        asChild
      >
        <TouchableOpacity className="bg-blue-500 py-3 rounded-xl items-center mt-4">
          <Text className="text-white font-semibold text-base">查询</Text>
        </TouchableOpacity>
      </Link>

      {/* 价格星级筛选模态框 */}
      <PriceStarFilter
        isVisible={isPriceStarFilterVisible}
        onClose={closePriceStarFilter}
        onApply={handlePriceStarFilterApply}
        initialStarRating={priceStarFilters.starRating}
        initialPriceRange={priceStarFilters.priceRange}
      />
    </View>
  );
};

export default SearchCard;