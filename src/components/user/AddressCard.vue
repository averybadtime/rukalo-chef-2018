<template lang="pug">
  .card.grey.lighten-5
    .card-content.grey-text.text-darken-2
      span.card-title {{ address.data.name }}
      p {{ address.data.address }}
      a {{ address.data.phoneNumber }}
    .card-action
      a(@click="deleteAddress") Eliminar dirección
    //   a This is a link
</template>
<script>
  import { DB } from "@/firebase"
  export default {
    props: {
      address: {
        type: Object
      }
    },
    methods: {
      deleteAddress() {
        if (confirm("¿Seguro que desea eliminar esta dirección?")) {
          const uid = this.$store.state.user.uid
          const key = this.address.key
          DB.ref(`/users/${ uid }/addresses/${ key }`)
            .set(null)
            .then(() => console.info("Dirección eliminada."))
            .catch(err => console.error(err))
          }
      }
    }
  }
</script>