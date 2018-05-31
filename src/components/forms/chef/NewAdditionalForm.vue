<template lang="pug">
  form(@submit.prevent="saveNewAdditional")
    .row
      .col.s12
        label(for="name") Nombre de la adición
        input(type="text", name="name", id="name", v-model="newAdditional.name")
      .col.s12
        label(for="price") Precio
        input(type="number", name="price", id="price", v-model.number="newAdditional.price")
      .col.s6
        a.btn.btn-block.red.lighten-1(@click="closeNewAdditionalForm") Cancelar
      .col.s6
        button.btn.btn-block.blue.lighten-1(type="submit") Guardar
      br
    .divider
</template>
<script>
  import { DB } from "@/firebase"
  import hasEmptyFields from "@/mixins/has-empty-fields"
  export default {
    mixins: [
      hasEmptyFields
    ],
    data() {
      return {
        newAdditional: {
          name: "",
          price: ""
        }
      }
    },
    methods: {
      closeNewAdditionalForm() {
        this.$emit("closeNewAdditionalForm")
      },
      saveNewAdditional() {
        const uid = this.$store.state.user.uid
        const AdditionalRef = DB.ref(`/chefs/${ uid }/additional`)
        if (!this.hasEmptyFields(this.newAdditional)) {
          AdditionalRef.push(this.newAdditional)
            .then(() => {
              M.toast({ html: "Agregado con éxito." }, 3000)
              this.newAdditional = {
                name: "",
                price: 0
              }
              this.closeNewAdditionalForm()
            })
        }
      }
    }
  }
</script>