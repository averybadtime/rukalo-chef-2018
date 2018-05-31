<template lang="pug">
  .row
    h6 Elegir adicionales
    p(v-if="isLoadingAdditional") Obteniendo adiciones...
    ul(v-else)
      li(v-for="add in additional")
        .row
          .col.s6
            label
              input(type="checkbox", @change="setAdditional(add)")
              span {{ add.info.name }}
              br
              em {{ add.info.price | currency }} COP
              br
              em {{ toRukas(add.info.price) }} RUKAS
          template(v-if="add.selected")
            .col.s4
              span(v-model="add.quantity") x{{ add.quantity }} unds.
            .col.s1
              a(@click="addOne(add)") +
            .col.s1
              a(@click="remove(add)") -
    .col.s12
      a.btn-flat(@click="skipAdditional") omitir
      a.btn.red(@click="additionalDone") Siguiente ->
</template>
<script>
  import { DB } from "@/firebase"
  export default {
    created() {
      this.loadAdditional()
    },
    props: {
      chefKey: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        isLoadingAdditional: true,
        additional: [],
        selected: []
      }
    },
    methods: {
      loadAdditional() {
        const additionalRef = DB.ref("/chefs/" + this.chefKey + "/additional")
        return new Promise((done) => {
          additionalRef.once("value", snapshot => {
            snapshot.forEach(additional => {
              this.additional.push({
                key: additional.key,
                info: additional.val(),
                quantity: 1,
                selected: false
              })
            })
            this.isLoadingAdditional = false
            done()
          })
        }).then(() => {
          if (this.additional.length === 0) this.skipAdditional()
        })
      },
      setAdditional(add) {
        add.selected = !add.selected
      },
      addOne(obj) {
        obj.quantity++
      },
      remove(obj) {
        if (obj.quantity > 1) obj.quantity--
      },
      additionalDone() {
        this.selected = this.additional.filter((additional) => additional.selected)
        this.$emit("additionalDone", this.selected)
      },
      skipAdditional() {
        this.$emit("skipAdditional")
      }
    }
  }
</script>
<style lang="scss" scoped>
  .row {
    margin-bottom: 5px;
  }
</style>
