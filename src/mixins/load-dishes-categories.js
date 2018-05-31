import { DB } from "@/firebase"
const loadCategories = {
  methods: {
    loadDishesCategories() {
      if (this.$store.state.dishes.categories) {
        this.categories = this.$store.state.dishes.categories
      } else {
        DB.ref("/food-specs/dishes/categories").once("value", snapshot => {
          snapshot.forEach(category => {
            this.categories.push({
              display: category.val(),
              value: category.key
            })
          })
          this.$store.state.dishes.categories = this.categories
        })
      }
    }
  }
}

export default loadCategories