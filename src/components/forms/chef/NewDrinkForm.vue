<template lang="pug">
  form(@submit.prevent="saveNewDrink")
    .row
      .col.s12
        label(for="name") Nombre de la bebida
        input(type="text", name="name", id="name", v-model="newDrink.name")
      .col.s12
        label(for="name") Categoría
        select(v-model="newDrink.category")
          option(v-for="category in categories", :value="category.value") {{ category.display }}
      .col.s12
        label(for="price") Precio
        input(type="number", name="price", id="price", v-model.number="newDrink.price")
      .col.s12
        input(type="checkbox", name="showVolume", id="showVolume", v-model="showVolume")
        label.for-checkbox(for="showVolume") &nbsp;Especificar volumen de la bebida
      template(v-if="showVolume")
        .col.s12
          input(type="number", name="n-volume", id="n-volume",  placeholder="Ej: 300ml", v-model.number="volume.volumeN")
        .col.s12
          select(v-model="volume.volumeM")
            option(v-for="measure in measures", :value="measure.value") {{ measure.display }}
      .col.s6
        a.btn.btn-block.red.lighten-1(@click="closeNewDrinkForm") Cancelar
      .col.s6
        button.btn.btn-block.blue.lighten-1(type="submit") Guardar
      br
    .divider
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
    data() {
      return {
        showVolume: false,
        categories: [],
        newDrink: {
          name: "",
          category: "",
          price: 0
        },
        volume: {
          volumeN: null,
          volumeM: null
        }
      }
    },
    computed: {
      measures() {
        return this.$store.state.drinks.measures
      }
    },
    methods: {
      closeNewDrinkForm() {
        this.$emit("closeNewDrinkForm")
      },
      saveNewDrink() {
        if (!this.hasEmptyFields(this.newDrink)) {
          if (this.showVolume) {
            if (this.hasEmptyFields(this.volume)) {
              return
            } else {
              this.newDrink.volume = this.volume
            }
          }

          const uid = this.$store.state.user.uid
          const drinksRef = DB.ref(`/chefs/${ uid }/drinks`)

          drinksRef.push(this.newDrink).then(() => {
            M.toast({ html: `Añadida ${ this.newDrink.name }.`}, 3000)
            this.newDrink = {
              name: "",
              category: "",
              price: 0
            }
            this.volume = {
              volumeN: null,
              volumeM: null
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  label.for-checkbox {
    display: inline-block;
  }
</style>