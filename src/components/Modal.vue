<template lang="pug">
  #modal.modal.modal-fixed-footer
    .modal-content
      h5
        slot(name="title") Modal header
      slot(name="body")
        p Modal body
    .modal-footer
      slot(name="buttons")
        a.modal-close.waves-effect.waves-green.btn-flat Modal buttons
</template>
<script>
  export default {
    mounted() {
      $('#modal').modal()
    }
  }
</script>