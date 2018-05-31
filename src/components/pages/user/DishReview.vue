<template lang="pug">
  main
    .container

      h5 Calificar orden #8978969
      .divider      
      .row
        h6 Sabor
        .stars.right
          each star in [1, 2, 3, 4, 5]
            i.material-icons.yellow-text.text-darken-2 star
        textarea(placeholder="Comentario", v-model="newReview.taste")
      .divider        
      .row
        h6 Temperatura
        .stars.right
          each star in [1, 2, 3, 4, 5]
            i.material-icons.yellow-text.text-darken-2 star
        textarea(placeholder="Comentario", v-model="newReview.temperature")
      .divider        
      .row
        h6 Puntualidad
        .stars.right
          each star in [1, 2, 3, 4, 5]
            i.material-icons.yellow-text.text-darken-2 star
        textarea(placeholder="Comentario", v-model="newReview.time")
      .divider        
      .row
        h6 Presentación
        .stars.right
          each star in [1, 2, 3, 4, 5]
            i.material-icons.yellow-text.text-darken-2 star
        textarea(placeholder="Comentario", v-model="newReview.look")
      .divider        
      .row
        h6 Precio
        .stars.right
          each star in [1, 2, 3, 4, 5]
            i.material-icons.yellow-text.text-darken-2 star
        textarea(placeholder="Comentario", v-model="newReview.price")
      .row
        a.btn.btn-block.blue.lighten-1 Calificar
</template>
<script>
  export default {
    data() {
      return {
        newReview: {
          taste: "",
          temperature: "",
          time: "",
          look: "",
          price: ""
        }
      }
    }
  }
</script>