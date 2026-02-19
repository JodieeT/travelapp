import { useState } from "react";
import { View, Text } from "react-native";
import TagSelector from "./TagSelector";


export default function FilterTabs() {
  const tabs = ["推荐排序", "距离", "价格/星级", "筛选"];
  const tags = ["免费停车", "亲子", "机场附近","宠物", "地铁附近", "景点附近"];
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
      // 切换标签选中状态
    const toggleTag = (tag: string) => {
      if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter(t => t !== tag));
      } else {
        setSelectedTags([...selectedTags, tag]);
      }
    };
  return (
    <View className=" bg-white py-3 border-t border-gray-100">
        <View className="flex-row justify-around bg-white py-3 border-t border-gray-100">
        {tabs.map((tab, index) => (
            <Text key={index} className="text-gray-600">
            {tab} ▾
            </Text>
        ))}
        </View>
        <TagSelector tags={tags} selectedTags={selectedTags} onToggleTag={toggleTag} />
    </View>


    
  );
}
