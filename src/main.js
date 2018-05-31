import Vue from 'vue'
import App from './App.vue'

import VueRouter  from "vue-router"
import VueCurrency from "vue-currency-filter"
import { routes } from "./routes"
import { store } from "./store"
import { AUTH } from "./firebase"

import FileUploader from "./components/globals/FileUploader.vue"

const vueCurrencySettings = {
	symbol : '$',
  thousandsSeparator: '.',
  fractionCount: 0,
  fractionSeparator: ',',
  symbolPosition: 'front',
  symbolSpacing: true
}

Vue.use(VueRouter)
Vue.use(VueCurrency, vueCurrencySettings)

Vue.component("FileUploader", FileUploader)

const router = new VueRouter({
	mode: "history",
	routes
})

router.beforeEach((to, from, next) => {
	let currentUser = AUTH.currentUser
	let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

	if (requiresAuth && !currentUser) next("/login")
	else if (!requiresAuth && currentUser) next ("/")
	else next()

})

var app

const toRukasMixin = {
	methods: {
		toRukas(price) {
			return (price / 2000)
		},
		addDishToQueue(dish) {
			this.$store.state.queue.push(dish)
		}
	}
}

Vue.mixin(toRukasMixin)

AUTH.onAuthStateChanged(user => {
	store.state.user = user
	
	if (!app) {
		app = new Vue({
		  el: '#app',
			router,
			store,
		  render: h => h(App)
		})
	}
})
