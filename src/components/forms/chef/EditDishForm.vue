<template lang="pug">
  form(@submit.prevent="updateDish")
    h5 Editar plato
    p {{ editDish }}
    .row
      .col.s12
        label(for="name") Nombre del plato
        input(type="text", id="name", name="name", v-model="editDish.name")
      .col.s12
        label(for="description") Descripción
        textarea(id="description", name="description", v-model="editDish.description")
      .col.s12
        label(for="name") Categoría
        select(v-model="editDish.category")
          option(v-for="category in categories", :value="category.value") {{ category.display }}
      .col.s12
        label(for="name") Precio
        input(type="number", id="price", name="price", v-model.number="editDish.price")
      .col.s6
        a.btn.btn-block.red.lighten-1(@click="closeEditDishForm") Cancelar
      .col.s6
        button.btn.btn-block.blue.lighten-1(type="submit") Actualizar
</template>
<script>
  import { DB } from "@/firebase"
  import loadDishesCategoriesMixin from "@/mixins/load-dishes-categories"
  import hasEmptyFields from "@/mixins/has-empty-fields"
  export default {
    mixins: [
      loadDishesCategoriesMixin,
      hasEmptyFields
    ],
    created() {
      this.loadDishesCategories()
    },
    props: {
      dish: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        categories: []
      }
    },
    computed: {
      editDish() {
        return JSON.parse(JSON.stringify(this.dish.info))
      }
    },
    methods: {
      updateDish() {
        /* If has empty fields... */
        if (this.hasEmptyFields(this.editDish)) return
        
        const uid = this.$store.state.user.uid
        const dishRef = DB.ref(`/chefs/${ uid }/dishes/${ this.dish.key }`)
        dishRef.update(this.editDish).then(() => {
          console.log(`${ this.editDish.name } actualizado con éxito...`)
          M.toast({ html: `${ this.editDish.name } actualizado con éxito...` }, 3000)
          this.closeEditDishForm()
        })
      },
      closeEditDishForm() {
        this.$emit("closeEditDishForm")
      }
    }
  }
</script>