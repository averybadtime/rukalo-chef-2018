<template lang="pug">
  main
    .row
      h5.center <span class="pulse">♥</span> Mis chefs favoritos
      transition(name="fade", mode="out-in")
        div(v-if="isLoadingFavoriteChef")
          p Obteniendo chefs favoritos...
        div(v-else)
          div(v-if="favoriteChefs.length > 0")
            ul
              li(v-for="favChef in favoriteChefs")
                router-link(:to="{ name: 'chef-view', params: { key: favChef.chefKey }}")
                  b {{ favChef.chefInfo.name }}
                  p <span class="heart">♥</span> desde {{ favChef.from }}
            .row.center
              router-link.btn.blue.lighten-1(to="/explore-chefs") Explorar chefs
          div(v-else)
            p Parece que aún no te gusta ningún chef :(
</template>
<script>
  import { DB } from "@/firebase"
  import LikeButton from "@/components/globals/LikeButton.vue"
  export default {
    created() {
      this.loadFavoriteChefs()
    },
    components: { LikeButton },
    data() {
      return {
        isLoadingFavoriteChef: true,
        favoriteChefs: []
      }
    },
    methods: {
      loadFavoriteChefs() {
        const uid = this.$store.state.user.uid
        const favoriteChefsRef = DB.ref(`/users/${ uid }/likes/chefs`)
        const chefsref = DB.ref(`/chefs`)

        /* On child added... */
        favoriteChefsRef.on("child_added", snapshot => {
          chefsref.child(snapshot.key).once("value", chefSnapshot => {
            this.favoriteChefs.push({
              key: snapshot.key,
              chefKey: chefSnapshot.key,
              chefInfo: chefSnapshot.val().info,
              from: snapshot.val().from
            })
          })
        })

        /* On child removed... */
        favoriteChefsRef.on("child_removed", snapshot => {
          this.favoriteChefs = this.favoriteChefs.filter(favoriteChef => favoriteChef.key !== snapshot.key)
        })

        this.isLoadingFavoriteChef = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  li {
    padding: 10px;
    margin-bottom: 2px;
    background: #efefef;
  }

  li > a {
    color: #333;
  }

  li > a > p {
    margin: 0;
  }

  li > a > p > span.heart {
    color: red;
  }

  .pulse {
    animation: pulse 1s infinite;
    font-size: 2rem;
    display: inline-block;
    color: #b91557;
  }

  @keyframes pulse {
    0% {
      transform: scale(1.25);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1.25);
    }
  }
</style>