// components/ui/StatusComponents.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

/**
 * 统一的状态显示组件
 * 包括加载、错误、空状态等通用UI组件
 */

interface StatusComponentProps {
  onRetry?: () => void;
  message?: string;
  subMessage?: string;
}

// 加载状态组件
export const LoadingState: React.FC<StatusComponentProps> = ({ 
  message = '加载中...' 
}) => (
  <View className="flex-1 justify-center items-center py-20">
    <Text className="text-gray-500 text-lg">{message}</Text>
  </View>
);

// 错误状态组件
export const ErrorState: React.FC<StatusComponentProps> = ({ 
  onRetry,
  message = '加载失败',
  subMessage = '请稍后重试'
}) => (
  <View className="flex-1 justify-center items-center py-20">
    <Text className="text-red-500 text-lg mb-2">{message}</Text>
    <Text className="text-gray-400 text-sm mb-4">{subMessage}</Text>
    {onRetry && (
      <TouchableOpacity 
        className="px-4 py-2 bg-blue-500 rounded-lg"
        onPress={onRetry}
      >
        <Text className="text-white text-sm">点击重试</Text>
      </TouchableOpacity>
    )}
  </View>
);

// 空状态组件
export const EmptyState: React.FC<StatusComponentProps> = ({ 
  message = '暂无符合条件的数据',
  subMessage = '请尝试调整筛选条件'
}) => (
  <View className="flex-1 justify-center items-center py-20">
    <Text className="text-gray-500 text-lg mb-2">{message}</Text>
    <Text className="text-gray-400 text-sm">{subMessage}</Text>
  </View>
);