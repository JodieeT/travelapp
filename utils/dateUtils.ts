// utils/dateUtils.ts
/**
 * 日期处理工具函数集合
 * 提供统一的日期格式转换和处理逻辑
 */

/**
 * 将Date对象转换为YYYY-MM-DD格式的字符串
 */
export const dateToString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * 将字符串日期转换为Date对象
 */
export const stringToDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  return new Date(dateString);
};

/**
 * 计算两个日期之间的天数差
 */
export const calculateDaysDiff = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * 格式化日期显示（月/日）
 */
export const formatDateShort = (date: Date): string => {
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

/**
 * 格式化日期显示（月日 周几）
 */
export const formatDateLong = (date: Date): string => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
};