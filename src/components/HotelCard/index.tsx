import { View, Text, Image } from '@tarojs/components'
import type { FC } from 'react'
import type { Hotel } from '../../types/hotel'
import './index.scss'

interface Props {
  hotel: Hotel
  onClick?: () => void
}

const HotelCard: FC<Props> = ({ hotel, onClick }) => {
  return (
    <View className='hotel-card' onClick={onClick}>
      <Image className='hotel-card__cover' src={hotel.coverImage} mode='aspectFill' />
      <View className='hotel-card__info'>
        <View className='hotel-card__title-row'>
          <Text className='hotel-card__name'>{hotel.name}</Text>
          <Text className='hotel-card__star'>{hotel.star}⭐</Text>
        </View>
        <Text className='hotel-card__address'>{hotel.address}</Text>
        <View className='hotel-card__tags'>
          {hotel.tags.slice(0, 3).map(tag => (
            <Text key={tag} className='hotel-card__tag'>
              {tag}
            </Text>
          ))}
        </View>
        <View className='hotel-card__bottom'>
          <Text className='hotel-card__price'>
            ¥{hotel.minPrice}
            <Text className='hotel-card__price-unit'> 起/晚</Text>
          </Text>
          {hotel.distanceDesc && (
            <Text className='hotel-card__distance'>{hotel.distanceDesc}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default HotelCard

