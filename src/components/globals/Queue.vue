<template lang="pug">
  #queueModal.modal.modal-fixed-footer
    .modal-content
      template(v-if="queue.length > 0")
        h5 Mi pedido actual
        ul
          li
            b Platillos
            br
            ul
              li(v-for="dish in dishes")
                em {{ dish.name }} x {{ dish.quantity }} unds. ({{ toRukas(dish.price) }} RUKAS) = {{ toRukas(dish.quantity * dish.price) }} RUKAS
              h6 Total: {{ toRukas(totalDishes) }} RUKAS

          li(v-if="additional.length > 0")
            b Adiciones
            br
            ul
              li(v-for="add in additional")
                em {{ add.info.name }} x {{ add.quantity }} unds. ({{ toRukas(add.info.price) }}) RUKAS = {{ toRukas(add.quantity * add.info.price) }} RUKAS
              h6 Total: {{ toRukas(totalAdditional) }} RUKAS
              
          li(v-if="drinks.length > 0")
            b Bebidas
            br
            ul
              li(v-for="drink in drinks")
                em {{ drink.info.name }} x {{ drink.quantity }} unds. ({{ toRukas(drink.info.price) }}) RUKAS = {{ toRukas(drink.quantity * drink.info.price) }} RUKAS
              h6 Total: {{ toRukas(totalDrinks) }} RUKAS
          li.divider
          h6 Total esta factura: {{ toRukas(totalQueue) }} RUKAS
          h6(v-if="$store.state.rukas") Mi saldo en RUKAS: {{ rukasBag }} RUKAS

          .row
            .col.s12
              h5 Elige la dirección

              input(type="radio", v-model="address", value="a")
              span Elegir de mis direcciones
              |&nbsp;
              input(type="radio", v-model="address", value="b")
              span Escribir dirección

              div(v-if="address === 'a'")
                template(v-if="addresses.length > 0")
                  select(v-model="selectedAddress")
                    option(v-for="address in addresses", :value="address.key") {{ address.data.address }}
                p(v-else) Aún no has guardado una dirección.
              
              div(v-else-if="address === 'b'")
                input(type="text", v-model="customAddress", placeholder="Dirección")
          
      template(v-else)
        h4 Oops!
        p Parece que aún no has ordenado. :(    
    .modal-footer
      template(v-if="queue.length === 0")
        a.modal-close.waves-effect.waves-green.btn-flat Cerrar
      template(v-else)
        a.modal-close.waves-effect.waves-green.btn-flat(@click="deleteQueue") Eliminar pedido
        a.btn(@click="pay") Pagar y ordenar!
</template>
<script>
  import { DB } from "@/firebase"
  import { store } from "@/store"
  import queueHelper from "@/helpers/queue"
  import moment from "moment"
  export default {
    created() {
      this.listenQueue()
    },
    mounted() {
      $("#queueModal").modal()
    },
    watch: {
      queue(newVal) {
        const uid = store.state.user.uid
        const queueRef = DB.ref("/users/" + uid + "/queue")
        queueRef.set(newVal)
      }
    },
    data() {
      return {
        uid: store.state.user.uid,
        address: "a",
        customAddress: "",
        selectedAddress: ""
      }
    },
    computed: {
      addresses() {
        return store.state.userAddresses
      },
      rukasBag() {
        return store.state.rukas.bag
      },
      queue() {
        return store.state.queue
      },
      dishes() {
        var dishes = []
        for (let i in this.orderedQueue) {
          for (let j in this.orderedQueue[i].dishes) {
            dishes.push(this.orderedQueue[i].dishes[j])
          }
        }
        return dishes
      },
      additional() {
        var additional = []
        for (let i in this.orderedQueue) {
          for (let j in this.orderedQueue[i].additional) {
            additional.push(this.orderedQueue[i].additional[j])
          }
        }
        return additional
      },
      drinks() {
        var drinks = []
        for (let i in this.orderedQueue) {
          for (let j in this.orderedQueue[i].drinks) {
            drinks.push(this.orderedQueue[i].drinks[j])
          }
        }
        return drinks
      },
      totalDishes() {
        var total = 0
        this.dishes.forEach((dish) => {
          const partial = (dish.quantity * dish.price)
          total += partial
        })
        return total
      },
      totalAdditional() {
        var total = 0
        this.additional.forEach((add) => {
          const partial = (add.quantity * add.info.price)
          total += partial
        })
        return total
      },
      totalDrinks() {
        var total = 0
        this.drinks.forEach((drink) => {
          const partial = (drink.quantity * drink.info.price)
          total += partial
        })
        return total
      },
      totalQueue() {
        const totalQueue = (this.totalDishes + this.totalAdditional + this.totalDrinks)
        return totalQueue
      },
      orderedQueue() {
        return queueHelper.sortQueueByChef(this.queue)
      }
    },
    methods: {
      listenQueue() {
        const queueRef = DB.ref("/users/" + this.uid + "/queue")
        queueRef.on("value", (snapshot) => {
          if (snapshot.val() !== null) store.commit("setQueue", snapshot.val())
        })
      },
      deleteQueue() {
        if (confirm("¿Eliminar orden actual?")) store.dispatch("deleteQueue").then(() => M.toast({ html: "Pedido eliminado!" }, 2000))
      },
      getTotalOrder(order) {
        let total = 0
        order.dishes.forEach((dish) => total += dish.price * dish.quantity)
        order.additional.forEach((add) => total += add.info.price * add.quantity)
        order.drinks.forEach((drink) => total += drink.info.price * drink.quantity)
        return this.toRukas(total)
      },
      payToChef(order) {
        const chefRukasBagRef = DB.ref("/chefs/" + order.chefKey + "/rukas/bag")
                  
        chefRukasBagRef.transaction((chefBag) => {
          if (!chefBag) chefBag = 0
          const totalOrder = this.getTotalOrder(order)
          chefBag += totalOrder
          return chefBag
        })
      },
      pay() {
        let address
        if (this.address === "a") {
          if (this.selectedAddress === "") {
            const message = "No has seleccionado una dirección."
            console.error(message)
            alert(message)
            return
          }
          for (let i in this.addresses) {
            if (this.addresses[i].key === this.selectedAddress) {
              address = this.addresses[i].data.address
              break
            }
          }
        } else if (this.address === "b") {
          if (this.customAddress === "") {
            const message = "Proporciona una dirección."
            console.error(message)
            alert(message)
            return
          }
          address = this.customAddress
        }

        if (confirm("¿Confirmar orden actual? ** Los tiempos de entrega pueden variar si ordenó a más de un (1) chef.")) {

          const rukasBagRef = DB.ref("/users/" + this.uid + "/rukas/bag")
          rukasBagRef.transaction((bag) => {
            const thisInvoice = this.toRukas(this.totalQueue)
            if (thisInvoice <= bag) {
              const now = moment().locale("es").format("L")
              const invoicesRef = DB.ref("/invoices")
              invoicesRef.push({
                user: this.uid,
                address: address,
                order: this.orderedQueue,
                createdAt: now
              }).then(() => {
                this.orderedQueue.forEach((order) => {
                  this.payToChef(order)
                })
                store.commit("deleteQueue")
                M.toast({ html: "Pedido añadido con éxito" }, 2000)
              })
              bag -= thisInvoice
            } else {
              const message = "Saldo insuficiente, te invitamos a recargar rukas :)"
              console.error(message)
              alert(message)
            }
            return bag
          })
        }
      }
    }
  }
</script>