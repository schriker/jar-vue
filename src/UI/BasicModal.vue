<template>
  <div class="user-modal">
    <div @click="closeModal" class="modal-backdrop"></div>
    <div class="content">
      <div class="content__box">
        <div @click="closeModal" class="notification__close notification__close--modal"><i class="far fa-times-circle"></i></div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    closeModal () {
      this.$emit('closeModal')
    }
  }
}
</script>
