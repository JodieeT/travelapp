import { View, Text, TouchableOpacity, Modal, FlatList, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { 
  DEFAULT_CITY, 
  LOCATION_CACHE_KEY, 
  LOCATION_TIMEOUT
} from '../constants/data'
import { useCities } from '../constants/data'
import { cityDataService } from '../constants/data'

interface City {
  id: string;
  name: string;
}

interface CitySelectorProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  showLocator?: boolean;
}

const CitySelector: React.FC<CitySelectorProps> = ({ 
  currentCity, 
  onCityChange, 
  showLocator = true 
}) => {
  const [isCitySelectorVisible, setIsCitySelectorVisible] = useState<boolean>(false);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const { data: cities = [], loading, error } = useCities();

  // 初始化城市列表
  useEffect(() => {
    const initializeCities = async () => {
      try {
        const cityList = await cityDataService.getCities();
        console.log('Initialized cities:', cityList);
      } catch (err) {
        console.error('Failed to initialize cities:', err);
      }
    };
    
    initializeCities();
  }, []);

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
        const cachedCity = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
        if (cachedCity) {
          onCityChange(cachedCity);
        } else {
          onCityChange(DEFAULT_CITY); // 默认城市
        }
        return;
      }

      onCityChange('定位中...');
      
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
        if(city.endsWith('市')) {
          onCityChange(city.slice(0, -1)); // 去掉末尾的“市”字
        }else{
          onCityChange(city);
        }
        
        // 缓存定位结果
        await AsyncStorage.setItem(LOCATION_CACHE_KEY, city);
      } else {
        onCityChange('定位失败');
      }
    } catch (error) {
      console.error('定位失败:', error);
      onCityChange('定位失败');
      
      // 失败时从缓存获取
      const cachedCity = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
      if (cachedCity) {
        onCityChange(cachedCity);
      } else {
        onCityChange(DEFAULT_CITY);
      }
    }
  };

  // 选择城市
  const selectCity = (cityName: string) => {
    onCityChange(cityName);
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

  return (
    <>
      <View className="flex-row items-center">
        <TouchableOpacity 
          onPress={openCitySelector}
          className="flex-row items-center"
        >
          <Text className="text-base font-semibold mr-1">{currentCity}</Text>
          <Text className="text-base">▾</Text>
        </TouchableOpacity>
        
        {showLocator && (
          <TouchableOpacity 
            onPress={getCurrentLocation}
            className="ml-3 px-2 py-1 bg-blue-100 rounded-full"
          >
            <Text className="text-blue-600 text-xs">定位</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 城市选择模态框 */}
      <Modal
        visible={isCitySelectorVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeCitySelector}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl p-4 max-h-[50%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold">选择城市</Text>
              <TouchableOpacity onPress={closeCitySelector}>
                <Text className="text-gray-500 text-lg">✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* 移除外层 ScrollView，直接使用 FlatList */}
            <FlatList
              data={(cities || []).map((city, index) => ({ id: index.toString(), name: city }))}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectCity(item.name)}
                  className={`py-3 px-4 ${
                    currentCity === item.name 
                      ? 'bg-blue-100 border-l-4 border-blue-500' 
                      : 'border-b border-gray-100'
                  }`}
                >
                  <Text className={`${
                    currentCity === item.name 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-700'
                  }`}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              // 添加必要的 FlatList 属性
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CitySelector;