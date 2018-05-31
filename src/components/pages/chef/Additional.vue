<template lang="pug">
  main
    .container
      h5 Gestionar mi adiciones

      new-additional-form(@closeNewAdditionalForm="closeNewAdditionalForm", v-if="showNewAdditionalForm")
      a.btn.btn-block.blue.lighten-1(@click="openNewAdditionalForm", v-if="!showNewAdditionalForm") Nueva adición

      transition(name="fade", mode="out-in")
        div(v-if="isLoadingAdditional")
          p Obteniendo mis adiciones...
        div(v-else)
          div(v-if="myAdditional.length > 0")
            template(v-for="additional in myAdditional")
              additional(:additional="additional")
          div(v-else)
            p No tienes adiciones guardadas aún. :(
</template>
<script>
  import { DB } from "@/firebase"
  import Additional from "@/components/chef/Additional.vue"
  import NewAdditionalForm from "@/components/forms/chef/NewAdditionalForm"
  export default {
    created() {
      this.loadAdditional()
    },
    components: {
      Additional,
      NewAdditionalForm
    },
    data() {
      return {
        isLoadingAdditional: true,
        showNewAdditionalForm: false,
        myAdditional: []
      }
    },
    methods: {
      loadAdditional() {
        return new Promise(done => {
          const uid = this.$store.state.user.uid
          const additionalRef = DB.ref(`/chefs/${ uid }/additional`)
          additionalRef.on("child_added", snapshot => {
            this.myAdditional.push({
              key: snapshot.key,
              info: snapshot.val()
            })
          })

          additionalRef.on("child_changed", snapshot => {
            this.myAdditional.forEach((additional, i) => {
              if (additional.key === snapshot.key) {
                this.myAdditional[i].info = snapshot.val()
                return
              }
            })
          })

          additionalRef.on("child_removed", snapshot => {
            this.myAdditional = this.myAdditional.filter(additional => additional.key !== snapshot.key)
          })
          done()
        }).then(() => this.isLoadingAdditional = false)
      },
      openNewAdditionalForm() {
        this.showNewAdditionalForm = true
      },
      closeNewAdditionalForm() {
        this.showNewAdditionalForm = false
      }
    }
  }
</script>