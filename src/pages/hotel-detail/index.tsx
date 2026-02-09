import { useRouter, navigateBack } from '@tarojs/taro'
import { View, Text, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import { useEffect, useMemo, useState } from 'react'
import type { Hotel, RoomType } from '../../types/hotel'
import RoomCard from '../../components/RoomCard'
import './index.scss'

const HotelDetail = () => {
  const router = useRouter()
  const [hotel, setHotel] = useState<Hotel | null>(null)

  const { id = '', checkIn = '', checkOut = '' } = router.params || {}

  useEffect(() => {
    if (!id) return
    // 简单 mock 一条详情
    const mockHotel: Hotel = {
      id,
      name: '易宿城市中心酒店',
      englishName: '',
      address: '示例市中心商圈 · 地铁口 100m',
      city: '示例市',
      star: 4,
      openDate: '2020-01-01',
      tags: ['亲子', '免费停车', '含早'],
      coverImage:
        'https://dimg04.c-ctrip.com/images/0201h120009v0t9nqD1C0_R_600_400_R5_D.jpg',
      images: [
        'https://dimg04.c-ctrip.com/images/0200s12000a7n1l3u8E6C_R_600_400_R5_D.jpg',
        'https://dimg04.c-ctrip.com/images/0205s12000a7n1m3u8B90_R_600_400_R5_D.jpg',
        'https://dimg04.c-ctrip.com/images/200l0g0000007sdsh3C28_R_600_400_R5_D.jpg'
      ],
      distanceDesc: '距市中心 1.2km',
      minPrice: 399,
      facilities: ['WiFi', '泳池', '健身房', '24小时前台'],
      roomTypes: [
        {
          id: 'r1',
          name: '高级大床房',
          bedType: '1 张 1.8m 大床',
          capacity: 2,
          price: 399,
          breakfastIncluded: true,
          cancellable: true
        },
        {
          id: 'r2',
          name: '豪华双床房',
          bedType: '2 张 1.2m 单床',
          capacity: 2,
          price: 459,
          breakfastIncluded: true,
          cancellable: false
        }
      ]
    }
    setHotel(mockHotel)
  }, [id])

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    return diff > 0 ? diff : 1
  }, [checkIn, checkOut])

  const sortedRooms: RoomType[] = useMemo(() => {
    if (!hotel) return []
    return [...hotel.roomTypes].sort((a, b) => a.price - b.price)
  }, [hotel])

  if (!hotel) {
    return <View className='page-hotel-detail'>加载中...</View>
  }

  return (
    <View className='page-hotel-detail'>
      <ScrollView className='detail-scroll' scrollY>
        <View className='detail-top'>
          <View className='detail-nav'>
            <Text className='detail-nav__back' onClick={() => navigateBack()}>
              返回
            </Text>
            <Text className='detail-nav__title' numberOfLines={1}>
              {hotel.name}
            </Text>
          </View>
          <Swiper
            className='detail-swiper'
            indicatorDots
            autoplay
            circular
            interval={4000}
          >
            {[hotel.coverImage, ...(hotel.images || [])].map(src => (
              <SwiperItem key={src}>
                <View className='detail-swiper__item'>
                  {/* 小程序里建议用 Image，这里简化为背景图容器 */}
                  <View
                    className='detail-swiper__bg'
                    style={{ backgroundImage: `url(${src})` }}
                  />
                </View>
              </SwiperItem>
            ))}
          </Swiper>
        </View>

        <View className='detail-banner'>
          <Text className='detail-banner__name'>{hotel.name}</Text>
          <Text className='detail-banner__star'>{hotel.star} 星级酒店</Text>
          <Text className='detail-banner__address'>{hotel.address}</Text>
          <View className='detail-tags'>
            {hotel.tags.map(tag => (
              <Text key={tag} className='detail-tag'>
                {tag}
              </Text>
            ))}
          </View>
        </View>

        <View className='detail-section detail-date'>
          <View>
            <Text className='detail-date__line'>
              入住 {checkIn || '请选择'} · 离店 {checkOut || '请选择'}
            </Text>
            <Text className='detail-date__sub'>共 {nights} 晚</Text>
          </View>
        </View>

        <View className='detail-section'>
          <Text className='detail-section__title'>房型与价格</Text>
          {sortedRooms.map(room => (
            <RoomCard key={room.id} room={room} nights={nights} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default HotelDetail