import { useMemo } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import type { FC } from 'react'
import './index.scss'

interface Props {
  checkIn: string
  checkOut: string
  onChange: (checkIn: string, checkOut: string) => void
}

const DateRangePicker: FC<Props> = ({ checkIn, checkOut, onChange }) => {
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    return diff > 0 ? diff : 0
  }, [checkIn, checkOut])

  const handleStartChange = e => {
    const value = e.detail.value
    // 如果离店时间早于入住时间，自动把离店时间挪到入住+1 天
    let newOut = checkOut
    if (!newOut || new Date(newOut) <= new Date(value)) {
      const d = new Date(value)
      d.setDate(d.getDate() + 1)
      newOut = d.toISOString().slice(0, 10)
    }
    onChange(value, newOut)
  }

  const handleEndChange = e => {
    const value = e.detail.value
    // 如果选的离店时间早于入住时间，直接调回入住+1 天
    if (checkIn && new Date(value) <= new Date(checkIn)) {
      const d = new Date(checkIn)
      d.setDate(d.getDate() + 1)
      onChange(checkIn, d.toISOString().slice(0, 10))
    } else {
      onChange(checkIn, value)
    }
  }

  return (
    <View className='drp'>
      <View className='drp-dates'>
        <Picker mode='date' value={checkIn} onChange={handleStartChange}>
          <View className='drp-col'>
            <Text className='drp-label'>入住</Text>
            <Text className='drp-value'>{checkIn || '选择日期'}</Text>
          </View>
        </Picker>
        <View className='drp-divider' />
        <Picker mode='date' value={checkOut} onChange={handleEndChange}>
          <View className='drp-col'>
            <Text className='drp-label'>离店</Text>
            <Text className='drp-value'>{checkOut || '选择日期'}</Text>
          </View>
        </Picker>
      </View>
      <Text className='drp-nights'>
        {nights > 0 ? `共 ${nights} 晚` : '请选择入住/离店日期'}
      </Text>
    </View>
  )
}

export default DateRangePicker

