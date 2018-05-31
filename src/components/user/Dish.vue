<template lang="pug">
  div(v-if="dish.info")
    span {{ dish.info.name }}
    // like-button(:senderRef="'users'",
    //     :sender="$store.state.user.uid",
    //     :targetRef="'dishes'",
    //     :target="dish.key",
    //     :chefKey="chefKey")
    h6 {{ dish.info.description }}
    h5 {{ dish.info.price | currency }}
    span(v-if="from") <b>Me gusta desde: </b> {{ from }}
    router-link.btn.btn-block(:to="{ name: 'dish-view', params: { chef: chefKey, dish: dish.key }}") Ver plato
    br
    .divider
</template>
<script>
  export default {
    props: {
      dish: {
        type: Object,
        required: true
      },
      chefKey: {
        type: String,
        required: true
      },
      from: {
        type: String,
        default: null
      }
    }
  }
</script>