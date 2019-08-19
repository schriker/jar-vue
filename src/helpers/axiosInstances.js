import axios from 'axios'

export const appAPI = axios.create({
  baseURL: 'http://api.jarchiwum.pl/'
})

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

export const playlistAPI = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  headers: {
    'Accept': 'application/json'
  },
  params: {
    key: 'AIzaSyC2O7TelrFRRBlV6m_pujDAwTxcaR811vI'
  }
})
