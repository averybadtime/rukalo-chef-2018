<template lang="pug">
  .row
    b {{ drink.info.name }}
    h6 {{ drink.info.category }}
    span.red-text {{ drink.info.price | currency }}
    div(v-if="drink.info.volume")
      span {{ drink.info.volume.volumeN }} {{ drink.info.volume.volumeM }}

    edit-drink-form(v-if="showEditForm", @closeEditDrinkForm="closeEditDrinkForm", :drink="drink")

    .row(v-if="!showEditForm")
      .col.s6
        a.btn.btn-block.red.lighten-1(@click="deleteDrink(drink.key)") Eliminar
      .col.s6
        a.btn.btn-block.blue.lighten-1(@click="openEditDrinkForm") Editar
    .divider
</template>
<script>
  import { DB } from "@/firebase"
  import EditDrinkForm from "@/components/forms/chef/EditDrinkForm.vue"
  export default {
    components: {
      EditDrinkForm
    },
    data() {
      return {
        showEditForm: false
      }
    },
    props: {
      drink: {
        type: Object,
        required: true
      }
    },
    methods: {
      openEditDrinkForm() {
        this.showEditForm = true
      },
      closeEditDrinkForm() {
        this.showEditForm = false
      },
      deleteDrink(key) {
        if (confirm("¿Seguro que desea eliminar?")) {
          const uid = this.$store.state.user.uid
          const drinkRef = DB.ref(`/chefs/${ uid }/drinks/${ key }`)
          drinkRef.set(null).then(() => {
            console.log("Eliminado.")
            M.toast({ html: "Eliminado." }, 3000)
          })
        }
      }
    }
  }
</script>