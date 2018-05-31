<template lang="pug">
  main
    .container

      transition(name="fade", mode="out-in")
        edit-dish-form(@closeEditDishForm="closeEditDishForm", v-if="showEditDishForm", :dish="editDish")

      h5.center Detalle de plato
      transition(name="fade", mode="out-in")
        div(v-if="isLoadingDish")
          p Obteniendo detalles del plato...
        div(v-else)
          div(v-if="dish")
            img.responsive-img(:src="dish.imgUrl || 'http://placehold.jp/350x350.png'")
            file-uploader(v-if="!dish.imgUrl", :reference="`/chefs/${$store.state.user.uid}/dishes/${$route.params.key}`")
            // Mostrando el plato

            p <em><b>Nombre: </b></em> {{ dish.name }}
            p <em><b>Precio: </b></em> {{ dish.price | currency }}
            p <em><b>Categoría: </b></em> {{ dish.category }}
            p <em><b>Descripción: </b></em> {{ dish.description }}
            a.btn.btn-block.blue.lighten-1(@click="openEditDishForm") Editar plato


            
            p <em><b>Ingredientes: </b></em>
              ul
                li(v-for="ingredient in dish.ingredients") {{ ingredient.name }} x {{ ingredient.quantity }}grs

            edit-ingredients-form(v-if="showEditIngredientsForm",
                                  @removeIngredient="removeIngredient",
                                  @updateIngredients="updateIngredients",
                                  @closeEditIngredientsForm="closeEditIngredientsForm",
                                  :ingredients="dish.ingredients")

            a(v-if="!showEditIngredientsForm", @click="openEditIngredientsForm") Editar ingredientes

          div(v-else)
            p No existe el plato que buscas. :(
</template>
<script>
  import { DB } from "@/firebase"
  import EditIngredientsForm from "@/components/forms/chef/EditIngredientsForm.vue"
  import EditDishForm from "@/components/forms/chef/EditDishForm.vue"
  export default {
    created() {
      this.loadDish(this.dishKey)
    },
    components: {
      EditIngredientsForm,
      EditDishForm
    },
    watch: {
      "$route"(to) {
        this.dishKey = to.params.key
      },
      dishKey() {
        this.loadDish(this.dishKey)
      }
    },
    data() {
      return {
        dishKey: this.$route.params.key,
        isLoadingDish: true,
        dish: null,
        initIngredients: null,
        showEditDishForm: false,
        showEditIngredientsForm: false,
        dishRef: null
      }
    },
    computed: {
      editDish() {
        return {
          key: this.dishKey,
          info: this.dish
        }
      }
    },
    methods: {
      loadDish(key) {
        const uid = this.$store.state.user.uid
        this.dishRef = DB.ref(`/chefs/${ uid }/dishes/${ this.dishKey }`)
        this.dishRef.on("value", snapshot => {
          this.dish = snapshot.val()
          this.isLoadingDish = false
          this.initIngredients = Object.assign({}, this.ingredients)
        })
      },
      openEditDishForm() {
        this.showEditDishForm = true
      },
      closeEditDishForm() {
        this.showEditDishForm = false
      },
      openEditIngredientsForm() {
        this.showEditIngredientsForm = true
      },
      removeIngredient(ingredient) {
        this.dish.ingredients = this.dish.ingredients.filter(x => x !== ingredient)
      },
      updateIngredients(newIngredients) {
        this.dishRef.child("ingredients")
          .set(this.dish.ingredients)
          .then(() => {
            const msg = "Actualizados los ingredientes con éxito."
            console.info(msg)
            M.toast({ html: msg }, 3000)
            this.closeEditIngredientsForm()
          })
      },
      closeEditIngredientsForm() {
        this.showEditIngredientsForm = false
        this.restartIngredients()
      },
      restartIngredients() {
        this.dish.ingredients = this.initIngredients
      }
    }
  }
</script>