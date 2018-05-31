<template lang="pug">
  main
    .container
      transition(name="fade", mode="out-in")
        p(v-if="isLoadingChef") Cargando datos del chef...
        div(v-else)
          h5 {{ chef.name }}
          div(v-if="chef")
            p {{ chef }}
            like-button(:senderRef="'users'",
                        :sender="$store.state.user.uid",
                        :targetRef="'chefs'",
                        :target="$route.params.key")
            h5 Platos
            transition(name="fade", mode="out-in")
              div(v-if="chefDishes")
                template(v-for="dish in chefDishes")
                  user-dish(:dish="dish", :chefKey="$route.params.key")
              div(v-else)
                p Este chef no ha registrado platos aún :(
          p(v-else) No existe el chef que buscas. :(
</template>
<script>
  import { DB } from "@/firebase"
  import UserDish from "@/components/user/Dish.vue"
  import LikeButton from "@/components/globals/LikeButton.vue"
  export default {
    created() {
      this.loadChef(this.chefKey)
    },
    watch: {
      "$route"(to) {
        this.chefKey = to.params.key
      },
      chefKey() {
        this.loadChef(this.chefKey)
      }
    },
    components: {
      UserDish,
      LikeButton
    },
    data() {
      return {
        chefKey: this.$route.params.key,
        isLoadingChef: true,
        chef: null,
        chefDishes: []
      }
    },
    methods: {
      loadChef(key) {
        this.isLoadingChef = true

        const chefRef = DB.ref(`/chefs/${ key }/info`)
        const chefDishesRef = DB.ref(`/chefs/${ key }/dishes`)

        chefRef.once("value", snapshot => {
          this.chef = snapshot.val()
          
          this.chefDishes = []
          chefDishesRef.on("value", dishesSnapshot => {
            dishesSnapshot.forEach(dish => {
              this.chefDishes.push({
                key: dish.key,
                info: dish.val()
              })
            })
          })

          this.isLoadingChef = false
          })
      }
    }
  }
</script>