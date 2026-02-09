export interface RoomType {
  id: string
  name: string
  bedType?: string
  capacity?: number
  price: number
  breakfastIncluded?: boolean
  cancellable?: boolean
}

export interface Hotel {
  id: string
  name: string
  englishName?: string
  address: string
  city: string
  star: number
  openDate?: string
  tags: string[]
  coverImage: string
  images: string[]
  distanceDesc?: string
  minPrice: number
  facilities: string[]
  roomTypes: RoomType[]
}

