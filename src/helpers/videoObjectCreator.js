const videoObjectCreator = ({ state, videosArr, payload, actionPayload, isYoutube }) => {
  const today = new Date()
  let videoObject = {}
  let date = null

  for (const video of videosArr) {
    const lastVisited = new Date(state.userData.lastVisited[actionPayload.streamerName].date)

    if (isYoutube) {
      let published = null
      video.liveStreamingDetails ? published = video.liveStreamingDetails.actualStartTime : published = video.snippet.publishedAt

      date = new Date(published)

      videoObject = {
        isYoutube: true,
        created_at: published,
        duration: video.contentDetails.duration.toLowerCase().split('pt').pop(),
        id: video.id,
        published_at: published,
        thumbnail_url: video.snippet.thumbnails.medium.url,
        title: video.snippet.title,
        user_id: video.snippet.channelId,
        user_name: 'Wonziu',
        view_count: video.statistics.viewCount,
        watched: state.userData.watched.includes(video.id),
        bookmarked: state.userData.bookmarksId.includes(video.id),
        isNew: lastVisited < date
      }
    } else if (!isYoutube) {
      date = new Date(video.published_at)

      videoObject = {
        ...video,
        isYoutube: false,
        watched: state.userData.watched.includes(video.id),
        bookmarked: state.userData.bookmarksId.includes(video.id),
        isNew: lastVisited < date
      }
    }
    if (payload !== null) {
      const hours = ((today.getTime() - date.getTime()) / (1000 * 60 * 60)).toFixed(1)
      if (hours < 24) {
        payload.data.videos.today.push(videoObject)
      } else if (hours < 48 && hours >= 24) {
        payload.data.videos.yesterday.push(videoObject)
      } else if (hours >= 48) {
        payload.data.videos.older.push(videoObject)
      }
    }
  }

  return {
    videoObject,
    payload
  }
}

export default videoObjectCreator
