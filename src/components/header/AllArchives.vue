<template>
    <ul class="archive-type">
      <li class="archive-type__tw"><router-link active-class="archive-type__active" :to="`/${streamerName}`" exact><i class="fab fa-twitch"></i>Twitch</router-link></li>
      <li class="archive-type__fb"><router-link active-class="archive-type__active" :to="`/${streamerName}/facebook/StrumienieZRuczaju`" exact><i class="fab fa-facebook-square"></i>Facebook</router-link></li>
      <li class="archive-type__yt" v-for="archive in youtubeArchives" :key="archive.id"><router-link active-class="archive-type__active" :to="`/${streamerName}/youtube/${archive.id}`"><i class="fab fa-youtube"></i>{{archive.title}}</router-link></li>
    </ul>
</template>
<script>
export default {
  data () {
    return {
      youtubeArchives: [
        {
          title: 'YouTube',
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
    streamerName: String
  }
}
</script>
