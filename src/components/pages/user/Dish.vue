<template lang="pug">
  main
    .container
      div(v-if="isLoadingDishAndChef") Obteniendo datos del plato...
      div(v-else)
          template(v-if="dish")
            h5 {{ dish.name }}
            span(v-if="chef") {{ chef.name }}
            ul
              li(v-for="(val, key) in dish") <b>{{ key }}</b>: {{ val }}
            like-button(:sender="$store.state.user.uid",
                        :senderRef="'users'",
                        :target="dishKey",
                        :targetRef="'dishes'",
                        :chefKey="$route.params.chef")
            .row
              .col.s12
                router-link.btn.btn-block.blue.lighten-1(:to="{ name: 'chef-view', params: { key: this.chefKey } }") Ver chef
          template(v-else)
            p Parece que el recurso que buscas no existe :(
</template>
<script>
  import { DB } from "@/firebase"
  import LikeButton from "@/components/globals/LikeButton.vue"
  export default {
    created() {
      return new Promise(done => {
        this.chefKey = this.$route.params.chef
        this.dishKey = this.$route.params.dish
        done()
      }).then(() => this.loadDishByChefKey())
    },
    components: {
      LikeButton
    },
    data() {
      return {
        isLoadingDishAndChef: true,
        chefKey: "",
        dishKey: "",
        dish: null,
        chef: null
      }
    },
    watch: {
      "$route"(to) {
        this.chefKey = to.params.chef
        this.dishKey = to.params.dish
        this.loadDishByChefKey()
      }
    },
    methods: {
      loadDishByChefKey() {
        this.isLoadingDishAndChef = true
        const dishRef = DB.ref(`/chefs/${ this.chefKey }/dishes/${ this.dishKey }`)
        const chefRef = DB.ref(`/chefs/${ this.chefKey }/info`)

        dishRef.once("value", snapshot => this.dish = snapshot.val())

        chefRef.once("value", snapshot => this.chef = snapshot.val())
          .then(() => this.isLoadingDishAndChef = false)
      }
    }
  }
</script>