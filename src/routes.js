import Login from "@/components/pages/auth/Login.vue"
import Register from "@/components/pages/auth/Register.vue"
import Home from "@/components/pages/Home.vue"

/* User routes */
import ExploreChefs from "@/components/pages/user/ExploreChefs.vue"
import FavoriteChefs from "@/components/pages/user/FavoriteChefs.vue"
import Chef from "@/components/pages/user/Chef.vue"
import FavoriteDishes from "@/components/pages/user/FavoriteDishes.vue"
import Dish from "@/components/pages/user/Dish.vue"
import Orders from "@/components/pages/user/Orders.vue"
import DishReview from "@/components/pages/user/DishReview.vue"

/* Chef routes */
import ChefDishes from "@/components/pages/chef/Dishes.vue"
import ChefDish from "@/components/pages/chef/Dish.vue"
import ChefDrinks from "@/components/pages/chef/Drinks.vue"
import ChefAdditional from "@/components/pages/chef/Additional.vue"

import Profile from "@/components/pages/Profile.vue"
import NotFound from "@/components/pages/NotFound.vue"

export const routes = [


	{
		path: "/review",
		component: DishReview,
		meta: {
			requiresAuth: true
		}
	},


	{
		path: "/login",
		component: Login
	}, {
		path: "/register",
		component: Register
	}, {
		path: "/",
		component: Home,
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/explore-chefs",
		component: ExploreChefs,
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/me/favorite-chefs",
		component: FavoriteChefs,
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/chef/:key",
		component: Chef,
		name: 'chef-view',
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/me/favorite-dishes",
		component: FavoriteDishes,
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/chef/:chef/dish/:dish",
		component: Dish,
		name: "dish-view",
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/me/orders",
		component: Orders,
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/me/dishes",
		component: ChefDishes,
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/me/dish/:key",
		component: ChefDish,
		name: "chef-dish-view",
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/me/drinks",
		component: ChefDrinks,
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/me/additional",
		component: ChefAdditional,
		meta: {
			requiresAuth: true
		}
	}, {
		path: "/profile",
		component: Profile,
		meta: {
			requiresAuth: true
		}
	}, {
		path: "*",
		component: NotFound,
		name: "not-found",
		meta: {
			requiresAuth: true
		}
	}
]