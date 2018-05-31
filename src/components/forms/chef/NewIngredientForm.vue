<template lang="pug">
  form
    .row
      .col.s12
        label(for="iname") Nombre
        input(type="text", name="iname", id="iname", placeholder="Ingrediente", v-model="newIngredient.name")
      .col.s12
        label(for="iquantity") Cantidad en gramos
        input(type="number", name="iquantity", id="iquantity", placeholder="Cantidad en grs.", v-model.number="newIngredient.quantity")
      .col.s12
        a(@click="addIngredient") + agregar
</template>
<script>
  import hasEmptyFields from "@/mixins/has-empty-fields"
  export default {
    mixins: [
      hasEmptyFields
    ],
    data() {
      return {
        newIngredient: {
          name: "",
          quantity: 0
        }
      }
    },
    methods: {
      addIngredient() {
        if (this.hasEmptyFields(this.newIngredient)) return
        this.$emit("addNewIngredient", this.newIngredient)
        this.newIngredient = {
          name: "",
          quantity: 0
        }
      }
    }
  }
</script>