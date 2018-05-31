<template lang="pug">
	main
		.container
			h5 Inicio de la app
			search(@search="search")

			.row
				.col.s12
					b(v-if="rukas") Cantidad de rukas: {{ rukas.bag }}
			.row
				ul
					li(v-for="dish in dishesResults")
						dish-result(:dish="dish")
</template>
<script>
	import { DB } from "@/firebase"
	import DishResult from "@/components/user/DishResult.vue"
	import Search from "@/components/forms/user/Search.vue"
	export default {
		components: {
			DishResult,
			Search
		},
		computed: {
			dishesResults() {
				return this.$store.state.dishesResults
			},
			rukas() {
				return this.$store.state.rukas
			}
		},
		methods: {
			search(payload) {
				this.$store.state.dishesResults = []
				DB.ref("/chefs").once("value", snapshot => {
					snapshot.forEach(chefSnapshot => {
						const dishesSnapshot = chefSnapshot.ref.child("dishes").orderByChild("category").equalTo(payload.category)
						// on child added
						dishesSnapshot.on("child_added", dishSnapshot => {
							this.$store.state.dishesResults.push({
								key: dishSnapshot.key,
								info: dishSnapshot.val(),
								chefKey: chefSnapshot.key
							})
						})
						// on child removed
						dishesSnapshot.on("child_removed", dishSnapshot => {
							this.dishes = this.dishes.filter(dish => dish.key !== dishSnapshot.key)
						})
					})
				})
			}
		}
	}
</script>