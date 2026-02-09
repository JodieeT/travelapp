import Taro, { useRouter, useReachBottom } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { useEffect, useMemo, useState } from 'react'
import type { Hotel } from '../../types/hotel'
import HotelCard from '../../components/HotelCard'
import './index.scss'

const HotelList = () => {
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [starFilter, setStarFilter] = useState<number | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [sortByPriceAsc, setSortByPriceAsc] = useState(true)

  const { city = '', checkIn = '', checkOut = '', keyword = '', tags = '' } = router.params || {}

  const loadData = (nextPage = 1) => {
    const mock: Hotel[] = Array.from({ length: 5 }).map((_, idx) => ({
      id: `${nextPage}-${idx + 1}`,
      name: `${city || '示例城市'}易宿精选酒店 ${idx + 1}`,
      englishName: '',
      address: `${city || '某市'}中心商圈 · 地铁口附近`,
      city: city || '示例城市',
      star: 4,
      openDate: '2020-01-01',
      tags: ['亲子', '免费停车', '豪华'],
      coverImage:
        'https://images.ctrip.com/hotel/202312/xxx.jpeg', // 可以替换成你找的一张线上图片
      images: [],
      distanceDesc: '距市中心 1.2km',
      minPrice: 399 + idx * 30,
      facilities: ['WiFi', '泳池', '健身房'],
      roomTypes: []
    }))

    const newList = nextPage === 1 ? mock : [...hotels, ...mock]
    setHotels(newList)
    setPage(nextPage)
    // 简单模拟还有没有更多
    setHasMore(nextPage < 3)
  }

  useEffect(() => {
    loadData(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useReachBottom(() => {
    if (hasMore) {
      loadData(page + 1)
    }
  })

  const handleCardClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/hotel-detail/index?id=${id}&checkIn=${checkIn}&checkOut=${checkOut}`
    })
  }

  const initialTag = useMemo(() => {
    if (tags) {
      return tags.split(',')[0]
    }
    return null
  }, [tags])

  useEffect(() => {
    if (initialTag) {
      setTagFilter(initialTag)
    }
  }, [initialTag])

  const filteredAndSortedHotels = useMemo(() => {
    let list = [...hotels]
    if (starFilter) {
      list = list.filter(h => h.star === starFilter)
    }
    if (tagFilter) {
      list = list.filter(h => h.tags.includes(tagFilter))
    }
    list.sort((a, b) =>
      sortByPriceAsc ? a.minPrice - b.minPrice : b.minPrice - a.minPrice
    )
    return list
  }, [hotels, starFilter, tagFilter, sortByPriceAsc])

  return (
    <View className='page-hotel-list'>
      <View className='list-header'>
        <View className='list-header__left'>
          <Text className='list-header__city'>{city || '目的地'}</Text>
          <Text className='list-header__date'>
            {checkIn && checkOut ? `${checkIn} - ${checkOut}` : '请选择日期'}
          </Text>
        </View>
        <View className='list-header__right'>
          <Text className='list-header__keyword'>{keyword || '关键字'}</Text>
        </View>
      </View>

      <View className='list-filter-bar'>
        <Text
          className={`list-filter-item${sortByPriceAsc ? ' list-filter-item--active' : ''}`}
          onClick={() => setSortByPriceAsc(prev => !prev)}
        >
          价格{sortByPriceAsc ? '↑' : '↓'}
        </Text>
        <View className='list-filter-stars'>
          {[3, 4, 5].map(s => (
            <Text
              key={s}
              className={`list-filter-star${
                starFilter === s ? ' list-filter-star--active' : ''
              }`}
              onClick={() => setStarFilter(prev => (prev === s ? null : s))}
            >
              {s}星
            </Text>
          ))}
        </View>
        <View className='list-filter-tags'>
          {['亲子', '豪华', '免费停车'].map(t => (
            <Text
              key={t}
              className={`list-filter-tag${
                tagFilter === t ? ' list-filter-tag--active' : ''
              }`}
              onClick={() => setTagFilter(prev => (prev === t ? null : t))}
            >
              {t}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView className='list-scroll' scrollY>
        {filteredAndSortedHotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} onClick={() => handleCardClick(hotel.id)} />
        ))}
        {!hasMore && (
          <View className='list-end'>
            <Text>已经到底啦</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default HotelList