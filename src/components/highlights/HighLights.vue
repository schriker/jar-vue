<template>
  <div class="high-lights">
    <div class="high-lights__time-line">
      <div v-for="(time, index) in timelineMarkers" :key="index" :class="{'high-lights__marker': true, 'high-lights__marker--ten': (index + 1) % 5 === 0 ? true : false}" :style="{left: markerPosition((index + 1) * 1000 * 60 * 2)}"></div>
      <div class="high-lights__bar" v-for="moment in highLights" v-tooltip.top-center="{content: moment.type, offset: 5}" :key="moment.time" @click="() => momentClickHandler(moment)" :style="{left: timelinePosition(moment)}">
        <div :style="{height: barHeight(moment), 'background-color': `rgba(100%, ${100 - ((moment.totalMessagesCount + (moment.percent / 10)) / (max + 10) * 100)}%, 0%, 1)`}"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    highLights: Array,
    start: String,
    end: String
  },
  computed: {
    max () {
      const messagesCounts = []
      for (let moment of this.highLights) {
        messagesCounts.push(moment.totalMessagesCount)
      }
      return Math.max(...messagesCounts)
    },
    duration () {
      return new Date(this.end) - new Date(this.start)
    },
    timelineMarkers () {
      return Math.floor(this.duration / 1000 / 60 / 2)
    }
  },
  methods: {
    barHeight (moment) {
      return `${(moment.totalMessagesCount + (moment.percent / 10)) / (this.max + 10) * 100}%`
    },
    timelinePosition (moment) {
      return `calc(${this.momentMs(moment.time) / this.duration * 100}% - 4px)`
    },
    markerPosition (time) {
      return `calc(${time / this.duration * 100}% - 4px)`
    },
    momentMs (time) {
      return new Date(time) - new Date(this.start)
    },
    momentClickHandler (moment) {
      this.$emit('seekTo', this.momentMs(moment.time))
    }
  }
}
</script>
