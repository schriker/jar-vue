<template>
    <header class="header row">
      <ul>
        <li>
          <a class="active" href="#">
            <app-streamer></app-streamer>
          </a>
        </li>
        <li>
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
