<template>
    <header class="header row">
      <ul>
        <li v-for="n in 2" :key="n">
          <a href="#">
            <app-streamer></app-streamer>
          </a>
        </li>
      </ul>
      <app-user-menu></app-user-menu>
    </header>
</template>

<script>
import AppStreamer from './Streamer'
import AppUserMenu from './UserMenu'

export default {
  components: {
    AppStreamer,
    AppUserMenu
  }
}
</script>
