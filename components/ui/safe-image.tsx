"use client"

import { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string
  fallbackSrc?: string
}

export function SafeImage({ 
  src, 
  alt, 
  fallbackSrc = "/images/math-blackboard.png",
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 1

  useEffect(() => {
    // Si c'est une image Imgur, utiliser le proxy
    if (src?.includes('imgur.com')) {
      setImgSrc(`/api/proxy-image?url=${encodeURIComponent(src)}`)
    } else {
      setImgSrc(src)
    }
  }, [src])

  const handleError = () => {
    if (retryCount < MAX_RETRIES && imgSrc !== fallbackSrc) {
      setRetryCount(retryCount + 1)
      // Si c'était le proxy, essayer l'URL originale
      if (imgSrc.includes('/api/proxy-image')) {
        setImgSrc(src)
      } else {
        // Sinon utiliser le fallback
        setImgSrc(fallbackSrc)
      }
    } else {
      // Utiliser le fallback définitif
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  )
}
