import Vue from 'vue'
import Router from 'vue-router'

import AppHome from './views/Home'
import AppPlayer from './views/Player'
import AppBookmarks from './views/Bookmarks'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/bookmarks', component: AppBookmarks },
    { path: '/:id/:video', component: AppPlayer },
    { path: '/:id', component: AppHome }
  ]
})
