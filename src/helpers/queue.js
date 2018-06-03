function sortDishes(dishes, dish) {
  let dishFound = false

  for (let i in dishes) {
    if (dishes[i].key === dish.key) {
      dishes[i].quantity += dish.quantity
      dishFound = true
      break
    }
  }

  if (!dishFound) {
    dishes.push(dish)
  }
}

function sortAdditionalAndDrinks(inside, toPush) {
  if (toPush) {
    for (let i in toPush) {
      let found = false
      if (inside.length > 0) {
        for (let j in inside) {
          if (toPush[i].key === inside[j].key) {
            inside[j].quantity += toPush[i].quantity
            found = true
            break
          }
        }
        if (!found) {
          inside.push(toPush[i])
        }
      } else {
        inside.push(toPush[i])
      }
    }
  }
}

function sortQueueByChef(queue) {
  let chefs = []
  let newQueue = []

  let copyQueue = JSON.parse(JSON.stringify(queue))

  copyQueue.forEach((order) => {
    const dish = order.dish
    const additional = order.additional || []
    const drinks = order.drinks || []
    const chefKey = order.chefKey

    const exists = chefs.includes(chefKey)                  // chef exists?
    const index = exists ? chefs.indexOf(chefKey) : null    // if exists, get index

    if (exists) {
      let thisOrder = newQueue[index]

      sortDishes(thisOrder.dishes, dish)
      sortAdditionalAndDrinks(thisOrder.additional || [], additional)
      sortAdditionalAndDrinks(thisOrder.drinks || [], drinks)
    } else {
      const newIndex = (chefs.push(chefKey) - 1)
      
      newQueue[newIndex] = {
        dishes: [dish],
        additional,
        drinks,
        chefKey,
        state: "PENDING"
      }
    }
  })
  return newQueue
}

module.exports = {
  sortQueueByChef
}