<template>
    <header class="header row">
      <ul>
        <li v-for="n in 2" :key="n">
          <a href="#">
            <app-stream></app-stream>
          </a>
        </li>
      </ul>
    </header>
</template>

<script>
import AppStream from './Stream'

export default {
  components: {
    AppStream
  }
}
</script>
