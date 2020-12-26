export interface Tournament {
  id: number    
  name: string    
  lat: number
  lng: number
  tournament_id: string    
  city: string
  countryCode: string
  createdAt: number
  currency: string
  numAttendees: number
  endAt: number
  eventRegistrationClosesAt: number
  hasOfflineEvents?: boolean
  images: {
    id: string
    url: string
  }[]
  isRegistrationOpen?: boolean
  slug: string
  state: number
  venueName?: string
  venueAddress?: string
} 