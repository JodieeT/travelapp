export default defineAppConfig({
  pages: [
    'pages/index/index',       // 酒店查询页（首页）
    'pages/hotel-list/index',  // 酒店列表页
    'pages/hotel-detail/index' // 酒店详情页
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '易宿酒店',
    navigationBarTextStyle: 'black'
  }
})