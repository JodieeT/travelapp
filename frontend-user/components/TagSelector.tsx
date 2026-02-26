// components/TagSelector.tsx
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useTags } from '../constants/data';
import { tagDataService } from '../constants/data';

interface TagSelectorProps {
  tags?: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

const TagSelector = ({ tags, selectedTags, onToggleTag }: TagSelectorProps) => {
  const { data: dynamicTags = [], loading, error } = useTags();
  
  // 如果没有传入tags参数，使用动态获取的标签
  const displayTags = tags || dynamicTags || [];

  // 初始化标签数据
  useEffect(() => {
    const initializeTags = async () => {
      try {
        const tagList = await tagDataService.getTags();
        console.log('Initialized tags:', tagList);
      } catch (err) {
        console.error('Failed to initialize tags:', err);
      }
    };
    
    initializeTags();
  }, []);

  if (loading) {
    return (
      <View className="mb-4">
        <Text className="text-gray-500">加载标签中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="mb-4">
        <Text className="text-red-500">标签加载失败</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row gap-2">
        {displayTags.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`px-3 py-1 rounded-full ${
              selectedTags.includes(item) ? 'bg-blue-500' : 'bg-gray-100'
            }`}
            onPress={() => onToggleTag(item)}
          >
            <Text
              className={`text-sm ${
                selectedTags.includes(item) ? 'text-white' : 'text-gray-700'
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default TagSelector;