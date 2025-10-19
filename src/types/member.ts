export interface Member {
  id: number
  created_at: string
  name: string | null
  email: string | null
  avatar_url: string | null
  uid: string
  telegram_id?: string
  telegram_username?: string
}
