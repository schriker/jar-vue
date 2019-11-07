<template>
  <div class="high-lights">
    <div class="high-lights__time-line">
      <canvas width="100%" height="29px" ref="chart"></canvas>
    </div>
  </div>
</template>
<script>

import Chart from 'chart.js'

export default {
  props: {
    chatData: Array,
    start: String,
    end: String
  },
  computed: {
    max () {
      return Math.max(...this.chatData)
    },
    duration () {
      return new Date(this.end) - new Date(this.start)
    }
  },
  mounted () {
    const ctx = this.$refs.chart

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chatData,
        datasets: [{
          label: 'wiadomości na 60s',
          data: this.chatData,
          backgroundColor: (ctx) => {
            var index = ctx.dataIndex
            var value = ctx.dataset.data[index]
            return `rgb(255, 105, 0)`
          }
        }]
      },
      options: {
        legend: {
          display: false
        },
        elements: {
          point: {
            radius: 0
          }
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false
          }]
        }
      }
    })
  }
}
</script>
