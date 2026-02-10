import Taro from '@tarojs/taro'
import { View, Text, Input, Button, ScrollView, Image } from '@tarojs/components'
import { useState } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import './index.scss'

const Index = () => {
  const [city, setCity] = useState('上海')
  const [keyword, setKeyword] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<string>('')
  const [starRating, setStarRating] = useState<number[]>([])
  const [showFilterModal, setShowFilterModal] = useState(false)

  const quickTags = ['亲子', '豪华', '免费停车']
  const priceRanges = [
    { label: '不限', value: '' },
    { label: '¥0-200', value: '0-200' },
    { label: '¥200-500', value: '200-500' },
    { label: '¥500-1000', value: '500-1000' },
    { label: '¥1000+', value: '1000+' }
  ]
  const starRatings = [3, 4, 5]

  const handleSearch = () => {
    const params: Record<string, string> = {}
    if (city) params.city = city
    if (keyword) params.keyword = keyword
    if (checkIn) params.checkIn = checkIn
    if (checkOut) params.checkOut = checkOut
    if (selectedTags.length) params.tags = selectedTags.join(',')
    if (priceRange) params.price = priceRange
    if (starRating.length) params.star = starRating.join(',')

    const query = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')

    Taro.navigateTo({
      url: `/pages/hotel-list/index?${query}`
    })
  }

  const getFilterText = () => {
    const parts: string[] = []
    if (priceRange) {
      const price = priceRanges.find(p => p.value === priceRange)
      if (price) parts.push(price.label)
    }
    if (starRating.length) {
      parts.push(starRating.map(s => `${s}星`).join(','))
    }
    return parts.length ? parts.join(' / ') : '价格/星级'
  }

  const handleHotelAdClick = () => {
    // 跳转到特定酒店的详情页面
    Taro.navigateTo({
      url: '/pages/hotel-detail/index?id=hotel_001'
    })
  }

  return (
    <View className='page-index'>
      <ScrollView className='index-scroll' scrollY>
        <View className='index-banner'>
          <Text className='index-banner__title'>易宿酒店预订</Text>
          <Text className='index-banner__sub'>发现下一次舒适入住体验</Text>
          
          <View className='index-banner__ad' onClick={handleHotelAdClick}>
            <Image
              className='index-banner__ad-image'
              src='https://dimg04.c-ctrip.com/images/0201h120009v0t9nqD1C0_R_600_400_R5_D.jpg'
              mode='aspectFill'
            />
            <View className='index-banner__ad-tag'>热门推荐</View>
          </View>
        </View>

        <View className='index-card'>
          <View className='index-row'>
            <Text className='index-label'>目的地</Text>
            <Input
              className='index-input'
              value={city}
              placeholder='城市/位置'
              onInput={e => setCity(e.detail.value)}
            />
          </View>

          <View className='index-row'>
            <Text className='index-label'>关键字</Text>
            <Input
              className='index-input'
              value={keyword}
              placeholder='酒店名 / 地标'
              onInput={e => setKeyword(e.detail.value)}
            />
          </View>

          <View className='index-row index-row--column'>
            <Text className='index-label'>日期</Text>
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={(ci, co) => {
                setCheckIn(ci)
                setCheckOut(co)
              }}
            />
          </View>

          <View className='index-row'>
            <Text className='index-label'>筛选</Text>
            <View className='index-filter-btn' onClick={() => setShowFilterModal(true)}>
              <Text className='index-filter-btn__text'>{getFilterText()}</Text>
              <Text className='index-filter-btn__icon'>▼</Text>
            </View>
          </View>

          <View className='index-tags'>
            {quickTags.map(tag => {
              const active = selectedTags.includes(tag)
              return (
                <Text
                  key={tag}
                  className={`index-tag${active ? ' index-tag--active' : ''}`}
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    )
                  }}
                >
                  {tag}
                </Text>
              )
            })}
          </View>

          <Button className='index-search-btn' onClick={handleSearch}>
            查询酒店
          </Button>
        </View>
      </ScrollView>

      {showFilterModal && (
        <View className='index-modal' onClick={() => setShowFilterModal(false)}>
          <View className='index-modal__content' onClick={e => e.stopPropagation()}>
            <View className='index-modal__header'>
              <Text className='index-modal__title'>价格与星级</Text>
              <Text className='index-modal__close' onClick={() => setShowFilterModal(false)}>✕</Text>
            </View>

            <View className='index-modal__section'>
              <Text className='index-modal__label'>价格区间</Text>
              <View className='index-modal__options'>
                {priceRanges.map(price => (
                  <Text
                    key={price.value}
                    className={`index-modal__option${priceRange === price.value ? ' index-modal__option--active' : ''}`}
                    onClick={() => setPriceRange(price.value)}
                  >
                    {price.label}
                  </Text>
                ))}
              </View>
            </View>

            <View className='index-modal__section'>
              <Text className='index-modal__label'>星级</Text>
              <View className='index-modal__options'>
                {starRatings.map(star => (
                  <Text
                    key={star}
                    className={`index-modal__option${starRating.includes(star) ? ' index-modal__option--active' : ''}`}
                    onClick={() => {
                      setStarRating(prev =>
                        prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star].sort((a, b) => a - b)
                      )
                    }}
                  >
                    {star}星级
                  </Text>
                ))}
              </View>
            </View>

            <View className='index-modal__footer'>
              <Button
                className='index-modal__reset'
                onClick={() => {
                  setPriceRange('')
                  setStarRating([])
                }}
              >
                重置
              </Button>
              <Button
                className='index-modal__confirm'
                onClick={() => setShowFilterModal(false)}
              >
                确定
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default Index