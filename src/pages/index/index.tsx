import Taro from '@tarojs/taro'
import { View, Text, Input, Button, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import './index.scss'

const Index = () => {
  const [city, setCity] = useState('上海')
  const [keyword, setKeyword] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
   const [selectedTags, setSelectedTags] = useState<string[]>([])

  const quickTags = ['亲子', '豪华', '免费停车']

  const handleSearch = () => {
    const params: Record<string, string> = {}
    if (city) params.city = city
    if (keyword) params.keyword = keyword
    if (checkIn) params.checkIn = checkIn
    if (checkOut) params.checkOut = checkOut
    if (selectedTags.length) params.tags = selectedTags.join(',')

    const query = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')

    Taro.navigateTo({
      url: `/pages/hotel-list/index?${query}`
    })
  }

  return (
    <View className='page-index'>
      <ScrollView className='index-scroll' scrollY>
        <View className='index-banner'>
          <Text className='index-banner__title'>易宿酒店预订</Text>
          <Text className='index-banner__sub'>发现下一次舒适入住体验</Text>
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

          <Button className='index-search-btn' onClick={handleSearch}>
            查询酒店
          </Button>

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
        </View>
      </ScrollView>
    </View>
  )
}

export default Index