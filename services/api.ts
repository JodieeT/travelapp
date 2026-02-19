export const BACKEND_CONFIG = {
    BASE_URL: 'http://localhost:3000',
    headers:{
        accept: 'application/json',
    }
}

// 数据转换函数：处理字符串化的JSON数组
const transformHotelData = (hotels: any[]): HotelBanner[] => {
  return hotels.map(hotel => ({
    ...hotel,
    images: typeof hotel.images === 'string' 
      ? JSON.parse(hotel.images) 
      : hotel.images
  }));
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
    
    // 在这里进行数据转换
    const transformedData = transformHotelData(rawData);
    console.log('Transformed banners data:', transformedData);
    
    return transformedData;
}