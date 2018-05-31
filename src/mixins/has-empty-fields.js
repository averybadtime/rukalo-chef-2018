var hasEmptyFields = {
  methods: {
    hasEmptyFields(object) {
      for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
          if (object[prop] === null || object[prop].toString().trim() === "" || object[prop] === 0) {
            console.error("No has rellenado todos los campos...")
            alert("No has rellenado todos los campos...")
            return true
          }
        }
      }
      return false
    }
  }
}

export default hasEmptyFields