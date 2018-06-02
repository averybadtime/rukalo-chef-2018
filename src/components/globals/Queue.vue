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
                em {{ dish.name }} x {{ dish.quantity }} unds. ({{ dish.price | currency }}) = {{ dish.quantity * dish.price | currency }} COP
              h6 Total: {{ totalDishes | currency }}

          li(v-if="additional.length > 0")
            b Adiciones
            br
            ul
              li(v-for="add in additional")
                em {{ add.info.name }} x {{ add.quantity }} unds. ({{ add.info.price | currency }}) = {{ add.quantity * add.info.price | currency }} COP
              h6 Total: {{ totalAdditional | currency }}
              
          li(v-if="drinks.length > 0")
            b Bebidas
            br
            ul
              li(v-for="drink in drinks")
                em {{ drink.info.name }} x {{ drink.quantity }} unds. ({{ drink.info.price | currency }}) = {{ drink.quantity * drink.info.price | currency }} COP
              h6 Total: {{ totalDrinks | currency }}
          li.divider
          h6 Total esta factura: {{ toRukas(totalQueue) }} RUKAS
          h6(v-if="$store.state.rukas") Mi saldo en RUKAS: {{ $store.state.rukas.bag }} RUKAS
      template(v-else)
        h4 Oops!
        p Parece que aún no has ordenado algo. :(    
    .modal-footer
      template(v-if="queue.length === 0")
        a.modal-close.waves-effect.waves-green.btn-flat Cerrar
      template(v-else)
        a.modal-close.waves-effect.waves-green.btn-flat(@click="deleteQueue") Eliminar pedido
        a.btn(@click="pay") Pagar y ordenar!
</template>
<script>
  import { DB } from "@/firebase"
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
        const uid = this.$store.state.user.uid
        const queueRef = DB.ref("/users/" + uid + "/queue")
        queueRef.set(newVal).then(() => console.info("queue updated succesfully."))
      }
    },
    computed: {
      queue() {
        return this.$store.state.queue
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
    data() {
      return {
        uid: this.$store.state.user.uid
      }
    },
    methods: {
      listenQueue() {
        const queueRef = DB.ref("/users/" + this.uid + "/queue")
        queueRef.on("value", (snapshot) => {
          if (snapshot.val() !== null) this.$store.commit("setQueue", snapshot.val())
        })
      },
      deleteQueue() {
        if (confirm("¿Eliminar orden actual?")) this.$store.dispatch("deleteQueue").then(() => M.toast({ html: "Pedido eliminado!" }, 2000))
      },
      pay() {
        if (confirm("¿Confirmar orden actual? ** Los tiempos de entrega pueden variar si ordenó a más de un (1) chef.")) {

          const rukasBagRef = DB.ref("/users/" + this.uid + "/rukas/bag")

          rukasBagRef.transaction((bag) => {
            const thisInvoice = this.toRukas(this.totalQueue)
            if (thisInvoice <= bag) {

              const now = moment().locale("es").format("L")
              const invoicesRef = DB.ref("/invoices")

              invoicesRef.push({
                user: this.uid,
                order: this.orderedQueue,
                state: "pending",
                createdAt: now
              }).then(() => {
                this.$store.commit("deleteQueue")
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