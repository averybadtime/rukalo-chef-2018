<template lang="pug">
  li.collection-item.avatar
    img.circle(:src="dish.info.imgUrl || 'http://placehold.jp/350x350.png'")
    span.title.truncate {{ dish.info.name }}
    p <b>{{ dish.info.price | currency }}</b> <br>
      span.truncate {{ dish.info.description }}
    .row
      .col.s6
        router-link.btn.btn-block(:to="{ name: 'chef-dish-view', params: { key: dish.key }}") Ver
      .col.s6
        a.btn.btn-block.red.lighten-1(@click="deleteDish(dish)")
          i.material-icons delete_forever
</template>
<script>
  import { DB } from "@/firebase"
  export default {
    props: {
      dish: {
        type: Object,
        required: true
      }
    },
    methods: {
      deleteDish(dish) {
        const uid = this.$store.state.user.uid
        const dishRef = DB.ref(`/chefs/${ uid }/dishes/${ dish.key }`)

        if (confirm(`¿Seguro desea eliminar "${ dish.info.name }"?`)) {
          dishRef.remove().then(() => {
            console.log(`${ dish.info.name } eliminado con éxito...`)
            M.toast({ html: `${ dish.info.name } eliminado con éxito...` }, 3000)
          })
        }
      }
    }
  }
</script>