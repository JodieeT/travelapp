import { View, FlatList, Text, TextInput, TouchableOpacity } from "react-native";
import HotelCard from "@/components/HotelCard";
import useFetch from "@/services/useFetch";
import { fetchHotels } from "@/services/api";
import { useLocalSearchParams } from "expo-router";
import SearchCard from "@/components/SearchCard";
import { useEffect, useState } from "react";
import CitySelector from "@/components/CitySelector";
import DateRangePicker from "@/components/DateRangePicker";
import PriceStarFilter from "@/components/PriceStarFilter";
import TagSelector from "@/components/TagSelector";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/StatusComponents";
import { dateToString, stringToDate } from "@/utils/dateUtils";

export default function ListPage() {
  // 获取路由参数
  const params = useLocalSearchParams();
  const { city, keyword, starLevel, minPrice, maxPrice, tags, checkInDate, checkOutDate } = params;
  
  // 使用统一的搜索筛选Hook
  const {
    filters,
    updateFilters,
    getApiParams,
    getRouteParams,
    getFilterSummary
  } = useSearchFilters({
    city: city as string || '',
    keyword: keyword as string || '',
    checkInDate: checkInDate as string || '',
    checkOutDate: checkOutDate as string || '',
    starLevel: starLevel ? parseInt(starLevel as string) : undefined,
    minPrice: minPrice ? parseInt(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
    tags: tags ? (Array.isArray(tags) ? tags : [tags as string]) : []
  });

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  
  // 价格星级筛选相关状态
  const [isPriceStarFilterVisible, setIsPriceStarFilterVisible] = useState<boolean>(false);
  const [priceStarFilters, setPriceStarFilters] = useState({
    starRating: starLevel ? starLevel.toString() : '',
    priceRange: ''
  });

  
  // 处理上滑加载更多
  const loadMoreHotels = async () => {
    if (!hasMore || isLoadingMore || allHotels.length === 0) return;
    
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      const moreData = await fetchHotels(
        filters.city,
        filters.keyword,
        filters.starLevel,
        filters.minPrice,
        filters.maxPrice,
        filters.tags,
        filters.checkInDate,
        filters.checkOutDate,
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

  // 获取数据
  const {data: hotelList, loading, error, refetch} = useFetch(() => 
    fetchHotels(
      filters.city,
      filters.keyword,
      filters.starLevel,
      filters.minPrice,
      filters.maxPrice,
      filters.tags,
      filters.checkInDate,
      filters.checkOutDate,
      1,
      10
    ), !!filters.city || !!filters.keyword || filters.starLevel !== undefined || 
       filters.minPrice !== undefined || filters.maxPrice !== undefined || 
       filters.tags.length > 0 || !!filters.checkInDate || !!filters.checkOutDate
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
    if (hotelList) {
      const timeoutId = setTimeout(async () => {
        await refetch();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [
    filters.city,
    filters.keyword,
    filters.starLevel,
    filters.minPrice,
    filters.maxPrice,
    filters.tags,
    filters.checkInDate,
    filters.checkOutDate
  ]);

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
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags: newTags });
  };

  // 处理价格星级筛选应用
  const handlePriceStarFilterApply = (filters: { starRating: string; priceRange: string }) => {
    setPriceStarFilters(filters);
    if (filters.starRating) {
      updateFilters({ starLevel: parseInt(filters.starRating) });
    } else {
      updateFilters({ starLevel: undefined });
    }
  };

  // 处理日期变化
  const handleDateChange = (startDate: Date, endDate: Date) => {
    updateFilters({
      checkInDate: dateToString(startDate),
      checkOutDate: dateToString(endDate)
    });
  };
  
  return (
    <View className="flex-1 bg-gray-100">
      
      {/* 筛选摘要显示 - 优化布局间距 */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        {/* 城市选择和搜索框 - 单独一行 */}
        <View className="flex-row items-center mb-4">
          <CitySelector 
            currentCity={filters.city}
            onCityChange={(city) => updateFilters({ city })}
          />
          <TextInput
            placeholder="位置/品牌/酒店"
            placeholderTextColor="grey"
            value={filters.keyword}
            onChangeText={(keyword) => updateFilters({ keyword })}
            className="flex-1 ml-3 bg-gray-100 px-3 py-2 rounded-lg"
          />
        </View>
        
        {/* 日期选择器 - 单独一行 */}
        <View className="mb-4">
          <DateRangePicker
            startDate={stringToDate(filters.checkInDate)}
            endDate={stringToDate(filters.checkOutDate)}
            onDateChange={handleDateChange}
          />
        </View>
        
        {/* 价格/星级筛选 - 单独一行 */}
        <View className="mb-4">
          <TouchableOpacity 
            className="p-3 bg-gray-50 rounded-lg"
            onPress={openPriceStarFilter}
          >
            <Text className="text-gray-700">{getPriceStarDisplayText()}</Text>
          </TouchableOpacity>
        </View>
        
        {/* 标签选择器 - 单独一行 */}
        <View className="mb-3">
          <TagSelector 
            selectedTags={filters.tags} 
            onToggleTag={handleTagToggle} 
          />
        </View>
        
        {/* 结果统计 */}
        {hotelList && (
          <Text className="text-gray-600 text-sm" numberOfLines={1}>
            共找到 {hotelList.list?.length || 0} 家酒店
          </Text>
        )}
      </View>
      
      {/* 内容区域 */}
      {loading && <LoadingState />}
      {error && <ErrorState onRetry={refetch} />}
      {!loading && !error && (
        <FlatList
          data={allHotels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HotelCard 
              item={item} 
              checkInDate={filters.checkInDate}
              checkOutDate={filters.checkOutDate}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreHotels}
          onEndReachedThreshold={0.5}
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