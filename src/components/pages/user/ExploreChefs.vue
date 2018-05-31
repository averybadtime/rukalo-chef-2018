<template lang="pug">
  main
    .container
      h5 Explorar chefs
      .divider
      .row
        .col.s12
          transition(name="fade", mode="out-in")
            div(v-if="isLoadingChefs")
              p Obteniendo chefs...
            div(v-else)
              div(v-if="chefs.length > 0")
                div(v-for="chef in chefs")
                  chef-card(:chef="chef")
              div(v-else)
                p No hay chefs registrados aún. :(
</template>
<script>
  import { DB } from "@/firebase"
  import ChefCard from "@/components/ChefCard.vue"
  export default {
    components: { ChefCard },
    created() {
      this.listenChefs()
    },
    data() {
      return {
        isLoadingChefs: true,
        chefs: []
      }
    },
    methods: {
      listenChefs() {
        const chefsRef = DB.ref("/chefs")

        /* On child added...*/
        chefsRef.on("child_added", snapshot => {
          this.chefs.push({
            key: snapshot.key,
            info: snapshot.val().info
          })
          this.isLoadingChefs = false
        })

        /* On child removed... */
        chefsRef.on("child_removed", snapshot => {
          this.chefs = this.chefs.filter(chef => chef.key !== snapshot.key)
        })

      }
    }
  }
</script>