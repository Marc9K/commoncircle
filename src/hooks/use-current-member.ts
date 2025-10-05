import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Member } from '@/types/member'

export const useCurrentMember = () => {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const supabase = createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          setError('Failed to get user')
          return
        }
        
        if (!user) {
          setMember(null)
          return
        }

        const { data: memberData, error: memberError } = await supabase
          .from('Members')
          .select('*')
          .eq('uid', user.id)
          .single()

        if (memberError) {
          if (memberError.code === 'PGRST116') {
            // No member found
            setMember(null)
          } else {
            setError(`Failed to fetch member data for ${user.id} ${memberError.message}`)
          }
          return
        }

        setMember(memberData)
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Error fetching member:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMember()
  }, [])

  return { member, loading, error }
}
