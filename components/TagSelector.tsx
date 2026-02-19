// components/TagSelector.tsx
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';

interface TagSelectorProps {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

const TagSelector = ({ tags, selectedTags, onToggleTag }: TagSelectorProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row gap-2">
        {tags.map((item, index) => (
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