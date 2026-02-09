import { View, Text } from '@tarojs/components'
import type { FC } from 'react'
import type { RoomType } from '../../types/hotel'
import './index.scss'

interface Props {
  room: RoomType
  nights?: number
  onReserve?: () => void
}

const RoomCard: FC<Props> = ({ room, nights = 1, onReserve }) => {
  const total = room.price * nights

  return (
    <View className='room-card'>
      <View className='room-card__main'>
        <Text className='room-card__name'>{room.name}</Text>
        {room.bedType && (
          <Text className='room-card__sub'>
            {room.bedType}
            {room.capacity ? ` · 可住${room.capacity}人` : ''}
          </Text>
        )}
        <View className='room-card__tags'>
          {room.breakfastIncluded && <Text className='room-card__tag'>含早</Text>}
          {room.cancellable && <Text className='room-card__tag'>可取消</Text>}
        </View>
      </View>
      <View className='room-card__right'>
        <Text className='room-card__price'>¥{room.price}</Text>
        <Text className='room-card__price-desc'>每晚</Text>
        <Text className='room-card__total'>共 ¥{total}</Text>
        <View className='room-card__btn' onClick={onReserve}>
          <Text>预订</Text>
        </View>
      </View>
    </View>
  )
}

export default RoomCard

