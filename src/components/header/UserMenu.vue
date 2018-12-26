<template>
  <ul class="user-menu user-menu--links">
    <li><router-link to="/add" active-class="active"><img :src="addIcon" alt=""></router-link></li>
    <li><router-link to="/bookmarks" active-class="active"><i class="far fa-bookmark"></i></router-link></li>
    <!-- <li><a :class="{ active: $store.state.user.showUserModal }" @click.prevent="$store.commit('toggleUserModal')" active-class="active"><i class="far fa-user"></i></a></li> -->
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
