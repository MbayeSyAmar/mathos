"use client"

import { useEffect, useState } from "react"
import Image, { type ImageProps } from "next/image"

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string
  fallbackSrc?: string
}

export function SafeImage({ src, alt, fallbackSrc = "/images/math-blackboard.png", ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [retry, setRetry] = useState(0)
  const MAX_RETRY = 1

  useEffect(() => {
    // Route Imgur via proxy to bypass geo-blocking; leave others as-is
    if (src.includes("imgur.com")) {
      setImgSrc(`/api/proxy-image?url=${encodeURIComponent(src)}`)
    } else {
      setImgSrc(src)
    }
  }, [src])

  const handleError = () => {
    if (retry < MAX_RETRY && imgSrc !== src) {
      setRetry(retry + 1)
      setImgSrc(src)
      return
    }
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    }
  }

  return <Image {...props} src={imgSrc} alt={alt} onError={handleError} />
}
