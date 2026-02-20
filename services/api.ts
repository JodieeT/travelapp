export const BACKEND_CONFIG = {
    BASE_URL: 'http://localhost:3000',
    headers:{
        accept: 'application/json',
    }
}

// 为banner专门的数据转换函数
const transformBannerData = (hotels: any[]): HotelBanner[] => {
  return hotels.map(hotel => ({
    id: hotel.id,
    name_cn: hotel.name_cn,
    name_en: hotel.name_en,
    city: hotel.city,
    star_level: hotel.star_level,
    images: typeof hotel.images === 'string' 
      ? JSON.parse(hotel.images) 
      : hotel.images
  }));
};

// 数据转换函数：处理字符串化的JSON数组并提取所需字段
const transformHotelData = (hotels: any[]): Hotel[] => {
  return hotels.map(hotel => ({
    id: hotel.id,
    name_cn: hotel.name_cn,
    name_en: hotel.name_en,
    city: hotel.city,
    address: hotel.address,
    star_level: hotel.star_level,
    open_date: hotel.open_date,
    images: typeof hotel.images === 'string' 
      ? JSON.parse(hotel.images) 
      : hotel.images,
    tags: typeof hotel.tags === 'string'
      ? JSON.parse(hotel.tags)
      : hotel.tags,
    facilities: typeof hotel.facilities === 'string'
      ? JSON.parse(hotel.facilities)
      : hotel.facilities,
    min_price: hotel.minPrice || hotel.min_price
  }));
};

// 酒店详情数据转换函数
const transformHotelDetailData = (hotelData: any): HotelDetail => {
  // 处理图片数组
  const images = typeof hotelData.images === 'string' 
    ? JSON.parse(hotelData.images) 
    : hotelData.images || [];
  
  // 处理设施数组
  const facilities = typeof hotelData.facilities === 'string'
    ? JSON.parse(hotelData.facilities)
    : hotelData.facilities || [];
  
  // 处理标签 - 可能是字符串或数组
  let tags: string[] = [];
  if (typeof hotelData.tags === 'string') {
    // 如果是字符串格式的标签
    tags = [hotelData.tags];
  } else if (Array.isArray(hotelData.tags)) {
    tags = hotelData.tags;
  }
  
  // 转换房间数据并计算最低价格
  const rooms: Room[] = hotelData.Rooms?.map((room: any) => ({
    id: room.id,
    type_name: room.type_name,
    base_price: room.base_price
  })) || [];
  
  // 计算最低价格
  const min_price = rooms.length > 0 
    ? Math.min(...rooms.map(room => room.base_price))
    : 0;

  return {
    id: hotelData.id,
    name_cn: hotelData.name_cn,
    name_en: hotelData.name_en,
    city: hotelData.city,
    address: hotelData.address,
    star_level: hotelData.star_level,
    open_date: hotelData.open_date,
    images: images,
    tags: tags,
    facilities: facilities,
    rooms: rooms,
    min_price: min_price
  };
};

export const fetchBanners = async(): Promise<HotelBanner[]> => {
    const endpoint = `${BACKEND_CONFIG.BASE_URL}/api/banners`;
    console.log('Fetching banners from:', endpoint);
    const response = await fetch(endpoint,{
        method: 'GET',
        headers: BACKEND_CONFIG.headers,
    });

    console.log('Response status:', response.status);
    if(!response.ok){
        throw new Error(`Failed to fetch banners: ${response.statusText}`);
    }

    const rawData = await response.json();
    console.log('Raw banners data received:', rawData);
    
    // 使用banner专用的转换函数
    const transformedData = transformBannerData(rawData);
    console.log('Transformed banners data:', transformedData);
    
    return transformedData;
}

export const fetchHotels = async(
  city?: string,
  keyword?: string,
  starLevel?: number,
  minPrice?: number,
  maxPrice?: number,
  tags?: string[],
  page: number = 1,
  limit: number = 10
): Promise<HotelListResponse> => {
  // 构建查询参数
  const params = new URLSearchParams();
  
  if (city) params.append('city', city);
  if (keyword) params.append('keyword', keyword);
  if (starLevel !== undefined) params.append('star_level', starLevel.toString());
  if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
  if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
  if (tags && tags.length > 0) params.append('tags', tags.join(','));
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const endpoint = `${BACKEND_CONFIG.BASE_URL}/api/hotels?${params.toString()}`;
  console.log('Fetching hotels from:', endpoint);
  
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: BACKEND_CONFIG.headers,
  });

  console.log('Response status:', response.status);
  if (!response.ok) {
    throw new Error(`Failed to fetch hotels: ${response.statusText}`);
  }

  const rawData = await response.json();
  console.log('Raw hotels data received:', rawData);
  
  // 转换酒店数据
  const transformedList = transformHotelData(rawData.list);
  
  const result: HotelListResponse = {
    total: rawData.total,
    list: transformedList
  };
  
  console.log('Transformed hotels data:', result);
  return result;
}

export const fetchHotelDetail = async(id: string): Promise<HotelDetail | null> => {
  const endpoint = `${BACKEND_CONFIG.BASE_URL}/api/hotels/${id}`;
  console.log('Fetching hotel detail from:', endpoint);
  
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: BACKEND_CONFIG.headers,
  });

  console.log('Response status:', response.status);
  
  if (!response.ok) {
    if (response.status === 404) {
      console.log('Hotel not found');
      return null;
    }
    throw new Error(`Failed to fetch hotel detail: ${response.statusText}`);
  }

  const rawData = await response.json();
  console.log('Raw hotel detail data received:', rawData);
  
  // 使用酒店详情专用的转换函数
  const transformedData = transformHotelDetailData(rawData);
  console.log('Transformed hotel detail data:', transformedData);
  
  return transformedData;
};
