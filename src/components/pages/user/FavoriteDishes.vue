<template lang="pug">
  main
    .container
      h5 Platos favoritos
      div(v-if="isLoadingFavoriteDishes")
        p Obteniendo mis platos favoritos...
      div(v-else)
        div(v-if="myFavoriteDishes.length > 0")
          div(v-for="dish in myFavoriteDishes")
            user-dish(:dish="dish.dish", :chefKey="dish.chefKey", :from="dish.from")
        div(v-else)
          p Parece que no tienes platos favoritos aún. :(
</template>
<script>
  import { DB } from "@/firebase"
  import UserDish from "@/components/user/Dish.vue"
  export default {
    created() {
      this.loadFavoriteDishes()
    },
    components: {
      UserDish
    },
    data() {
      return {
        isLoadingFavoriteDishes: true,
        myFavoriteDishes: []
      }
    },
    methods: {
      loadFavoriteDishes() {
        return new Promise(done => {
          const uid = this.$store.state.user.uid
          const myFavoriteDishesRef = DB.ref(`/users/${ uid }/likes/dishes`)

          myFavoriteDishesRef.on("child_added", snapshot => {
            const chefKey = snapshot.key
            const favoriteChefNodeDishRef = snapshot.ref
            
            favoriteChefNodeDishRef.on("child_added", snapshot => {

              const dishKey = snapshot.key
              const dishRef = DB.ref(`/chefs/${ chefKey }/dishes/${ dishKey }`)

              dishRef.once("value", dishSnapshot => {

                const dish = {
                  key: dishSnapshot.key,
                  info: dishSnapshot.val()
                }
                const from = snapshot.val().from

                this.myFavoriteDishes.push({ dish, chefKey, from })
              })
            })
            favoriteChefNodeDishRef.on("child_removed", snapshot => {
              this.myFavoriteDishes = this.myFavoriteDishes.filter(dish => dish.dish.key !== snapshot.key)
            })
          })
          done()
        }).then(() => this.isLoadingFavoriteDishes = false)
      }
    }
  }
</script>