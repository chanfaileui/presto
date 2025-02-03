import React from 'react'

const SlideVideo = ({ videoURL, videoAutoplay }) => {
  if (!videoURL) return null

  const extractVideoID = url => {
    if (url.includes('youtu.be')) {
      return url.split('youtu.be/')[1]
    } else if (url.includes('youtube.com')) {
      return new URL(url).searchParams.get('v')
    }
    return null
  }

  const videoID = extractVideoID(videoURL)
  if (!videoID) return <p>Invalid YouTube URL</p>
  const embedUrl = `https://www.youtube.com/embed/${videoID}?autoplay=${
    videoAutoplay ? 1 : 0
  }&mute=1` // Added mute=1 to ensure autoplay works in modern browsers

  return (
    <iframe
      width='100%'
      height='100%'
      src={embedUrl}
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen
    ></iframe>
  )
}

export default SlideVideo
