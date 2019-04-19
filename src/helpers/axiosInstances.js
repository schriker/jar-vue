import axios from 'axios'

export const twitchAPI = axios.create({
  baseURL: 'https://api.twitch.tv/helix',
  headers: {
    'Client-ID': 'w87bqmg0y9ckftb2aii2tdielbr1rx'
  }
})

export const youtubeAPI = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  headers: {
    'Accept': 'application/json'
  },
  params: {
    key: 'AIzaSyBQpeY8SsVuwc_SbUL7NJmJiYIaQmwUrRc'
  }
})
