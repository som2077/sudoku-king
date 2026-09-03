import { TouchableOpacity, Text, View } from 'react-native';
import { memo } from 'react';

interface CellProps {
  value: number | null;
  notes: number;
  isSelected: boolean;
  isLocked: boolean;
  isError: boolean;
  isHighlighted: boolean;
  isSameValue: boolean;
  onPress: () => void;
}

const Cell = ({ value, notes, isSelected, isLocked, isError, isHighlighted, isSameValue, onPress }: CellProps) => {

  let bgClass = "bg-white";
  if (isSelected) bgClass = "bg-blue-300";
  else if (isError) bgClass = "bg-red-200";
  else if (isSameValue) bgClass = "bg-blue-200";
  else if (isHighlighted) bgClass = "bg-blue-100";
  else if (isLocked) bgClass = "bg-gray-100";

  let textClass = "text-2xl font-normal text-black";
  if (isLocked) textClass = "text-2xl font-bold text-gray-800";
  if (isError) textClass = "text-2xl font-bold text-red-600";
  if (!isLocked && !isError) textClass = "text-2xl font-medium text-blue-700";

  const renderNotes = () => {
    if (notes === 0) return null;
    return (
      <View className="flex-row flex-wrap w-full h-full p-0.5 justify-between">
         {[1,2,3,4,5,6,7,8,9].map(num => (
            <Text key={num} style={{fontSize: 10, width: '30%', textAlign: 'center'}} className={(notes & (1 << num)) ? "text-gray-600" : "text-transparent"}>
              {num}
            </Text>
         ))}
      </View>
    );
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      className={`flex-1 border-[0.5px] border-gray-300 items-center justify-center ${bgClass}`}
    >
      {value ? <Text className={textClass}>{value}</Text> : renderNotes()}
    </TouchableOpacity>
  );
}
