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
  const [starFilter, setStarFilter] = useState<number[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [sortByPriceAsc, setSortByPriceAsc] = useState(true)
  const [priceFilter, setPriceFilter] = useState<string>('')
  const [showPriceModal, setShowPriceModal] = useState(false)

  const priceRanges = [
    { label: '不限', value: '' },
    { label: '¥0-200', value: '0-200' },
    { label: '¥200-500', value: '200-500' },
    { label: '¥500-1000', value: '500-1000' },
    { label: '¥1000+', value: '1000+' }
  ]

  const params = router.params || {}
  const city = decodeURIComponent(params.city || '')
  const checkIn = decodeURIComponent(params.checkIn || '')
  const checkOut = decodeURIComponent(params.checkOut || '')
  const keyword = decodeURIComponent(params.keyword || '')
  const tags = decodeURIComponent(params.tags || '')
  const price = decodeURIComponent(params.price || '')
  const star = decodeURIComponent(params.star || '')

  const loadData = (nextPage = 1) => {
    const mock: Hotel[] = Array.from({ length: 5 }).map((_, idx) => {
      const starRating = [3, 4, 4, 5, 5][idx]
      const basePrice = starRating === 3 ? 200 : starRating === 4 ? 350 : 600
      return {
        id: `${nextPage}-${idx + 1}`,
        name: `${city || '示例城市'}易宿精选酒店 ${idx + 1}`,
        englishName: '',
        address: `${city || '某市'}中心商圈 · 地铁口附近`,
        city: city || '示例城市',
        star: starRating,
        openDate: '2020-01-01',
        tags: ['亲子', '免费停车', '豪华'],
        coverImage:
          'https://images.ctrip.com/hotel/202312/xxx.jpeg',
        images: [],
        distanceDesc: '距市中心 1.2km',
        minPrice: basePrice + idx * 30,
        facilities: ['WiFi', '泳池', '健身房'],
        roomTypes: []
      }
    })

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

  const initialTags = useMemo(() => {
    if (tags) {
      return tags.split(',')
    }
    return []
  }, [tags])

  const initialStars = useMemo(() => {
    if (star) {
      return star.split(',').map(s => parseInt(s)).sort((a, b) => a - b)
    }
    return []
  }, [star])

  useEffect(() => {
    if (initialTags.length > 0) {
      setTagFilter(initialTags)
    }
  }, [initialTags])

  useEffect(() => {
    if (initialStars.length > 0) {
      setStarFilter(initialStars)
    }
  }, [initialStars])

  useEffect(() => {
    if (price) {
      setPriceFilter(price)
    }
  }, [price])

  const filteredAndSortedHotels = useMemo(() => {
    let list = [...hotels]
    
    // 星级筛选（多选）
    if (starFilter.length > 0) {
      list = list.filter(h => starFilter.includes(h.star))
    }
    
    // 标签筛选（多选）
    if (tagFilter.length > 0) {
      list = list.filter(h => h.tags.some(t => tagFilter.includes(t)))
    }
    
    // 价格范围筛选 (优先使用 priceFilter 状态，止则使用 URL 参数)
    const effectivePrice = priceFilter || price
    if (effectivePrice) {
      if (effectivePrice === '1000+') {
        list = list.filter(h => h.minPrice >= 1000)
      } else {
        const [min, max] = effectivePrice.split('-').map(p => parseInt(p))
        list = list.filter(h => h.minPrice >= min && h.minPrice <= max)
      }
    }
    
    // 关键字筛选
    if (keyword) {
      list = list.filter(h => 
        h.name.toLowerCase().includes(keyword.toLowerCase()) ||
        h.address.toLowerCase().includes(keyword.toLowerCase())
      )
    }
    
    // 价格排序
    list.sort((a, b) =>
      sortByPriceAsc ? a.minPrice - b.minPrice : b.minPrice - a.minPrice
    )
    return list
  }, [hotels, starFilter, tagFilter, sortByPriceAsc, priceFilter, price, keyword])

  return (
    <View className='page-hotel-list'>
      <View className='list-header'>
        <View className='list-header__left'>
          <Text className='list-header__city'>{city || '目的地'}</Text>
          <Text className='list-header__date'>
            {checkIn && checkOut ? `${checkIn} - ${checkOut}` : '请选择日期'}
          </Text>
          {(price || star) && (
            <Text className='list-header__filter'>
              {price && `¥${price}`}
              {price && star && ' · '}
              {star && star.split(',').map(s => `${s}星`).join(',')}
            </Text>
          )}
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
        <Text
          className={`list-filter-item${priceFilter ? ' list-filter-item--active' : ''}`}
          onClick={() => setShowPriceModal(true)}
        >
          {priceFilter ? priceRanges.find(p => p.value === priceFilter)?.label : '价格'}
        </Text>
        <View className='list-filter-stars'>
          {[3, 4, 5].map(s => (
            <Text
              key={s}
              className={`list-filter-star${
                starFilter.includes(s) ? ' list-filter-star--active' : ''
              }`}
              onClick={() => setStarFilter(prev =>
                prev.includes(s) ? prev.filter(st => st !== s) : [...prev, s].sort((a, b) => a - b)
              )}
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
                tagFilter.includes(t) ? ' list-filter-tag--active' : ''
              }`}
              onClick={() => setTagFilter(prev =>
                prev.includes(t) ? prev.filter(tag => tag !== t) : [...prev, t]
              )}
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

      {showPriceModal && (
        <View className='list-modal' onClick={() => setShowPriceModal(false)}>
          <View className='list-modal__content' onClick={e => e.stopPropagation()}>
            <View className='list-modal__header'>
              <Text className='list-modal__title'>下师价格范围</Text>
              <Text className='list-modal__close' onClick={() => setShowPriceModal(false)}>x</Text>
            </View>
            <View className='list-modal__options'>
              {priceRanges.map(pr => (
                <Text
                  key={pr.value}
                  className={`list-modal__option${priceFilter === pr.value ? ' list-modal__option--active' : ''}`}
                  onClick={() => {
                    setPriceFilter(pr.value)
                    setShowPriceModal(false)
                  }}
                >
                  {pr.label}
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default HotelList