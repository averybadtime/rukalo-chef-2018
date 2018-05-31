<template lang="pug">
  main
    .container
      h5 Gestión de bebidas
      transition(name="fade", mode="out-in")
        new-drink-form(v-if="showNewDrinkForm", @closeNewDrinkForm="closeNewDrinkForm")
      a.btn.btn-block.blue.lighten-1(@click="openNewDrinkForm", v-if="!showNewDrinkForm") Añadir bebida

      div(v-if="isLoadingDrinks")
        p Obteniendo tus bebidas guardadas...
      div(v-else)
        div(v-if="myDrinks.length > 0")
          template(v-for="drink in myDrinks")
            chef-drink(:drink="drink")
        div(v-else)
          p No has guardado bebidas aún. :(
</template>
<script>
  import { DB } from "@/firebase"
  import ChefDrink from "@/components/chef/Drink.vue"
  import NewDrinkForm from "@/components/forms/chef/NewDrinkForm.vue"
  export default {
    created() {
      this.loadDrinks()
    },
    components: {
      ChefDrink,
      NewDrinkForm
    },
    data() {
      return {
        isLoadingDrinks: true,
        showNewDrinkForm: false,
        myDrinks: []
      }
    },
    methods: {
      loadDrinks() {
        const uid = this.$store.state.user.uid
        const drinksRef = DB.ref(`/chefs/${ uid }/drinks`)
        
        drinksRef.on("child_added", snapshot => {
          this.myDrinks.push({
              key: snapshot.key,
              info: snapshot.val()
            })
          this.isLoadingDrinks = false
        })
        
        drinksRef.on("child_changed", snapshot => {
          this.myDrinks.forEach((drink, i) => {
            if (drink.key === snapshot.key) {
              this.myDrinks[i].info = snapshot.val()
              return
            }
          })
        })
        
        drinksRef.on("child_removed", snapshot => {
          this.myDrinks = this.myDrinks.filter(drink => drink.key !== snapshot.key)
        })
      },
      openNewDrinkForm() {
        this.showNewDrinkForm = true
      },
      closeNewDrinkForm() {
        this.showNewDrinkForm = false
      }
    }
  }
</script>