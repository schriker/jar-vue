<template>
  <div class="card">
    <div class="card__provider">{{ card.provider }}</div>
      <a :href="card.url" target="_blank">
        <div v-if="card.title" class="card__title">
        {{ card.title }}
        </div>
        <div v-if="!card.player && card.image || card.type === 'gifv'" class="card__img-wrapper">
          <video autoplay loop class="card__img" v-if="card.type === 'gifv'" :src="card.url" alt="gifv"></video>
          <img class="card__img" v-if="!card.player && card.image" :src="card.image[card.image.length - 1].url" :alt="card.title" />
        </div>
        <div class="card__description">
          {{ card.description }}
        </div>
      </a>
      <iframe
        v-if="card.player"
        class="player__iframe"
        :src="card.player[0].url"
        width="100%"
        frameborder="0"
        scrolling="false"
        allowfullscreen="true">
      </iframe>
    <!-- {{ card }} -->
  </div>
</template>
<script>
export default {
  props: {
    card: Object
  }
}
</script>
