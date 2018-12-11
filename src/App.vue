<template>
  <div class="container">
    <app-header></app-header>
    <app-videos-list></app-videos-list>
  </div>
</template>

<script>
import './style.scss'
import AppHeader from './components/header/Header'
import AppVideosList from './components/videos/VideosList'

export default {
  components: {
    AppHeader,
    AppVideosList
  }
}
</script>
