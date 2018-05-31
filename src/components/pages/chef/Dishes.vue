<template lang="pug">
  main
    .container
      h5.center Mis platos guardados
      transition(name="fade")
        new-dish-form(@closeNewDishForm="closeNewDishForm", v-if="showNewDishForm")

      a.btn.btn-block.blue.lighten-1(@click="openNewDishForm", v-if="!showNewDishForm") Añadir nuevo plato

      transition(name="fade", mode="out-in")
        div(v-if="isLoadingMyDishes")
          p Obteniendo mis platos guardados...
        div(v-else)
          div(v-if="myDishes.length > 0")
            ul.collection
              template(v-for="dish in myDishes")
                chef-dish(:dish="dish")
          div(v-else)
            p Parece que no has subido tus platos aún. :(
</template>
<script>
  import { DB } from "@/firebase"
  import ChefDish from "@/components/chef/Dish.vue"
  import NewDishForm from "@/components/forms/chef/NewDishForm.vue"
  export default {
    created() {
      this.loadMyDishes()
    },
    components: {
      ChefDish,
      NewDishForm
    },
    data() {
      return {
        isLoadingMyDishes: true,
        myDishes: [],
        showNewDishForm: false
      }
    },
    methods: {
      loadMyDishes() {
        const uid = this.$store.state.user.uid
        const myDishesRef = DB.ref(`/chefs/${ uid }/dishes`)

        myDishesRef.on("child_added", snapshot => {
          this.myDishes.push({
            key: snapshot.key,
            info: snapshot.val()
          })
        })

        myDishesRef.on("child_removed", snapshot => {
          this.myDishes = this.myDishes.filter(myDish => myDish.key !== snapshot.key)
        })

        this.isLoadingMyDishes = false
      },
      openNewDishForm() {
        this.showNewDishForm = true
      },
      closeNewDishForm() {
        this.showNewDishForm = false
      },
    }
  }
</script>