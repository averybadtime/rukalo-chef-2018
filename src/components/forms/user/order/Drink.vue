<template lang="pug">
  .row
    h6 Elegir bebidas
    p(v-if="isLoadingDrinks") Obteniendo bebidas...
    ul(v-else)
      li(v-for="drink in drinks")
        .row
          .col.s6
            label
              input(type="checkbox", @change="setDrink(drink)")
              span {{ drink.info.name }}
              br
              em {{ drink.info.price | currency }} COP
              br
              em {{ toRukas(drink.info.price) }} RUKAS
          template(v-if="drink.selected")
            .col.s4
              span(v-model="drink.quantity") x{{ drink.quantity }} unds.
            .col.s1
              a(@click="add(drink)") +
            .col.s1
              a(@click="remove(drink)") -
    .col.s12
      a.btn-flat(@click="skipDrinks") omitir
      a.btn.red(@click="drinksDone") Siguiente ->
</template>
<script>
  import { DB } from "@/firebase"
  export default {
    created() {
      this.loadDrinks()
    },
    props: {
      chefKey: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        isLoadingDrinks: true,
        drinks: [],
        selected: []
      }
    },
    methods: {
      loadDrinks() {
        const drinksRef = DB.ref("/chefs/" + this.chefKey + "/drinks")
        return new Promise((done) => {
          drinksRef.once("value", snapshot => {
            snapshot.forEach(drink => {
              this.drinks.push({
                key: drink.key,
                info: drink.val(),
                quantity: 1,
                selected: false
              })
            })
            this.isLoadingDrinks = false
            done()
          })
        }).then(() => {
          if (this.drinks.length === 0) this.skipDrinks()
        })
      },
      setDrink(drink) {
        drink.selected = !drink.selected
      },
      add(drink) {
        drink.quantity++
      },
      remove(drink) {
        if (drink.quantity > 1) drink.quantity--
      },
      drinksDone() {
        this.selected = this.drinks.filter((drink) => drink.selected)
        this.$emit("drinksDone", this.selected)
      },
      skipDrinks() {
        this.$emit("skipDrinks")
      }
    }
  }
</script>
<style lang="scss" scoped>
  .row {
    margin-bottom: 5px;
  }
</style>
