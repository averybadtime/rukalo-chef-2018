<template lang="pug">
  #app
    custom-header(v-if="user")
    queue(v-if="user && isUser")
    .auth
      span {{ $store.state.userInfo.name }}
    transition(name="fade", mode="out-in")
      router-view
    custom-footer
</template>

<script>
  import { DB } from "@/firebase"
  import { store } from "@/store"
  import CustomHeader from "./components/globals/Header.vue"
  import Queue from "./components/globals/Queue.vue"
  import CustomFooter from "./components/globals/Footer.vue"
  export default {
    created() {
    //   const dishesCategories = ["Almuerzo", "Aperitivo", "Brotzeit", "Brunch", "Cena", "Desayuno", "Entrante", "Ensaladas", "Hora del té", "Imbiss", "Merienda", "Postre", "Última comida", "Comida Rápida"]
    //   const drinksCategories = ["Gaseosas", "Naturales", "Hidratantes", "Alcohólicas"]

    //   dishesCategories.forEach(category => {
    //     DB.ref("/food-specs/dishes/categories").push(category)
    //   })

    //   drinksCategories.forEach(drink => {
    //     DB.ref("/food-specs/drinks/categories").push(drink)
    //   })
      this.listenRukas()
      if (this.isUser) {
        this.getUserAddresses()
      }
    },
    components: {
      CustomHeader,
      Queue,
      CustomFooter
    },
    computed: {
      user() {
        return store.state.user
      },
      isUser() {
        return store.state.userInfo.userType === "USER" ? true : false
      }
    },
    methods: {
      listenRukas() {
        if (this.user) {
          const uid = store.state.user.uid
          DB.ref("/users/" + uid + "/rukas").on("value", snapshot => {
            store.commit("setRukas", snapshot.val())
          })
        }
      },
      getUserAddresses() {
        const uid = this.user.uid
        const addressesRef = DB.ref("/users/" + uid + "/addresses")
        addressesRef.on("value", snapshot => store.commit("setUserAddresses", snapshot))
      }
    }
  }
</script>

<style lang="scss">
  @import "../node_modules/materialize-css/sass/materialize";

  .auth {
    background: #ccc;
    padding: 3px 10px;
  }

  .btn-block {
    display: block;
    width: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

    /* Forms
  –––––––––––––––––––––––––––––––––––––––––––––––––– */
  input[type="email"],
  input[type="number"],
  input[type="search"],
  input[type="text"],
  input[type="tel"],
  input[type="url"],
  input[type="password"],
  textarea,
  select {
    height: 30px;
    width: 100%;
    margin-bottom: .5rem;
    padding: 6px 10px; /* The 6px vertically centers text on FF, ignored by Webkit */
    background-color: #fff;
    border: 1px solid #D1D1D1;
    border-radius: 4px;
    box-shadow: none;
    box-sizing: border-box; }
  /* Removes awkward default styles on some inputs for iOS */
  input[type="email"],
  input[type="number"],
  input[type="search"],
  input[type="text"],
  input[type="tel"],
  input[type="url"],
  input[type="password"],
  textarea {
    -webkit-appearance: none;
      -moz-appearance: none;
          appearance: none; }
  textarea {
    min-height: 65px;
    padding-top: 6px;
    padding-bottom: 6px; }
  input[type="email"]:focus,
  input[type="number"]:focus,
  input[type="search"]:focus,
  input[type="text"]:focus,
  input[type="tel"]:focus,
  input[type="url"]:focus,
  input[type="password"]:focus,
  textarea:focus,
  select:focus {
    border: 1px solid #33C3F0;
    outline: 0; }
  label,
  legend {
    display: block;
    margin-bottom: .5rem;
    font-weight: 600; }
  fieldset {
    padding: 0;
    border-width: 0; }
  input[type="checkbox"],
  input[type="radio"] {
    display: inline; }
  label > .label-body {
    display: inline-block;
    margin-left: .5rem;
    font-weight: normal; }
</style>
