<template>
  <ul class="user-menu user-menu--links">
    <li><router-link to="/add" active-class="active"><img :src="addIcon" alt=""></router-link></li>
    <li><router-link to="/bookmarks" active-class="active"><i class="far fa-bookmark"></i></router-link></li>
    <!-- <li><router-link to="/login" active-class="active"><i class="far fa-user"></i></router-link></li> -->
  </ul>
</template>
<script>
import addIcon from '../../assets/add_new.svg'

export default {
  data () {
    return {
      addIcon
    }
  }
}
</script>
