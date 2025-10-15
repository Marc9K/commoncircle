import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserImage = async () => {
      const supabase = createClient()
      
      // First try to get the cached avatar from the Members table
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: memberData, error: memberError } = await supabase
          .from('Members')
          .select('avatar_url')
          .eq('uid', user.id)
          .single()

        if (!memberError && memberData?.avatar_url) {
          setImage(memberData.avatar_url)
          return
        }
      }

      // Fallback to user_metadata if database query fails
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Auth session error:', error)
      }

      setImage(data.session?.user.user_metadata.avatar_url ?? null)
    }
    fetchUserImage()
  }, [])

  return image
}
