import axios from 'axios'

axios.defaults.baseURL = 'https://api.twitch.tv/helix'
axios.defaults.headers.common['Client-ID'] = 'w87bqmg0y9ckftb2aii2tdielbr1rx'

const actinos = {
  async fetchStreamers ({ commit, state, dispatch }, streamerName) {
    if (state.userData.streamers.length === 0) {
      commit('updateStreamers', {})
      commit('loadingVideosStart')
      dispatch('displayNotification', { type: 'error', message: 'Brak stremerów do wyświetlenia.' })
      return
    }
    let usersQueryString = ''
    let streamsQueryString = ''
    let streamers = {}

    for (let streamer of state.userData.streamers) {
      usersQueryString += `&login=${streamer}`
      streamsQueryString += `&user_login=${streamer}`
    }

    try {
      const { data: { data: users } } = await axios.get(`/users?${usersQueryString}`)

      for (let streamer of users) {
        streamers = {
          ...streamers,
          [streamer.login]: {
            info: {
              ...streamer
            },
            status: {},
            videos: {
              videos: {
                today: [],
                yesterday: [],
                older: []
              },
              pagination: {}
            }
          }
        }
      }

      const { data: { data: streams } } = await axios.get(`/streams?${streamsQueryString}`)

      for (let streamer of streams) {
        let streamerLogin = streamer.user_name.toLowerCase()

        streamers = {
          ...streamers,
          [streamerLogin]: {
            ...streamers[streamerLogin],
            status: {
              ...streamer
            }
          }
        }
      }
    } catch (error) {
      console.log(error)
      dispatch('displayNotification', { type: 'error', message: 'Wystąpił bląd.' })
    }

    commit('updateStreamers', streamers)
    dispatch('fetchVideos', { streamerName: streamerName, loadMore: false })
  },

  async fetchVideos ({ commit, state, dispatch }, actionPayload) {
    let today = new Date()

    if (state.streamers[actionPayload.streamerName]) {
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
                ...state.streamers[actionPayload.streamerName].videos.videos.today
              ],
              yesterday: [
                ...state.streamers[actionPayload.streamerName].videos.videos.yesterday
              ],
              older: [
                ...state.streamers[actionPayload.streamerName].videos.videos.older
              ]
            },
            pagination: {}
          }
        }
      }

      let queryString = `/videos?user_id=${state.streamers[actionPayload.streamerName].info.id}`

      if (actionPayload.loadMore) {
        queryString += `&after=${state.streamers[actionPayload.streamerName].videos.pagination.cursor}`
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
      }
      commit('updateVideos', payload)
      commit('updateLastVisited', { streamer: actionPayload.streamerName, date: today.toISOString() })
      commit('updateLocalStorage')
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
    let searchInBookmarked = state.userData.bookmarks
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

    let temp = searchInBookmarked.filter((video) => video.id === payload.video)
    searchResults = [
      ...searchResults,
      ...temp
    ]

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

  initUser ({ state, commit }) {
    let userDataString = JSON.stringify(state.userData)
    let userDataObject = JSON.parse(localStorage.getItem('userData'))

    if (localStorage.getItem('userData')) {
      commit('updateUserData', userDataObject)
    } else {
      localStorage.setItem('userData', userDataString)
    }
  },

  displayNotification ({ commit }, payload) {
    commit('showNotification', payload)

    let notificationTimeOut = window.setTimeout(() => commit('hideNotification'), 4000)
    while (notificationTimeOut--) {
      window.clearTimeout(notificationTimeOut)
    }

    if (payload.close) {
      clearTimeout(notificationTimeOut)
      commit('hideNotification')
    }
  }
}

export default actinos
