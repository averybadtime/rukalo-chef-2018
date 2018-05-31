<template lang="pug">
  .section
    router-link(:to="{ name: 'dish-view', params: { chef: dish.chefKey, dish: dish.key } }") • {{ dish.info.name }}

    br
    .chip {{ dish.info.price | currency }} COP
    .chip {{ toRukas(dish.info.price) }} RUKAS
    br


    .row
      
      template(v-if="newOrder.dish")
        h5 Orden
        b Plato:
        br
        em {{ newOrder.dish.name }} x {{ newOrder.dish.quantity }} unds. <b>{{ newOrder.dish.quantity * newOrder.dish.price | currency }}</b>

      br
      template(v-if="newOrder.additional")
        b Adicionales:
        br
        ul
          li(v-for="additional in newOrder.additional")
            em {{ additional.info.name }} x {{ additional.quantity }} unds. <b>{{ additional.quantity * additional.info.price | currency }}</b>

      template(v-if="newOrder.drinks")
        b Bebidas:
        br
        ul
          li(v-for="drink in newOrder.drinks")
            em {{ drink.info.name }} x {{ drink.quantity }} unds. <b>{{ drink.quantity * drink.info.price | currency }}</b>

    .row(v-if="showQuantityField")
      order-dish(v-if="activeTab === 1", :dish="dish", @dishDone="dishDone")
      order-additional(v-if="activeTab === 2", :chefKey="dish.chefKey", @additionalDone="additionalDone", @skipAdditional="skipAdditional")
      order-drink(v-if="activeTab === 3", :chefKey="dish.chefKey", @drinksDone="drinksDone", @skipDrinks="skipDrinks")

    a.btn.green(v-if="!showQuantityField", @click="openQuantityField") Ordenar
    template(v-else)
      a.btn-flat(@click="closeQuantityField") Cancelar
      a.btn.blue.lighten-1(v-if="activeTab === 4", @click="pushToQueue") Agregar
    br
    br
    .divider
</template>
<script>
  import OrderDish from "@/components/forms/user/order/Dish.vue" 
  import OrderAdditional from "@/components/forms/user/order/Additional.vue" 
  import OrderDrink from "@/components/forms/user/order/Drink.vue" 
  export default {
    components: {
      OrderDish,
      OrderAdditional,
      OrderDrink
    },
    props: {
      dish: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        showQuantityField: false,
        activeTab: 0,
        newOrder: {
          chefKey: this.dish.chefKey,
          dish: null,
          additional: null,
          drinks: null
        }
      }
    },
    computed: {
      queue() {
        return this.$store.state.queue
      }
    },
    methods: {
      add() {
        this.quantity += 1
      },
      remove() {
        if (this.quantity > 1) this.quantity -= 1
      },
      openQuantityField() {
        this.showQuantityField = true
        this.activeTab = 1
      },
      closeQuantityField() {
        this.showQuantityField = false,
        this.activeTab = 0,
        this.newOrder = {
          dish: null,
          additional: null,
          drinks: null
        }
      },
      plusTab() {
        this.activeTab++
      },
      dishDone(dishQuantity) {
        
        this.newOrder.dish = {
          key: this.dish.key,
          name: this.dish.info.name,
          quantity: dishQuantity,
          price: this.dish.info.price      
        }
        this.activeTab++
      },
      additionalDone(additionalArray) {
        if (additionalArray.length > 0) this.newOrder.additional = additionalArray
        else this.newOrder.additional = null
        this.activeTab++
      },
      skipAdditional() {
        this.activeTab++
      },
      drinksDone(drinksArray) {
        if (drinksArray.length > 0) this.newOrder.drinks = drinksArray
        else this.newOrder.drinks = null
        this.activeTab++
      },
      skipDrinks() {
        this.activeTab++
      },
      pushToQueue() {
        return new Promise((done) => {
          this.$store.commit("pushToQueue", this.newOrder)
          done()
        }).then(() => {
          this.newOrder = {
            dish: null,
            additional: null,
            drinks: null
          }
          this.activeTab = 0
          this.showQuantityField = false
          M.toast({ html: "Añadido a la cola con éxito." }, 2000)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .row {
    margin-bottom: 5px;
  }
</style>
