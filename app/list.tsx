import { View, FlatList, Text, TextInput, TouchableOpacity } from "react-native";
import HeaderBar from "@/components/HeaderBar";
import HotelCard from "@/components/HotelCard";
import useFetch from "@/services/useFetch";
import { fetchHotels } from "@/services/api";
import { useLocalSearchParams } from "expo-router";
import SearchCard from "@/components/SearchCard";
import { use, useEffect, useState } from "react";
import CitySelector from "@/components/CitySelector";
import DateRangePicker from "@/components/DateRangePicker";
import PriceStarFilter from "@/components/PriceStarFilter"; // 添加价格星级筛选组件导入
import TagSelector from "@/components/TagSelector";

export default function ListPage() {
  // 获取路由参数 - 包括日期参数
  const params = useLocalSearchParams();
  const { city, keyword, starLevel, minPrice, maxPrice, tags, checkInDate, checkOutDate } = params;
  
  // 创建 state 来管理搜索参数
  const [searchCity, setSearchCity] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchStarLevel, setSearchStarLevel] = useState<number | undefined>(undefined);
  const [searchMinPrice, setSearchMinPrice] = useState<number | undefined>(undefined);
  const [searchMaxPrice, setSearchMaxPrice] = useState<number | undefined>(undefined);
  const [searchCheckInDate, setSearchCheckInDate] = useState('');
  const [searchCheckOutDate, setSearchCheckOutDate] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);
  
  // 添加分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  
  // 添加价格星级筛选相关状态
  const [isPriceStarFilterVisible, setIsPriceStarFilterVisible] = useState<boolean>(false);
  const [priceStarFilters, setPriceStarFilters] = useState({
    starRating: starLevel ? starLevel.toString() : '',
    priceRange: ''
  });

  // 当路由参数变化时更新 state
  useEffect(() => {
    setSearchCity(city as string || '');
    setSearchKeyword(keyword as string || '');
    setSearchStarLevel(starLevel ? parseInt(starLevel as string) : undefined);
    setSearchMinPrice(minPrice ? parseInt(minPrice as string) : undefined);
    setSearchMaxPrice(maxPrice ? parseInt(maxPrice as string) : undefined);
    setSearchCheckInDate(checkInDate as string || '');
    setSearchCheckOutDate(checkOutDate as string || '');
    setSearchTags(tags ? (Array.isArray(tags) ? tags : [tags as string]) : []);
    // 同步价格星级筛选状态
    setPriceStarFilters({
      starRating: starLevel ? starLevel.toString() : '',
      priceRange: ''
    });
    // 重置分页状态
    setCurrentPage(1);
    setHasMore(true);
    setAllHotels([]);
  }, [city, keyword, starLevel, minPrice, maxPrice, tags, checkInDate, checkOutDate]);

  
  console.log("API参数:", {
    city: searchCity,
    keyword: searchKeyword,
    starLevel: searchStarLevel,
    minPrice: searchMinPrice,
    maxPrice: searchMaxPrice,
    checkInDate: searchCheckInDate,
    checkOutDate: searchCheckOutDate,
    tags: searchTags
  });

  // 处理上滑加载更多
  const loadMoreHotels = async () => {
    // 添加额外的保护条件：确保不是初始加载且有数据
    if (!hasMore || isLoadingMore || allHotels.length === 0) return;
    
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      const moreData = await fetchHotels(
        searchCity,
        searchKeyword,
        searchStarLevel,
        searchMinPrice,
        searchMaxPrice,
        searchTags,
        searchCheckInDate,
        searchCheckOutDate,
        nextPage,
        10
      );
      
      if (moreData.list && moreData.list.length > 0) {
        setAllHotels(prev => {
          const newHotels = [...prev, ...moreData.list];
          setHasMore(newHotels.length < moreData.total);
          return newHotels;
        });
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('加载更多酒店失败:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 直接使用参数调用API，包含日期参数
  const {data: hotelList, loading, error, refetch} = useFetch(() => 
    fetchHotels(
      searchCity,
      searchKeyword,
      searchStarLevel,
      searchMinPrice,
      searchMaxPrice,
      searchTags,
      searchCheckInDate,
      searchCheckOutDate,
      1, // 初始页码
      10 // 每页数量
    ), !!searchCity || !!searchKeyword || searchStarLevel !== undefined || 
       searchMinPrice !== undefined || searchMaxPrice !== undefined || 
       searchTags.length > 0 || !!searchCheckInDate || !!searchCheckOutDate
  );

  // 当初始数据加载完成时，更新allHotels状态
  useEffect(() => {
    if (hotelList?.list) {
      setAllHotels(hotelList.list);
      setHasMore(hotelList.list.length < hotelList.total);
    }
  }, [hotelList]);

  // 优化搜索参数变化时的重新获取逻辑
  useEffect(() => {
    // 只有当已经有数据且参数真正发生变化时才重新获取
    if (hotelList) {
      const timeoutId = setTimeout(async () => {
        await refetch();
      }, 1000); // 增加延迟到1秒
      return () => clearTimeout(timeoutId);
    }
  }, [searchCity,
      searchKeyword,
      searchStarLevel,
      searchMinPrice,
      searchMaxPrice,
      searchTags,
      searchCheckInDate,
      searchCheckOutDate]);
  
  console.log("hotelList", hotelList);
  // 构建显示用的筛选条件文本
  const getFilterSummary = () => {
    const summaries = [];
    if (searchCity) summaries.push(`城市: ${searchCity}`);
    if (searchKeyword) summaries.push(`关键词: ${searchKeyword}`);
    if (searchStarLevel) summaries.push(`${searchStarLevel}星级`);
    if (searchMinPrice || searchMaxPrice) {
      if (searchMinPrice && searchMaxPrice) {
        summaries.push(`¥${searchMinPrice}-${searchMaxPrice}`);
      } else if (searchMinPrice) {
        summaries.push(`¥${searchMinPrice}以上`);
      } else if (searchMaxPrice) {
        summaries.push(`¥${searchMaxPrice}以下`);
      }
    }
    if (searchCheckInDate && searchCheckOutDate) {
      summaries.push(`入住: ${searchCheckInDate} 至 ${searchCheckOutDate}`);
    }
    if (searchTags && searchTags.length > 0) {
      summaries.push(`标签: ${searchTags.join(', ')}`);
    }
    return summaries.join(' · ');
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
  
  // 打开价格星级筛选
  const openPriceStarFilter = () => {
    setIsPriceStarFilterVisible(true);
  };

  // 关闭价格星级筛选
  const closePriceStarFilter = () => {
    setIsPriceStarFilterVisible(false);
  };

  // 处理标签切换
  const handleTagToggle = (tag: string) => {
    setSearchTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  // 处理价格星级筛选应用
  const handlePriceStarFilterApply = (filters: { starRating: string; priceRange: string }) => {
    setPriceStarFilters(filters);
    // 更新对应的搜索状态
    if (filters.starRating) {
      setSearchStarLevel(parseInt(filters.starRating));
    } else {
      setSearchStarLevel(undefined);
    }
    console.log('价格星级筛选:', filters);
  };
  
  // 渲染空状态
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-gray-500 text-lg mb-2">暂无符合条件的酒店</Text>
      <Text className="text-gray-400 text-sm">请尝试调整筛选条件</Text>
    </View>
  );
  
  // 渲染错误状态
  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-red-500 text-lg mb-2">加载失败</Text>
      <Text className="text-gray-400 text-sm mb-4">{error?.message || '请稍后重试'}</Text>
      <Text 
        className="text-blue-500 text-sm underline"
        onPress={refetch}
      >
        点击重试
      </Text>
    </View>
  );
  
  // 渲染加载状态
  const renderLoadingState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-gray-500 text-lg">加载中...</Text>
    </View>
  );

    const handleDateChange = (startDate: Date, endDate: Date) => {
    // 将Date对象转换为字符串格式 YYYY-MM-DD
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    setSearchCheckInDate(startDateStr);
    setSearchCheckOutDate(endDateStr);
  };
  
  // 将字符串日期转换为Date对象用于DateRangePicker
  const convertStringToDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    return new Date(dateString);
  };
  
  return (

    
    <View className="flex-1 bg-gray-100">
      
      {/* 筛选摘要显示 */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <CitySelector 
          currentCity={searchCity}
          onCityChange={setSearchCity}
        />
        <TextInput
                placeholder="位置/品牌/酒店"
                placeholderTextColor="grey"
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                className="flex-1 ml-3 bg-gray-100 px-3 py-2 rounded-lg"
        />
        <DateRangePicker
        startDate={convertStringToDate(searchCheckInDate)}
        endDate={convertStringToDate(searchCheckOutDate)}
        onDateChange={handleDateChange}
        className="mb-3"
        />
        <TouchableOpacity 
                className="mb-3 p-3 bg-gray-50 rounded-lg"
                onPress={openPriceStarFilter}
              >
                <Text className="text-gray-700">{getPriceStarDisplayText()}</Text>
        </TouchableOpacity>
        <TagSelector 
          selectedTags={searchTags} 
          onToggleTag={handleTagToggle} 
        />
        {hotelList && (
          <Text className="text-gray-600 text-sm" numberOfLines={1}>
            共找到 {hotelList.list?.length || 0} 家酒店
          </Text>
        )}
      </View>
      

      
      {loading && renderLoadingState()}
      {error && renderErrorState()}
      {!loading && !error && (
        <FlatList
          data={allHotels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HotelCard 
              item={item} 
              checkInDate={searchCheckInDate}
              checkOutDate={searchCheckOutDate}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreHotels}
          onEndReachedThreshold={0.5} // 增加阈值到50%，减少误触发
          ListFooterComponent={
            isLoadingMore ? (
              <View className="py-4 items-center">
                <Text className="text-gray-500">加载中...</Text>
              </View>
            ) : !hasMore && allHotels.length > 0 ? (
              <View className="py-4 items-center">
                <Text className="text-gray-400 text-sm">没有更多酒店了</Text>
              </View>
            ) : null
          }
        />
      )}
      
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
}