<template lang="pug">
  form(@submit.prevent="updateAdditional")
    .row
      .col.s12
        label(for="name") Nombre de la adición
        input(type="text", name="name", id="name", v-model="editAdditional.name")
      .col.s12
        label(for="price") Precio
        input(type="number", name="price", id="price", v-model.number="editAdditional.price")
      .col.s6
        a.btn.btn-block.red.lighten-1(@click="closeEditAdditionalForm") Cancelar
      .col.s6
        button.btn.btn-block.blue.lighten-1(type="submit") Actualizar
</template>
<script>
  import { DB } from "@/firebase"
  import hasEmptyFields from "@/mixins/has-empty-fields"
  export default {
    mixins: [
      hasEmptyFields
    ],
    props: {
      additional: {
        type: Object,
        required: true
      }
    },
    computed: {
      editAdditional() {
        return JSON.parse(JSON.stringify(this.additional.info))
      }
    },
    methods: {
      closeEditAdditionalForm() {
        this.$emit("closeEditAdditionalForm")
      },
      updateAdditional() {
        if (!this.hasEmptyFields(this.editAdditional)) {
          const uid = this.$store.state.user.uid
          const key = this.additional.key
          const additionalRef = DB.ref(`/chefs/${ uid }/additional/${ key }`)
          additionalRef.update(this.editAdditional)
            .then(() => {
              M.toast({ html: "Actualizado con éxito." }, 3000)
              console.log("Actualizado con éxito")
              this.closeEditAdditionalForm()
            })
        }
      }
    }
  }
</script>