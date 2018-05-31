<template lang="pug">
  section
    .row
      .col.s8
        b Nombre
      .col.s4
        b Gramaje
    .row(v-for="ingredient in ingredients")
      .col.s6
        input(type="text", v-model="ingredient.name")
      .col.s4
        input(type="number", v-model="ingredient.quantity")
      .col.s2
        a.red-text(@click="removeIngredient(ingredient)") <i class="material-icons">delete</i>
    .divider
    .row
      .col.s6
        input(type="text", v-model="newIngredient.name")
      .col.s4
        input(type="number", v-model.number="newIngredient.quantity")
      .col.s2
        a.right(@click="addIngredient") add
    .row
      .col.s6
        a.btn.btn-block.red.lighten-1(@click="closeEditIngredientsForm") Cancelar
      .col.s6
        a.btn.btn-block.blue.lighten-1(@click="updateIngredients") Actualizar
</template>
<script>
  import hasEmptyFields from "@/mixins/has-empty-fields"
  export default {
    mixins: [
      hasEmptyFields
    ],
    props: {
      ingredients: {
        type: Array,
        required: true
      }
    },
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
        
        this.ingredients.push(this.newIngredient)
        this.newIngredient = {
          name: "",
          quantity: 0
        }
      },
      updateIngredients() {
        if (this.ingredients.length < 3) {
          const msg = "El plato no puede contener menos de 3 ingredientes listados."
          console.error(msg)
          alert(msg)
          return
        }
        this.$emit("updateIngredients", this.ingredients)
      },
      removeIngredient(ingredient) {
        this.$emit("removeIngredient", ingredient)
      },
      closeEditIngredientsForm() {
        this.$emit("closeEditIngredientsForm")
      }
    }
  }
</script>
<style lang="scss" scoped>
  .row {
    margin-bottom: 0;
  }
</style>
