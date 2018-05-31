<template lang="pug">
  main
    .container
      h4.center Regístrate
      form(@submit.prevent="register")
        .row
          .col.s12
            label(for="email") E-m@il
            input(type="email", name="email", id="email", placeholder="Correo electrónico", v-model="newUser.email")
          .col.s12
            label(for="password") Contraseña
            input(type="password", name="password", id="password", placeholder="Contraseña", v-model="newUser.password")
          .col.s12
            label(for="name") Nombre completo
            input(type="text", name="name", id="name", placeholder="Tu nombre", v-model="newUser.name")
          .col.s12
            label(for="gender") Género
            select(v-model="newUser.gender")
              option(v-for="gender in genders", :value="gender.value") {{ gender.display }}
          .col.s12
            label(for="user-type") Tipo de usuario
            select(v-model="newUser.userType")
              option(v-for="type in userTypes", :value="type.value") {{ type.display }}
          .col.s12
            label(for="department") Departamento
            select(v-model="newUser.department")
              option(v-for="department in departments", :value="department.value") {{ department.display }}
          .col.s12
            label(for="city") Ciudad
            select(v-model="newUser.city")
              option(v-for="city in cities", :value="city.value") {{ city.display }}
          .col.s12
            input.btn.btn-block(type="submit", value="¡Adelante!")
          .col.s12
            router-link.right(to="/login") ¿Ya eres miembro? ¡Inicia sesión!
</template>
<script>
  import { DB, AUTH } from "@/firebase"
  import { mapState } from "vuex"
  export default {
    data() {
      return {
        newUser: {
          email: null,
          password: null,
          name: null,
          gender: "",
          userType: "",
          department: "",
          city: ""
        }
      }
    },
    computed: mapState(["cities", "departments", "genders", "userTypes"]),
    methods: {
      register() {
        /* Validate empty or null fields */
        for (const prop in this.newUser) {
          if (this.newUser.hasOwnProperty(prop)) {
            if (this.newUser[prop] === null || this.newUser[prop].trim() === "") {
              console.error("No ha rellenado todos los campos.")
              return
            }
          }
        }

        if (this.newUser.userType === "USER") this.createNewUserFromGivenData("users")
        else if (this.newUser.userType === "CHEF") this.createNewUserFromGivenData("chefs")
        
      },
      createNewUserFromGivenData(refNode = "users") {
        /* Inputs */
        const email = this.newUser.email
        const password = this.newUser.password
        const name = this.newUser.name
        const gender = this.newUser.gender
        const userType = this.newUser.userType
        const department = this.newUser.department
        const city = this.newUser.city

        /* Create user */
        AUTH.createUserWithEmailAndPassword(email, password)
          .then(user => {
            const uid = user.uid
            DB.ref(`/${ refNode }/${ uid }/info`).update({
                  name: name,
                  gender: gender,
                  phoneNumber: "",
                  userType: userType,
                  department: department,
                  city: city,
                  rate: 0
                })
                this.$router.replace("/")
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
</script>