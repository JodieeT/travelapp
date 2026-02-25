import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

// 日期范围选择器Props接口
interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDateChange: (startDate: Date, endDate: Date) => void;
  placeholder?: string;
  className?: string;
}

// 日期格式化工具函数
const formatDate = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return `${month}月${day}日 今天`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `${month}月${day}日 明天`;
  } else {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${month}月${day}日 ${weekdays[date.getDay()]}`;
  }
};

// 计算两个日期之间的天数
const calculateNights = (start: Date, end: Date): number => {
  const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  placeholder = "请选择入住和离店日期",
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(endDate);
  const [selectionPhase, setSelectionPhase] = useState<'start' | 'end'>('start');
  
  const touchableRef = useRef<React.ComponentRef<typeof TouchableOpacity>>(null);

  // 打开日期选择器
  const openPicker = () => {
    // 初始化临时状态
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setSelectionPhase(startDate && !endDate ? 'end' : 'start');
    setIsVisible(true);
  };

  // 关闭日期选择器
  const closePicker = () => {
    setIsVisible(false);
  };

  // 确认选择
  const confirmSelection = () => {
    if (tempStartDate && tempEndDate) {
      onDateChange(tempStartDate, tempEndDate);
      closePicker();
    }
  };

  // 重置选择
  const resetSelection = () => {
    setTempStartDate(undefined);
    setTempEndDate(undefined);
    setSelectionPhase('start');
  };

  // 处理日期选择
  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = new Date(day.dateString);
    
    if (selectionPhase === 'start') {
      setTempStartDate(selectedDate);
      setTempEndDate(undefined);
      setSelectionPhase('end');
    } else {
      // 确保结束日期不早于开始日期
      if (tempStartDate && selectedDate >= tempStartDate) {
        setTempEndDate(selectedDate);
      } else {
        // 如果选择的日期早于开始日期，则交换
        setTempStartDate(selectedDate);
        setTempEndDate(tempStartDate);
      }
    }
  };

  // 生成日历标记
  const generateMarkedDates = () => {
    const marked: any = {};
    
    if (tempStartDate) {
      const startDateStr = tempStartDate.toISOString().split('T')[0];
      marked[startDateStr] = {
        startingDay: true,
        color: '#3B82F6',
        textColor: 'white'
      };
    }
    
    if (tempStartDate && tempEndDate) {
      const start = new Date(tempStartDate);
      const end = new Date(tempEndDate);
      
      // 标记开始日期
      const startDateStr = start.toISOString().split('T')[0];
      marked[startDateStr] = {
        startingDay: true,
        color: '#3B82F6',
        textColor: 'white'
      };
      
      // 标记中间日期
      const current = new Date(start);
      current.setDate(current.getDate() + 1);
      
      while (current < end) {
        const dateStr = current.toISOString().split('T')[0];
        marked[dateStr] = {
          color: '#DBEAFE',
          textColor: '#3B82F6'
        };
        current.setDate(current.getDate() + 1);
      }
      
      // 标记结束日期
      const endDateStr = end.toISOString().split('T')[0];
      marked[endDateStr] = {
        endingDay: true,
        color: '#3B82F6',
        textColor: 'white'
      };
    }
    
    return marked;
  };

  // 获取显示文本
  const getDisplayText = () => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)} (${calculateNights(startDate, endDate)}晚)`;
    }
    return placeholder;
  };

  return (
    <>
      {/* 触发器 */}
      <TouchableOpacity
        ref={touchableRef}
        onPress={openPicker}
        className={`p-3 bg-gray-50 rounded-lg ${className}`}
      >
        <Text className={`${startDate && endDate ? 'text-gray-700' : 'text-gray-400'}`}>
          {getDisplayText()}
        </Text>
      </TouchableOpacity>

      {/* 日期选择模态框 */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePicker}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl p-4 max-h-[80%]">
            {/* 头部 */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                {selectionPhase === 'start' ? '选择入住日期' : '选择离店日期'}
              </Text>
              <TouchableOpacity onPress={closePicker}>
                <Text className="text-gray-500 text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            {/* 选择摘要 */}
            {(tempStartDate || tempEndDate) && (
              <View className="bg-blue-50 p-3 rounded-lg mb-4">
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-sm text-gray-500">入住</Text>
                    <Text className="font-medium text-gray-900">
                      {tempStartDate ? formatDate(tempStartDate) : '未选择'}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm text-gray-500">离店</Text>
                    <Text className="font-medium text-gray-900">
                      {tempEndDate ? formatDate(tempEndDate) : '未选择'}
                    </Text>
                  </View>
                </View>
                {tempStartDate && tempEndDate && (
                  <Text className="text-blue-600 mt-2">
                    共 {calculateNights(tempStartDate, tempEndDate)} 晚
                  </Text>
                )}
              </View>
            )}

            {/* 日历 */}
            <ScrollView className="mb-4">
              <Calendar
                current={tempStartDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
                minDate={new Date().toISOString().split('T')[0]}
                onDayPress={handleDayPress}
                markedDates={generateMarkedDates()}
                markingType={'period'}
                theme={{
                  backgroundColor: '#ffffff',
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#6B7280',
                  selectedDayBackgroundColor: '#3B82F6',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#3B82F6',
                  dayTextColor: '#1F2937',
                  textDisabledColor: '#D1D5DB',
                  arrowColor: '#3B82F6',
                  monthTextColor: '#1F2937',
                  textDayFontFamily: 'System',
                  textMonthFontFamily: 'System',
                  textDayHeaderFontFamily: 'System',
                  textDayFontWeight: '500',
                  textMonthFontWeight: '600',
                  textDayHeaderFontWeight: '600',
                }}
              />
            </ScrollView>

            {/* 操作按钮 */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={resetSelection}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg"
              >
                <Text className="text-center text-gray-700 font-medium">重置</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmSelection}
                disabled={!tempStartDate || !tempEndDate}
                className={`flex-1 py-3 px-4 rounded-lg ${
                  tempStartDate && tempEndDate 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300'
                }`}
              >
                <Text className={`text-center font-medium ${
                  tempStartDate && tempEndDate 
                    ? 'text-white' 
                    : 'text-gray-500'
                }`}>
                  确定
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DateRangePicker;