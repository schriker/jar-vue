import axios from 'axios'

export const jarchiwumAPI = axios.create({
  baseURL: 'https://api.jarchiwum.pl'
  // baseURL: 'http://localhost:3000'
})

export const youtubeAPI = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  headers: {
    'Accept': 'application/json'
  },
  params: {
    key: 'AIzaSyAe_x16Z5RUb3r_au_XOv_k2ZPgVqZHNts'
  }
})

export const playlistAPI = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  headers: {
    'Accept': 'application/json'
  },
  params: {
    key: 'AIzaSyAe_x16Z5RUb3r_au_XOv_k2ZPgVqZHNts'
  }
})
