<template lang="pug">
  .card
    .card-image
      img(src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg")
      span.card-title.truncate {{ chef.info.name }}
    .card-content
      .row
        .col.s6
          like-button(:senderRef="'users'",
                      :sender="$store.state.user.uid",
                      :targetRef="'chefs'",
                      :target="chef.key")
        .col.s6
          each star in [1, 2, 3, 4]
            i.material-icons.yellow-text.text-darken-2 star
      .container.center
      p
        b Género
        span &nbsp; {{ gender }}
      .divider
      p
        b Departamento
        span &nbsp; {{ chef.info.department }}
      p
        b Ciudad
        span &nbsp; {{ chef.info.city }}
      br
      router-link.btn.btn-block(:to="{ name: 'chef-view', params: { key: chef.key }}") Ver perfil
</template>
<script>
  import LikeButton from "@/components/globals/LikeButton"
  export default {
    components: { LikeButton },
    props: {
      chef: {
        type: Object,
        required: true
      }
    },
    computed: {
      gender() {
        const gender = this.chef.info.gender
        if (gender === "M") return "Masculino"
        else if (gender === "F") return "Femenino"
        else return "Otro / No especificado"
      }
    },
  }
</script>