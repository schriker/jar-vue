<template>
  <div class="high-lights">
    <div class="high-lights__time-line">
      <svg width="100%" height="100%"  :viewBox="`0 0 ${viewBoxWidth} ${max}`" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path :d="pathData" fill="#7a8ba4"/>
      </svg>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    chatData: Array,
    start: String,
    end: String
  },
  computed: {
    max () {
      const messagesCounts = []
      for (let data of this.chatData) {
        const [ value ] = Object.values(data)
        messagesCounts.push(value)
      }
      return Math.max(...messagesCounts)
    },
    duration () {
      return new Date(this.end) - new Date(this.start)
    },
    viewBoxWidth () {
      return Object.keys(this.chatData[this.chatData.length - 1])[0]
    },
    pathData () {
      let d = `M 0 ${this.max} `
      for (let data of this.chatData) {
        const [ cords ] = Object.entries(data)
        const point = `L ${cords[0]} ${this.max - cords[1]} `
        d += point
      }
      return `${d} H ${this.duration} V ${this.max} H 0 Z`
    }
  }
}
</script>
