import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SearchCard = () => {
  return (
    <View className="mx-4 mt-4 p-4 bg-white rounded-2xl shadow-md">
      {/* 1️⃣ 城市 + 搜索 */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-semibold ">上海 ▾</Text>
        <TextInput
          placeholder="位置/品牌/酒店"
          placeholderTextColor="grey"
          className="flex-1 ml-3 bg-gray-100 px-3 py-2 rounded-lg"
        />
      </View>
        {/* 2️⃣ 日期 */}
      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-700">01月09日 今天</Text>
        <Text className="text-gray-700">01月10日 明天</Text>
        <Text className="text-gray-400">共1晚</Text>
      </View>
            {/* 3️⃣ 筛选 */}
      <View className="mb-3">
        <Text className="text-gray-400">价格/星级</Text>
      </View>
        {/* 4️⃣ 标签 */}
      <View className="flex-row flex-wrap gap-2 mb-4">
        {["免费停车", "亲子", "机场附近"].map((item, index) => (
          <View
            key={index}
            className="px-3 py-1 bg-gray-100 rounded-full"
          >
            <Text className="text-sm">{item}</Text>
          </View>
        ))}
      </View>
            {/* 5️⃣ 查询按钮 */}
        <Link href={`list`} asChild>
            <TouchableOpacity className="bg-blue-500 py-3 rounded-xl items-center">
                <Text className="text-white font-semibold text-base">查询</Text>
            </TouchableOpacity>
        </Link>
    </View>
  )
}

export default SearchCard