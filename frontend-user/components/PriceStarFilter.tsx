import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { 
  STAR_OPTIONS, 
  PRICE_OPTIONS,
  MODAL_ANIMATION_TYPE,
  MODAL_TRANSPARENT
} from '../constants/data';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface PriceStarFilterProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: { starRating: string; priceRange: string }) => void;
  initialStarRating?: string;
  initialPriceRange?: string;
}

const PriceStarFilter: React.FC<PriceStarFilterProps> = ({
  isVisible,
  onClose,
  onApply,
  initialStarRating = '',
  initialPriceRange = ''
}) => {
  const [selectedStar, setSelectedStar] = useState<string>(initialStarRating);
  const [selectedPrice, setSelectedPrice] = useState<string>(initialPriceRange);

  // 当模态框打开时，同步初始值
  useEffect(() => {
    if (isVisible) {
      setSelectedStar(initialStarRating);
      setSelectedPrice(initialPriceRange);
    }
  }, [isVisible, initialStarRating, initialPriceRange]);

  const handleApply = () => {
    onApply({
      starRating: selectedStar,
      priceRange: selectedPrice
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedStar('');
    setSelectedPrice('');
  };

  const getSelectedLabel = () => {
    const starLabel = STAR_OPTIONS.find(opt => opt.value === selectedStar)?.label || '不限';
    const priceLabel = PRICE_OPTIONS.find(opt => opt.value === selectedPrice)?.label || '不限';
    
    if (starLabel === '不限' && priceLabel === '不限') {
      return '价格/星级';
    }
    
    const parts = [];
    if (starLabel !== '不限') parts.push(starLabel);
    if (priceLabel !== '不限') parts.push(priceLabel);
    
    return parts.join(' · ');
  };

  return (
    <Modal
      visible={isVisible}
      transparent={MODAL_TRANSPARENT}
      animationType={MODAL_ANIMATION_TYPE as any}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-2xl mx-2 my-4 shadow-lg">
          {/* 头部 */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
            <Text className="text-lg font-bold">价格/星级筛选</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500 text-lg">✕</Text>
              </TouchableOpacity>
          </View>

          <ScrollView className="p-4 max-h-96">
            {/* 星级筛选 */}
            <View className="mb-6">
              <Text className="text-base font-semibold mb-3 text-gray-800">酒店星级</Text>
              <View className="flex-row flex-wrap gap-2">
                {STAR_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    className={`px-4 py-2 rounded-full border ${
                      selectedStar === option.value
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-white border-gray-300'
                    }`}
                    onPress={() => setSelectedStar(option.value)}
                  >
                    <Text
                      className={`text-sm ${
                        selectedStar === option.value ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 价格筛选 */}
            <View className="mb-6">
              <Text className="text-base font-semibold mb-3 text-gray-800">价格范围</Text>
              <View className="flex-row flex-wrap gap-2">
                {PRICE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    className={`px-4 py-2 rounded-full border ${
                      selectedPrice === option.value
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-white border-gray-300'
                    }`}
                    onPress={() => setSelectedPrice(option.value)}
                  >
                    <Text
                      className={`text-sm ${
                        selectedPrice === option.value ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* 底部按钮 */}
          <View className="flex-row p-4 border-t border-gray-100 gap-3">
            <TouchableOpacity
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg"
              onPress={handleReset}
            >
              <Text className="text-gray-700 text-center font-medium">重置</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 px-4 bg-blue-500 rounded-lg"
              onPress={handleApply}
            >
              <Text className="text-white text-center font-medium">确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PriceStarFilter;