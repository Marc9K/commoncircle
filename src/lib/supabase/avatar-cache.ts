import { createClient } from './client'

export interface AvatarCacheResult {
  success: boolean
  url: string | null
  error?: string
}

/**
 * Downloads a Google avatar image and uploads it to Supabase Storage
 * @param googleAvatarUrl - The Google profile picture URL
 * @param userUid - The user's UID for the storage path
 * @returns Promise<AvatarCacheResult> - The result with Supabase Storage URL or fallback
 */
export async function cacheGoogleAvatar(
  googleAvatarUrl: string | null | undefined,
  userUid: string
): Promise<AvatarCacheResult> {
  // Return early if no avatar URL provided
  if (!googleAvatarUrl) {
    return {
      success: false,
      url: null,
      error: 'No Google avatar URL provided'
    }
  }

  try {
    const supabase = createClient()
    
    // Download the image from Google
    const response = await fetch(googleAvatarUrl)
    if (!response.ok) {
      throw new Error(`Failed to download avatar: ${response.status} ${response.statusText}`)
    }

    const imageBlob = await response.blob()
    
    // Determine file extension from content type or URL
    const contentType = response.headers.get('content-type') || ''
    let extension = 'jpg' // default fallback
    
    if (contentType.includes('png')) {
      extension = 'png'
    } else if (contentType.includes('webp')) {
      extension = 'webp'
    } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
      extension = 'jpg'
    } else {
      // Try to extract from URL as fallback
      const urlExtension = googleAvatarUrl.split('.').pop()?.toLowerCase()
      if (urlExtension && ['jpg', 'jpeg', 'png', 'webp'].includes(urlExtension)) {
        extension = urlExtension
      }
    }

    // Create storage path: avatars/{uid}/avatar.{ext}
    const storagePath = `avatars/${userUid}/avatar.${extension}`
    
    // Upload to Supabase Storage with upsert to overwrite existing
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(storagePath, imageBlob, {
        upsert: true,
        cacheControl: '3600' // Cache for 1 hour
      })

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError)
      return {
        success: false,
        url: googleAvatarUrl, // Fallback to Google URL
        error: `Storage upload failed: ${uploadError.message}`
      }
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(storagePath)

    return {
      success: true,
      url: urlData.publicUrl
    }

  } catch (error) {
    console.error('Avatar caching error:', error)
    return {
      success: false,
      url: googleAvatarUrl, // Fallback to Google URL
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
