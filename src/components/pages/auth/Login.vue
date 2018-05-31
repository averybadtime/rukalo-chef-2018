<template lang="pug">
  main
    .container
      h4.center Inicia sesión
      form(@submit.prevent="login")
        .row
          .col.s12
            label(for="email") E-m@il
            input(type="email", name="email", id="email", placeholder="Correo electrónico", v-model="email")
          .col.s12
            label(for="password") Contraseña
            input(type="password", name="password", id="password", placeholder="Contraseña", v-model="password")
          .col.s12
            input.btn.btn-block(type="submit", value="¡Adelante!")
          .col.s12
            router-link.right(to="/register") ¿No eres miembro aún? ¡Regístrate!
</template>

<script>
  import { AUTH } from "@/firebase"
  export default {
    data() {
      return {
        email: null,
        password: null
      }
    },
    methods: {
      login () {
        const email = this.email
        const password = this.password
        AUTH.signInWithEmailAndPassword(email, password)
          .then(() => {
            this.$router.replace("/")
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
</script>