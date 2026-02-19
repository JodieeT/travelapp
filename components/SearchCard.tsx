import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link } from 'expo-router'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TagSelector from './TagSelector';
import PriceStarFilter from './PriceStarFilter'; // 使用新的价格星级筛选组件

const tags = ["免费停车", "亲子", "机场附近","宠物", "地铁附近", "景点附近"];

// 城市数据
const cities = [
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

const SearchCard = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentCity, setCurrentCity] = useState<string>('上海');
  const [isCitySelectorVisible, setIsCitySelectorVisible] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isPriceStarFilterVisible, setIsPriceStarFilterVisible] = useState<boolean>(false); // 新增状态
  const [priceStarFilters, setPriceStarFilters] = useState({ // 新增筛选状态
    starRating: '',
    priceRange: ''
  });

  // 切换标签选中状态
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
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

  // 检查并请求位置权限
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('权限请求失败:', error);
      return false;
    }
  };

  // 获取当前位置
  const getCurrentLocation = async () => {
    try {
      // 先检查权限
      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        Alert.alert('权限不足', '请在设置中开启位置权限以使用定位功能');
        // 从缓存中获取上次定位的城市
        const cachedCity = await AsyncStorage.getItem('lastLocatedCity');
        if (cachedCity) {
          setCurrentCity(cachedCity);
        } else {
          setCurrentCity('上海'); // 默认城市
        }
        return;
      }

      setCurrentCity('定位中...');
      
      // 获取位置
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 反向地理编码获取城市名称
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const city = reverseGeocode[0].city || reverseGeocode[0].region || '未知城市';
        setCurrentCity(city);
        
        // 缓存定位结果
        await AsyncStorage.setItem('lastLocatedCity', city);
      } else {
        setCurrentCity('定位失败');
      }
    } catch (error) {
      console.error('定位失败:', error);
      setCurrentCity('定位失败');
      
      // 失败时从缓存获取
      const cachedCity = await AsyncStorage.getItem('lastLocatedCity');
      if (cachedCity) {
        setCurrentCity(cachedCity);
      } else {
        setCurrentCity('上海');
      }
    }
  };

  // 选择城市
  const selectCity = (cityName: string) => {
    setCurrentCity(cityName);
    setIsCitySelectorVisible(false);
  };

  // 打开城市选择器
  const openCitySelector = () => {
    setIsCitySelectorVisible(true);
  };

  // 关闭城市选择器
  const closeCitySelector = () => {
    setIsCitySelectorVisible(false);
  };

  // 打开价格星级筛选
  const openPriceStarFilter = () => {
    setIsPriceStarFilterVisible(true);
  };

  // 关闭价格星级筛选
  const closePriceStarFilter = () => {
    setIsPriceStarFilterVisible(false);
  };

  // 组件挂载时尝试获取位置
  useEffect(() => {
    const initializeLocation = async () => {
      // 首先尝试从缓存获取城市
      const cachedCity = await AsyncStorage.getItem('lastLocatedCity');
      if (cachedCity) {
        setCurrentCity(cachedCity);
      } else {
        // 如果没有缓存，尝试定位
        await getCurrentLocation();
      }
    };

    initializeLocation();
  }, []);

  return (
    <View className="mx-4 mt-4 p-4 bg-white rounded-2xl shadow-md">
      {/* 1️⃣ 城市 + 搜索 */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={openCitySelector}
            className="flex-row items-center"
          >
            <Text className="text-base font-semibold mr-1">{currentCity}</Text>
            <Text className="text-base">▾</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={getCurrentLocation}
            className="ml-3 px-2 py-1 bg-blue-100 rounded-full"
          >
            <Text className="text-blue-600 text-xs">定位</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          placeholder="位置/品牌/酒店"
          placeholderTextColor="grey"
          className="flex-1 ml-3 bg-gray-100 px-3 py-2 rounded-lg"
        />
      </View>
      
      {/* 2️⃣ 日期 */}
      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-700">01月09日 今天</Text>
        <Text className="text-gray-700">01月10日 明天</Text>
        <Text className="text-gray-400">共1晚</Text>
      </View>
      
      {/* 3️⃣ 价格/星级筛选 */}
      <TouchableOpacity 
        className="mb-3 p-3 bg-gray-50 rounded-lg"
        onPress={openPriceStarFilter}
      >
        <Text className="text-gray-700">{getPriceStarDisplayText()}</Text>
      </TouchableOpacity>
      
      {/* 4️⃣ 标签 */}
      <TagSelector tags={tags} selectedTags={selectedTags} onToggleTag={toggleTag} />
      
      {/* 5️⃣ 查询按钮 */}
      <Link href="/list" asChild>
        <TouchableOpacity className="bg-blue-500 py-3 rounded-xl items-center mt-4">
          <Text className="text-white font-semibold text-base">查询</Text>
        </TouchableOpacity>
      </Link>

      {/* 城市选择器模态框 */}
      <Modal
        visible={isCitySelectorVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeCitySelector}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-2xl p-4 max-h-96">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">选择城市</Text>
              <TouchableOpacity onPress={closeCitySelector}>
                <Text className="text-gray-500 text-lg">✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-3 px-4 border-b border-gray-100"
                  onPress={() => selectCity(item.name)}
                >
                  <Text className="text-base text-gray-800">{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* 价格星级筛选模态框 */}
      <PriceStarFilter
        isVisible={isPriceStarFilterVisible}
        onClose={closePriceStarFilter}
        onApply={handlePriceStarFilterApply}
        initialStarRating={priceStarFilters.starRating}
        initialPriceRange={priceStarFilters.priceRange}
      />
    </View>
  )
}

export default SearchCard