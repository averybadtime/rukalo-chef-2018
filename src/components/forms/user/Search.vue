<template lang="pug">
  form(@submit.prevent="search")
    .row
      label(for="keyword") Por nombre...
      input(type="text", name="keyword", id="keyword", placeholder="Busca tu plato favorito...", v-model="keyword")
    .row
      label(for="category") Por categoría...
      select(v-model="qCategory")
        option(v-for="category in categories", :value="category.value") {{ category.display }}
    .row
      button.btn.btn-block(type="submit") ¡Buscar!
</template>
<script>
  import dishesCategoriesMixin from "@/mixins/load-dishes-categories"
  export default {
    created() {
      this.loadDishesCategories()
    },
    mixins: [
      dishesCategoriesMixin
    ],
    data() {
      return {
        keyword: "",
        categories: [],
        qCategory: ""
      }
    },
    methods: {
      search() {
        // if (this.keyword.trim() === "" || this.keyword === null || this.keyword === 0) return
        if (this.qCategory.trim() === "" || this.keyword === null || this.keyword === 0) return

        this.$emit("search", {
          keyword: this.keyword,
          category: this.qCategory
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .row {
    margin-bottom: 5px;
  }
</style>
