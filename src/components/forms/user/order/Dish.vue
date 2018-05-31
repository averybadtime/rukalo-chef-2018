<template lang="pug">
  .row
    .col.s12
      h6 Platillo
    .col.s6
      input(type="number", placeholder="Cantidad", v-model.number="quantity")
    .col.s3
      a(@click="add") Añadir
    .col.s3
      a(@click="remove") Remover
    .col.s12
      a.btn.red(@click="dishDone") Siguiente ->
</template>
<script>
  export default {
    props: {
      dish: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        quantity: 1
      }
    },
    methods: {
      add() {
        this.quantity += 1
      },
      remove() {
        if (this.quantity > 1) this.quantity -= 1
      },
      dishDone() {
        if (this.quantity > 0) {
          this.$emit("dishDone", this.quantity)
        } else {
          alert("No puedes ordenar '0' de un plato.")
        }
      }
    }
  }
</script>