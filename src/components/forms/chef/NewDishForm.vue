<template lang="pug">
  form(@submit.prevent="saveNewDish")
    .divider
    h6 Crear nuevo plato
    .row
      .col.s12
        label(for="name") Nombre del plato
        input(type="text", id="name", name="name", v-model="newDish.name")
      .col.s12
        label(for="description") Descripción
        textarea(id="description", name="description", v-model="newDish.description")
      .col.s12
        label(for="name") Categoría
        select(v-model="newDish.category")
          option(v-for="category in categories", :value="category.value") {{ category.display }}
      .col.s12
        label(for="name") Precio
        input(type="number", id="price", name="price", v-model.number="newDish.price")
    .divider
    h6 Ingredientes
    ul
      li(v-for="ingredient in ingredients") {{ ingredient.name }} x {{ ingredient.quantity }}gr
    new-ingredient-form(@addNewIngredient="addNewIngredient")
    .col.s6
      a.btn.btn-block.red.lighten-1(@click="closeNewDishForm") Cancelar
    .col.s6
      button.btn.btn-block.blue.lighten-1(type="submit") Guardar
    br
</template>
<script>
  import { DB } from "@/firebase"
  import NewIngredientForm from "@/components/forms/chef/NewIngredientForm.vue"
  import loadDishesCategoriesMixin from "@/mixins/load-dishes-categories"
  import hasEmptyFields from "@/mixins/has-empty-fields"
  export default {
    mixins: [
      hasEmptyFields,
      loadDishesCategoriesMixin
    ],
    created() {
      this.loadDishesCategories()
    },
    components: {
      NewIngredientForm
    },
    data() {
      return {
        ingredients: [],
        newDish: {
          name: "",
          description: "",
          price: 0,
          category: ""
        },
        categories: []
      }
    },
    methods: {
      closeNewDishForm() {
        this.newDish = {
          name: "",
          description: "",
          price: 0,
          category: ""
        }
        this.$emit("closeNewDishForm")
      },
      addNewIngredient(ingredient) {
        this.ingredients.push(ingredient)
      },
      saveNewDish() { 
        /* If has empty fields... */
        if (this.hasEmptyFields(this.newDish)) return

        if (this.ingredients.length < 3) {
          const msg = "Debes especificar al menos 3 ingredientes para tu receta."
          alert(msg)
          console.log(msg)
          return
        }

        const uid = this.$store.state.user.uid
        const newDishRef = DB.ref(`/chefs/${ uid }/dishes/`)
        this.newDish.ingredients = this.ingredients
        this.newDish.imgUrl = ""
        newDishRef.push(this.newDish).then(() => {
          console.log(`Añadido el plato "${ this.newDish.name }..."`)
          M.toast({ html: `Añadido el plato "${ this.newDish.name }..."` }, 2000)
          this.newDish = {
            name: "",
            description: "",
            price: 0,
            category: ""
          }
          this.ingredients = []
        })
      }
    }
  }
</script>