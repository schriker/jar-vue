<template>
    <div class="center-flex">
        <iframe
        :src="`https://player.twitch.tv/?video=v${$route.params.video}&autoplay=false`"
        height="100%"
        width="100%"
        frameborder="0"
        scrolling="false"
        allowfullscreen="true">
        </iframe>
        <div class="poorchat">
            <iframe frameborder="0" height="100%" width="100%"  id="jd-chat" src="https://client.poorchat.net/jadisco"></iframe>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    video: Object
  },
  created () {
    console.log(this.video)
  }
}
</script>
