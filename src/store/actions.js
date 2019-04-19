import Vue from 'vue'
import { twitchAPI, youtubeAPI } from '../helpers/axiosInstances'

const actinos = {
  async fetchVideos ({ commit, state, dispatch }, actionPayload) {
    const today = new Date()

    if (state.streamers.data[actionPayload.streamerName]) {
      if (actionPayload.loadMore) {
        commit('loadingMoreStart')
      } else {
        commit('loadingVideosStart')
      }

      let payload = {
        streamer: actionPayload.streamerName,
        data: {
          videos: {
            today: [],
            yesterday: [],
            older: []
          },
          pagination: {}
        }
      }

      if (actionPayload.loadMore) {
        payload = {
          streamer: actionPayload.streamerName,
          data: {
            videos: {
              today: [
                ...state.streamers.data[actionPayload.streamerName].videos.videos.today
              ],
              yesterday: [
                ...state.streamers.data[actionPayload.streamerName].videos.videos.yesterday
              ],
              older: [
                ...state.streamers.data[actionPayload.streamerName].videos.videos.older
              ]
            },
            pagination: {}
          }
        }
      }

      if (actionPayload.playlistId) {
        try {
          const videosIds = []
          let queryString = `/playlistItems?part=contentDetails&maxResults=20&playlistId=${actionPayload.playlistId}`

          if (actionPayload.loadMore) {
            queryString += `&pageToken=${state.streamers.data[actionPayload.streamerName].videos.pagination}`
          }

          if (!state.streamers.data[actionPayload.streamerName].videos.pagination && actionPayload.loadMore) {
            dispatch('displayNotification', { type: 'error', message: 'Koniec listy :(' })
            commit('loadingVideosStop')
            return
          }

          const { data: { items: tempVideosArr, nextPageToken } } = await youtubeAPI.get(queryString)
          payload.data.pagination = nextPageToken

          for (let video of tempVideosArr) {
            videosIds.push(video.contentDetails.videoId)
          }

          const videosIdString = videosIds.join('%2C')
          const videosQueryString = `/videos?part=snippet%2CcontentDetails%2Cstatistics%2CliveStreamingDetails&id=${videosIdString}`
          const { data: { items: videosArr } } = await youtubeAPI.get(videosQueryString)

          for (const video of videosArr) {
            let published = null
            video.liveStreamingDetails ? published = video.liveStreamingDetails.actualStartTime : published = video.snippet.publishedAt

            const date = new Date(published)
            const lastVisited = new Date(state.userData.lastVisited[actionPayload.streamerName].date)
            const videoObject = {
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

            const hours = ((today.getTime() - date.getTime()) / (1000 * 60 * 60)).toFixed(1)
            if (hours < 24) {
              payload.data.videos.today.push(videoObject)
            } else if (hours < 48 && hours >= 24) {
              payload.data.videos.yesterday.push(videoObject)
            } else if (hours >= 48) {
              payload.data.videos.older.push(videoObject)
            }
          }
        } catch (error) {
          console.log(error)
          dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' })
          commit('loadingVideosStop')
          return
        }
      } else if (!actionPayload.playlistId) {
        let queryString = `/videos?user_id=${state.streamers.data[actionPayload.streamerName].info.id}`

        if (actionPayload.loadMore) {
          queryString += `&after=${state.streamers.data[actionPayload.streamerName].videos.pagination.cursor}`
        }

        try {
          const { data: { data: videosArr, pagination } } = await twitchAPI.get(queryString)

          if (!pagination.cursor && actionPayload.loadMore) {
            dispatch('displayNotification', { type: 'error', message: 'Koniec listy :(' })
            commit('loadingVideosStop')
            return
          }

          payload.data.pagination = {
            ...pagination
          }

          for (const video of videosArr) {
            const date = new Date(video.published_at)
            const lastVisited = new Date(state.userData.lastVisited[actionPayload.streamerName].date)
            const videoObject = {
              ...video,
              isYoutube: false,
              watched: state.userData.watched.includes(video.id),
              bookmarked: state.userData.bookmarksId.includes(video.id),
              isNew: lastVisited < date
            }

            const hours = ((today.getTime() - date.getTime()) / (1000 * 60 * 60)).toFixed(1)
            if (hours < 24) {
              payload.data.videos.today.push(videoObject)
            } else if (hours < 48 && hours >= 24) {
              payload.data.videos.yesterday.push(videoObject)
            } else if (hours >= 48) {
              payload.data.videos.older.push(videoObject)
            }
          }
        } catch (error) {
          console.log(error)
          dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' })
          commit('loadingVideosStop')
          return
        }
      }
      commit('updateVideos', payload)
      commit('updateLastVisited', { streamer: actionPayload.streamerName, date: today.toISOString() })
      dispatch('saveData')
    }
  },
  async refreshBookMark ({ commit, dispatch, state }, payload) {
    try {
      const { data: { data } } = await twitchAPI.get(`videos?id=${payload.video.id}`)
      const refreshed = {
        ...data[0],
        watched: state.userData.watched.includes(payload.video.id),
        bookmarked: state.userData.bookmarksId.includes(payload.video.id)
      }
      commit('onRefreshBookMark', { newVideo: refreshed, index: payload.index })
      dispatch('saveData')
      dispatch('displayNotification', { type: 'success', message: 'Odświeżono.' })
    } catch (error) {
      console.log(error)
      dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' })
    }
  },
  updateSingleVideo ({ state, commit }, payload) {
    for (const video of payload) {
      video.watched = state.userData.watched.includes(video.id)
      video.bookmarked = state.userData.bookmarksId.includes(video.id)
    }
    commit('setSingleVideo', payload)
  },

  async getSingleVideo ({ state, dispatch }, payload) {
    if (!state.streamers.data[payload.streamer]) {
      await dispatch('fetchStreamers', payload.streamer)
      await dispatch('fetchVideos', { streamerName: payload.streamer, loadMore: false })
    }

    let searchResults = []

    if (state.streamers.data[payload.streamer]) {
      const searchInStreamers = state.streamers.data[payload.streamer].videos.videos

      for (const array in searchInStreamers) {
        const temp = searchInStreamers[array].filter((video) => video.id === payload.video)
        searchResults = [
          ...searchResults,
          ...temp
        ]
      }
    }

    if (searchResults.length > 0) {
      dispatch('updateSingleVideo', searchResults)
      return
    }

    if (payload.isYoutube) {
      const videosQueryString = `/videos?part=snippet%2CcontentDetails%2Cstatistics%2CliveStreamingDetails&id=${payload.video}`
      const { data: { items: video } } = await youtubeAPI.get(videosQueryString)

      let published = null
      video[0].liveStreamingDetails ? published = video[0].liveStreamingDetails.actualStartTime : published = video[0].snippet.publishedAt

      const date = new Date(published)
      const lastVisited = new Date(state.userData.lastVisited[payload.streamer].date)
      const videoObject = {
        isYoutube: true,
        created_at: published,
        duration: video[0].contentDetails.duration.toLowerCase().split('pt').pop(),
        id: video[0].id,
        published_at: published,
        thumbnail_url: video[0].snippet.thumbnails.medium.url,
        title: video[0].snippet.title,
        user_id: video[0].snippet.channelId,
        user_name: 'Wonziu',
        view_count: video[0].statistics.viewCount,
        watched: state.userData.watched.includes(video[0].id),
        bookmarked: state.userData.bookmarksId.includes(video[0].id),
        isNew: lastVisited < date
      }
      searchResults = [
        ...searchResults,
        videoObject
      ]
    } else {
      const singleVideoTwitch = await twitchAPI.get(`/videos?id=${payload.video}`)
      searchResults = [
        ...searchResults,
        ...singleVideoTwitch.data.data
      ]
    }

    dispatch('updateSingleVideo', searchResults)
  },

  async addStreamer ({ commit, dispatch, state }, payload) {
    try {
      const { data: { data } } = await twitchAPI.get(`/users?&login=${payload}`)
      if (data.length === 0) {
        dispatch('displayNotification', { type: 'error', message: 'Podany streamer nie istnieje.' })
        Vue.router.push({ path: `/` })
        dispatch('fetchStreamers', null, { root: true })
        return
      }
    } catch (error) {
      console.log(error)
      dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' })
      Vue.router.push({ path: `/` })
      dispatch('fetchStreamers', null, { root: true })
      return
    }

    if (state.userData.streamers.includes(payload.toLowerCase())) {
      dispatch('displayNotification', { type: 'error', message: 'Podany streamer jest już dodany.' })
      Vue.router.push({ path: `/` })
      dispatch('fetchStreamers', null, { root: true })
      return
    }

    commit('addStreamer', payload.toLowerCase())
    await dispatch('fetchStreamers', state.userData.streamers[0])
    dispatch('saveData')
    dispatch('displayNotification', { type: 'success', message: 'Dodano streamera.' })
  },

  saveData ({ rootState, commit, dispatch }) {
    if (rootState.user.data) {
      dispatch('syncUserData', null, { root: true })
    } else {
      commit('updateLocalStorage')
    }
  },

  initUser ({ state, commit, rootState }, payload) {
    const userDataString = JSON.stringify(state.userData)
    const userDataObject = JSON.parse(localStorage.getItem('jarchiwumData'))

    if (rootState.user.data) {
      commit('updateUserData', payload)
    } else if (localStorage.getItem('jarchiwumData')) {
      commit('updateUserData', userDataObject)
    } else {
      console.log('default')
      localStorage.setItem('jarchiwumData', userDataString)
    }
  }
}

export default actinos
