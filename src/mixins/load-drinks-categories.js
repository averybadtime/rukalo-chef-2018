import { DB } from "@/firebase"
const loadCategories = {
  methods: {
    loadDrinksCategories() {
      if (this.$store.state.drinks.categories) {
        this.categories = this.$store.state.drinks.categories
      } else {
        DB.ref("/food-specs/drinks/categories").once("value", snapshot => {
          snapshot.forEach(category => {
            this.categories.push({
              display: category.val(),
              value: category.key
            })
          })
        })
        this.$store.state.drinks.categories = this.categories
      }
    }
  }
}

export default loadCategories