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
  import moment from "moment"
  export default {
    created() {
      this.listenQueue()
    },
    mounted() {
      $("#queueModal").modal()
    },
    computed: {
      queue() {
        return this.$store.state.queue
      },
      dishes() {

        var dishes = []
        this.queue.forEach((order) => {
          dishes.push(order.dish)
        })
        return dishes
      },
      additional() {
        
        var additional = []
        this.queue.forEach((order) => {
          for (let i in order.additional) {
            additional.push(order.additional[i])
          }
        })
        return additional
      },
      drinks() {

        var drinks = []
        this.queue.forEach((order) => {
          for (let i in order.drinks) {
            drinks.push(order.drinks[i])
          }
        })
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
      }
    },
    watch: {
      queue(newVal) {
        const uid = this.$store.state.user.uid
        const queueRef = DB.ref("/users/" + uid + "/queue")
        queueRef.set(newVal)
      }
    },
    methods: {
      listenQueue() {
        const uid = this.$store.state.user.uid
        const queueRef = DB.ref("/users/" + uid + "/queue")
        queueRef.on("value", (snapshot) => {
          if (snapshot.val() !== null) this.$store.commit("setQueue", snapshot.val())
        })
      },
      deleteQueue() {
        if (confirm("¿Eliminar orden actual?")) this.$store.dispatch("deleteQueue").then(() => M.toast({ html: "Pedido eliminado!" }, 2000))
      },
      pay() {
        if (confirm("¿Confirmar orden actual?")) {

          const uid = this.$store.state.user.uid
          const rukasBagRef = DB.ref("/users/" + uid + "/rukas/bag")
          
          // DB.ref("/invoices").on("child_added", invoice => {
          //   console.log(invoice.val())
          // })

          // rukasBagRef.transaction((bag) => {
          //   const thisInvoice = this.toRukas(this.totalQueue)
          //   if (thisInvoice <= bag) {

              const now = moment().locale("es").format("L")
          //     const invoicesRef = DB.ref("/invoices")

              // Organizar el queue por chef para guardarla

              // invoices...
                // códigoDeFactura
                  // createdAt...
                  // user
                  // order
                    // chef 1
                      // dishes
                        // 0
                         // 1
                        // 2
                      // additional
                        // 0
                    // chef 2

                    // chef 3



              var newInvoice = {
                user: uid,

                createdAt: now
              }

              var chefs = {}
              var  newQueue = []

              var copyQueue = JSON.parse(JSON.stringify(this.queue))

              copyQueue.forEach((order, i) => {

                const dish = order.dish
                const additional = order.additional || null
                const drinks = order.drinks || null
                const chefKey = order.chefKey

                if (chefs.hasOwnProperty(chefKey)) {

                  const index = chefs[chefKey]


                  newQueue[index].dishes.forEach((i) => {
                    if (i.key === dish.key) {
                      i.quantity += dish.quantity
                      return
                    } else {
                      newQueue[index].dishes.push(dish)
                    }
                  })

                  if (additional) {
                    if (!newQueue[index].additional) newQueue[index].additional = []
                    additional.forEach((add) => {
                      newQueue[index].additional.forEach((i) => {
                        console.log(add)
                        console.log(i)
                        if (i.key === add.key) {
                          i.quantity += add.quantity
                          return
                        } else {
                          newQueue[index].additional.push(add)
                        }
                      })
                    })
                  }

                  if (drinks) {
                    if (!newQueue[index].drinks) newQueue[index].drinks = []
                    drinks.forEach((drink) => {
                      newQueue[index].drinks.forEach((i) => {
                        if (i.key === drink.key) {
                          i.quantity += drink.quantity
                          return
                        } else {
                          newQueue[index].drinks.push(drink)
                        }
                      })
                    })
                  }

                } else {
                  var size = Object.keys(chefs).length
                  chefs[chefKey] = size

                  newQueue[size] = {
                    dishes: [dish],
                    additional: additional,
                    drinks: drinks
                  }
                }
              })

              // console.log(chefs)
              // console.log("Esta es mi queue original...")
              // console.log(JSON.parse(JSON.stringify(this.queue)))
              // console.log("==========================================================")
              // console.log("Esta es mi queue customizada...")
              // console.log(JSON.parse(JSON.stringify(newQueue)))
              
          //     invoicesRef.push({
          //       user: uid,
          //       order: this.queue,
          //       state: "pending",
          //       createdAt: now
          //     }).then(() => {
          //       this.$store.commit("deleteQueue")
          //       M.toast({ html: "Pedido añadido con éxito" }, 2000)
          //     })
          //     bag -= thisInvoice
          //   } else {
          //     const message = "Saldo insuficiente, te invitamos a recargar rukas :)"
          //     console.error(message)
          //     alert(message)
          //   }
          //   return bag
          // })
        }
      }
    }
  }
</script>