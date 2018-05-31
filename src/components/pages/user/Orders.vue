<template lang="pug">
  main
    .container
      h5 Mis órdenes

      .divider
      h6 Órdenes activas
      .row
        div(v-if="activeOrders.length > 0")
          em Hay órdenes activas...
        div(v-else)
          em No hay órdenes activas...
      
      .divider
      h6 Órdenes pendientes
      .row
        div(v-if="pendingOrders.length > 0")
          em Hay órdenes pendientes...
        div(v-else)
          em No hay órdenes pendientes...
</template>
<script>
  import { DB } from "@/firebase"
  export default {
    created() {
      const uid = this.$store.state.user.uid
      this.ordersReference = DB.ref(`/users/${ uid }/orders`)
      this.loadActiveOrders()
      this.loadPendingOrders()
    },
    data() {
      return {
        ordersReference: null,
        activeOrders: [],
        pendingOrders: []
      }
    },
    methods: {
      loadActiveOrders() {
        this.ordersReference.child("active").on("value", snapshot => {
          console.log(snapshot)
        })
      },
      loadPendingOrders() {
        this.ordersReference.child("pending").on("value", snapshot => {
          console.log(snapshot)
        })
      },
      loadLastestCompleteOrders() {

      }
    }
  }
</script>