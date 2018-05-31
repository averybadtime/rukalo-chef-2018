<template lang="pug">
	header
		.navbar-fixed
			nav
				.nav-wrapper
					router-link.brand-logo(to="/") RC
					a.sidenav-trigger(data-target="mobile-demo", href="#!")
						i.material-icons menu
					
					a.right.queue(@click="openQueueModal") Queue

		ul.sidenav#mobile-demo
			li
				router-link.sidenav-close(to="/") Inicio

			// User routes...
			li(v-if="isUser()")
				router-link.sidenav-close(to="/explore-chefs") Explorar chefs
			li(v-if="isUser()")
				router-link.sidenav-close(to="/me/favorite-chefs") Chefs favoritos
			li(v-if="isUser()")
				router-link.sidenav-close(to="/me/favorite-dishes") Platos favoritos
			li(v-if="isUser()")
				router-link.sidenav-close(to="/me/orders") Mis órdenes

			// Chefs routes
			li(v-if="isChef()")
				router-link.sidenav-close(to="/me/dishes") Gestionar platos
			li(v-if="isChef()")
				router-link.sidenav-close(to="/me/drinks") Gestionar bebidas
			li(v-if="isChef()")
				router-link.sidenav-close(to="/me/additional") Gestionar adicionales
			li
				router-link.sidenav-close(to="/profile") Perfil


			li(v-if="this.$store.state.user")
				a.sidenav-close(@click="signOut") Cerrar sesión
</template>

<script>
	import { DB, AUTH } from "@/firebase"
	export default {
		created() {
			if (this.$store.state.user) {
        /* uid */
        const uid = this.$store.state.user.uid

        var isUser

        /* loginAttemp is user? */
        DB.ref(`/users/${ uid }`).once("value", snapshot => {
          isUser = snapshot.exists()
        }).then(() => {
          var dbRef
          
          /* is user... */
          if (isUser) dbRef = DB.ref(`/users/${ uid }/info`)
          /* is chef... */
          else  dbRef = DB.ref(`/chefs/${ uid }/info`)

          /* get user info */
          dbRef.on("value", snapshot => {
            this.$store.state.userInfo = snapshot.val()
          })
        })
      }
		},
		mounted() {
			$(".sidenav").sidenav()
		},
		methods: {
			openQueueModal() {
				$("#queueModal").modal("open")
			},
			isUser() {
				return this.$store.state.userInfo.userType === "USER"
			},
			isChef() {
				return this.$store.state.userInfo.userType === "CHEF"
			},
			signOut() {
				AUTH.signOut()
					.then(() => {
						this.$store.state.user = null
						this.$store.state.userInfo = {}
						this.$router.replace("/login")
					})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.queue {
		margin-right: 18px;
	}
</style>
