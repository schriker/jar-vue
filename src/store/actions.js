import axios from 'axios'

axios.defaults.baseURL = 'https://api.twitch.tv/helix'
axios.defaults.headers.common['Client-ID'] = 'w87bqmg0y9ckftb2aii2tdielbr1rx'

const actinos = {
  async fetchVideos ({ commit, state, dispatch }, actionPayload) {
    let today = new Date()

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

      let queryString = `/videos?user_id=${state.streamers.data[actionPayload.streamerName].info.id}`

      if (actionPayload.loadMore) {
        queryString += `&after=${state.streamers.data[actionPayload.streamerName].videos.pagination.cursor}`
      }

      try {
        const { data: { data: videosArr, pagination } } = await axios.get(queryString)

        if (!pagination.cursor) {
          dispatch('displayNotification', { type: 'error', message: 'Koniec listy :(' })
          return
        }

        payload.data.pagination = {
          ...pagination
        }

        for (let video of videosArr) {
          let date = new Date(video.published_at)
          let lastVisited = new Date(state.userData.lastVisited[actionPayload.streamerName].date)
          let videoObject = {
            ...video,
            watched: state.userData.watched.includes(video.id),
            bookmarked: state.userData.bookmarksId.includes(video.id),
            isNew: lastVisited < date
          }

          let hours = ((today.getTime() - date.getTime()) / (1000 * 60 * 60)).toFixed(1)
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
        return
      }
      commit('updateVideos', payload)
      commit('updateLastVisited', { streamer: actionPayload.streamerName, date: today.toISOString() })
      commit('updateLocalStorage')
    }
  },
  async refreshBookMark ({ commit, dispatch, state }, payload) {
    try {
      const { data: { data } } = await axios.get(`videos?id=${payload.video.id}`)
      let refreshed = {
        ...data[0],
        watched: state.userData.watched.includes(payload.video.id),
        bookmarked: state.userData.bookmarksId.includes(payload.video.id)
      }
      commit('onRefreshBookMark', { newVideo: refreshed, index: payload.index })
      commit('updateLocalStorage')
      dispatch('displayNotification', { type: 'success', message: 'Odświeżono.' })
    } catch (error) {
      console.log(error)
      dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' })
    }
  },
  updateSingleVideo ({ state, commit }, payload) {
    for (let video of payload) {
      video.watched = state.userData.watched.includes(video.id)
      video.bookmarked = state.userData.bookmarksId.includes(video.id)
    }
    commit('setSingleVideo', payload)
  },

  async getSingleVideo ({ state, commit, dispatch }, payload) {
    if (!state.streamers[payload.streamer]) {
      await dispatch('fetchStreamers', payload.streamer)
      await dispatch('fetchVideos', { streamerName: payload.streamer, loadMore: false })
    }

    let searchInStreamers = state.streamers[payload.streamer].videos.videos
    let searchResults = []

    for (let array in searchInStreamers) {
      let temp = searchInStreamers[array].filter((video) => video.id === payload.video)
      searchResults = [
        ...searchResults,
        ...temp
      ]
    }

    if (searchResults.length > 0) {
      dispatch('updateSingleVideo', searchResults)
      return
    }

    const singleVideoTwitch = await axios.get(`/videos?id=${payload.video}`)
    searchResults = [
      ...searchResults,
      ...singleVideoTwitch.data.data
    ]

    dispatch('updateSingleVideo', searchResults)
  },

  async addStreamer ({ commit, dispatch, state }, payload) {
    try {
      const { data: { data } } = await axios.get(`/users?&login=${payload}`)
      if (data.length === 0) {
        dispatch('displayNotification', { type: 'error', message: 'Podany streamer nie istnieje.' })
        return
      }
    } catch (error) {
      console.log(error)
      dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' })
      return
    }
    commit('addStreamer', payload)
    await dispatch('fetchStreamers', state.userData.streamers[0])
    commit('updateLocalStorage')
    dispatch('displayNotification', { type: 'success', message: 'Dodano streamera.' })
  },

  initUser ({ state, commit }) {
    let userDataString = JSON.stringify(state.userData)
    let userDataObject = JSON.parse(localStorage.getItem('jarchiwumData'))

    if (localStorage.getItem('jarchiwumData')) {
      commit('updateUserData', userDataObject)
    } else {
      localStorage.setItem('jarchiwumData', userDataString)
    }
  }
}

export default actinos
