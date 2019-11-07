<template>
    <ul v-if="isSupported" class="archive-type archive-type--mobile">
      <li class="archive-type__fb"><router-link active-class="archive-type__active" :to="`/${$route.params.id}/facebook/${isSupported.pageId}`" exact><i class="fab fa-facebook-square"></i>Facebook</router-link></li>
      <li v-if="$route.params.id === 'wonziu'" class="archive-type__nv"><router-link active-class="archive-type__active" :to="`/${$route.params.id}/facebook/NvidiaGeforcePL`" exact><i class="fab fa-twitch"></i>Nvidia</router-link></li>
      <!-- <li class="archive-type__tw"><router-link active-class="archive-type__active" :to="`/${$route.params.id}/`" exact><i class="fab fa-twitch"></i>Twitch</router-link></li> -->
      <li v-if="$route.params.id === 'wonziu'" class="archive-type__yt">
        <a><i class="fab fa-youtube"></i>YouTube</a>
        <ul class="archive-type__submenu">
        <li class="archive-type__yt" v-for="archive in youtubeArchives" :key="archive.id"><router-link active-class="archive-type__active" :to="`/${$route.params.id}/youtube/${archive.id}`"><i class="fab fa-youtube"></i>{{archive.title}}</router-link></li>
        </ul>
      </li>
    </ul>
</template>
<script>
import { streamers } from '../../helpers/consts'

export default {
  data () {
    return {
      youtubeArchives: [
        {
          title: 'Jarchiwum',
          id: 'PLNsmXQ7BZFkU3UdbgfHusVp4BvDJcqMC1'
        },
        {
          title: 'Cayo',
          id: 'PLy_S3HWq-C5H-xfarvJOsTQdWQ3vFsCUk'
        },
        {
          title: '2017',
          id: 'PLy_S3HWq-C5FzEMsnZ_ff1tH1TccCS9cL'
        },
        {
          title: '2015-2016',
          id: 'PLy_S3HWq-C5Eh8PNazKgUbcHt9RI4YPqp'
        },
        {
          title: '2012-2013',
          id: 'PLy_S3HWq-C5Gn4yngiuP7CffQEv_ApFDu'
        },
        {
          title: 'Reszta',
          id: 'PLy_S3HWq-C5Ek1GORxXdjoYZjK-BjumDm'
        },
        {
          title: 'DOOM',
          id: 'PL2oOBJfCFJBZ0Qe4he9pnDyZljV6_dR75'
        },
        {
          title: 'Stare Dzieje',
          id: 'PLxiwAo629YA7BLhSExM5dNv-zunGF7dTv'
        }
      ]
    }
  },
  props: {
    streamer: Object
  },
  computed: {
    isSupported () {
      const supportedStreamer = streamers.filter(el => el.twitchId === this.streamer.data.info.id)
      if (supportedStreamer.length > 0) {
        return {
          ...supportedStreamer[0]
        }
      } else {
        return false
      }
    }
  }
}
</script>
