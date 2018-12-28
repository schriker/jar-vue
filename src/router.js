import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import AppHome from './views/Home'
import AppPlayer from './views/Player'
import AppBookmarks from './views/Bookmarks'
import AppAddStreamer from './views/AddStreamer'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/bookmarks', component: AppBookmarks },
    { path: '/add', component: AppAddStreamer },
    { path: '/:id/:video', component: AppPlayer },
    { path: '/:id', component: AppHome }
  ]
})

Vue.router = router
export default router
