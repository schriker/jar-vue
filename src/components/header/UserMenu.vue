<template>
  <ul class="user-menu user-menu--links">
    <li><router-link to="/add" active-class="active"><i class="far fa-plus-square"></i></router-link></li>
    <li><router-link to="/bookmarks" active-class="active"><i class="far fa-bookmark"></i></router-link></li>
    <li v-if="user.data"><a @click.prevent="logOut"><i class="far fa-times-circle"></i></a></li>
    <li v-if="!user.data"><a :class="{ active: user.showUserModal }" @click.prevent="toggleUserModal" active-class="active"><i class="far fa-user"></i></a></li>
  </ul>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState([
      'user'
    ])
  },
  methods: {
    ...mapActions([
      'logOut'
    ]),
    ...mapMutations([
      'toggleUserModal'
    ])
  }
}
</script>
