<template>
  <div class="user-modal">
    <div @click="toggleUserModal" class="modal-backdrop"></div>
    <div class="content">
      <div class="content__box">
        <div @click="toggleUserModal" class="notification__close notification__close--modal"><i class="far fa-times-circle"></i></div>

      </div>
    </div>
  </div>
</template>
<script>

import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'toggleUserModal'
    ])
  }
}
</script>
