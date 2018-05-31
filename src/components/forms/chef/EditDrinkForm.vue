<template lang="pug">
  form(@submit.prevent="updateItem")
    .row
      .col.s12
        label(for="name") Nombre de la bebida
        input(type="text", name="name", id="name", v-model="editDrink.info.name")
      .col.s12
        label(for="name") Categoría
        select(v-model="editDrink.info.category")
          option(v-for="category in categories", :value="category.value") {{ category.display }}
      .col.s12
        label(for="price") Precio
        input(type="number", name="price", id="price", v-model.number="editDrink.info.price")
      template(v-if="editDrink.info.volume")
        .col.s12
          input(type="number", name="n-volume", id="n-volume",  placeholder="Ej: 300ml", v-model.number="editDrink.info.volume.volumeN")
        .col.s12
          select(v-model="editDrink.info.volume.volumeM")
            option(v-for="measure in measures", :value="measure.value") {{ measure.display }}
      .col.s6
        a.btn.btn-block.red.lighten-1(@click="closeEditDrinkForm") Cancelar
      .col.s6
        button.btn.btn-block.green.lighten-1(type="submit") Guardar
</template>
<script>
  import { DB } from "@/firebase"
  import hasEmptyFields from "@/mixins/has-empty-fields"
  import LoadDrinksCategoriesMixin from "@/mixins/load-drinks-categories"
  export default {
    mixins: [
      hasEmptyFields,
      LoadDrinksCategoriesMixin
    ],
    created() {
      this.loadDrinksCategories()
    },
    props: {
      drink: {
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
      editDrink() {
        return JSON.parse(JSON.stringify(this.drink))
      },
      measures() {
        return this.$store.state.drinks.measures
      }
    },
    methods: {
      closeEditDrinkForm() {
        this.$emit("closeEditDrinkForm")
      },
      updateItem() {
        if (!this.hasEmptyFields(this.editDrink.info)) {
          const uid = this.$store.state.user.uid
          const drinkRef = DB.ref(`/chefs/${ uid }/drinks/${ this.editDrink.key }`)
          if (this.editDrink.info.volume) {
            if (!this.hasEmptyFields(this.editDrink.info.volume)) {
              drinkRef.update(this.editDrink.info).then(() => {
                console.log("Actualizado con éxito")
                this.closeEditDrinkForm()
              })
            }
          } else {
            drinkRef.update(this.editDrink.info).then(() => {
              console.log("Actualizado con éxito")
              this.closeEditDrinkForm()
            })
          }
        }
      }
    }
  }
</script>1