<template>
  <div class="card">
    <div class="card__provider">{{ card.provider }}</div>
      <a :href="card.url" target="_blank">
        <div v-if="card.title" class="card__title">
        {{ card.title }}
        </div>
        <div v-if="card.image || card.type === 'gifv' || card.type === 'video'" class="card__img-wrapper">
          <div class="card__open-icon">
            <i class="fas fa-external-link-alt"></i>
          </div>
          <video muted autoplay loop class="card__img" v-if="card.type === 'gifv'" :src="card.video[0].url" alt="gifv"></video>
          <video muted autoplay loop class="card__img" v-if="card.type === 'video'" :src="card.url" alt="gifv"></video>
          <img class="card__img" v-if="card.image" :src="card.image[card.image.length - 1].url" :alt="card.title" />
        </div>
        <div class="card__description">
          {{ card.description }}
        </div>
      </a>
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
