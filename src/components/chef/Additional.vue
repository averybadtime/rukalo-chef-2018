<template lang="pug">
  .row
    b {{ additional.info.name }}
    h6 {{ additional.info.price | currency }}

    edit-additional-form(@closeEditAdditionalForm="closeEditAdditionalForm", :additional="additional", v-if="showEditAdditionalForm")

    template(v-if="!showEditAdditionalForm")
      .col.s6
        a.btn.btn-block.red.lighten-1(@click="deleteAdditional") Eliminar
      .col.s6
        a.btn.btn-block.green.lighten-1(@click="openEditAdditionalForm") Editar
</template>
<script>
  import { DB } from "@/firebase"
  import editAdditionalForm from "@/components/forms/chef/editAdditionalForm.vue"
  export default {
    components: {
      editAdditionalForm
    },
    props: {
      additional: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        showEditAdditionalForm: false
      }
    },
    methods: {
      openEditAdditionalForm() {
        this.showEditAdditionalForm = true
      },
      closeEditAdditionalForm() {
        this.showEditAdditionalForm = false
      },
      deleteAdditional() {
        if (confirm(`¿Seguro desea eliminar ${ this.additional.info.name }?`)) {
          const uid = this.$store.state.user.uid
          const key =  this.additional.key
          const AdditionalRef = DB.ref(`/chefs/${ uid }/additional/${ key }`)
          AdditionalRef.set(null).then(() => {
            M.toast({ html: "Eliminado con éxito." }, 3000)
            console.log("Eliminado con éxito.")
          })
        }
      }
    }
  }
</script>