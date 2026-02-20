interface HotelBanner{
  id: number;
  name_cn: string;
  name_en: string;
  images: string[];
  city: string;
  star_level: number;
}

// 酒店房间信息接口
interface Room {
  id: number;
  type_name: string;
  base_price: number;
}

// 酒店展示信息接口
interface Hotel{
  id: number;
  name_cn: string;
  name_en: string;
  city: string;
  address: string;
  star_level: number;
  open_date: string;
  images: string[];
  tags: string[];
  facilities: string[];
  min_price: number;
}

// 酒店列表响应接口
interface HotelListResponse {
  total: number;
  list: Hotel[];
}

interface HotelDetail {
  id: number;
  name_cn: string;
  name_en: string;
  city: string;
  address: string;
  star_level: number;
  open_date: string;
  images: string[];
  tags: string[];
  facilities: string[];
  rooms: Room[];
  min_price: number;
}

        // {
        //     "id": 19,
        //     "merchant_id": 3,
        //     "name_cn": "上海华美达酒店",
        //     "name_en": "华美达酒店 上海",
        //     "city": "上海",
        //     "address": "上海市中心商业区69号",
        //     "star_level": 2,
        //     "open_date": "2023-02-10",
        //     "status": "approved",
        //     "reject_reason": null,
        //     "images": "[\"https://picsum.photos/800/400?random=18\",\"https://picsum.photos/800/400?random=118\",\"https://picsum.photos/800/400?random=218\"]",
        //     "tags": "\"会议\"",
        //     "facilities": "[\"免费WiFi\",\"停车场\",\"健身房\",\"游泳池\",\"餐厅\"]",
        //     "is_banner": false,
        //     "banner_sort": 0,
        //     "createdAt": "2026-02-19T15:02:03.752Z",
        //     "updatedAt": "2026-02-19T15:02:03.752Z",
        //     "Rooms": [
        //         {
        //             "id": 68,
        //             "type_name": "行政套房",
        //             "base_price": 816
        //         },
        //         {
        //             "id": 65,
        //             "type_name": "标准双床房",
        //             "base_price": 842
        //         },
        //         {
        //             "id": 64,
        //             "type_name": "标准大床房",
        //             "base_price": 847
        //         },
        //         {
        //             "id": 67,
        //             "type_name": "豪华套房",
        //             "base_price": 864
        //         },
        //         {
        //             "id": 66,
        //             "type_name": "豪华大床房",
        //             "base_price": 1021
        //         }
        //     ],
        //     "minPrice": 816
        // }
