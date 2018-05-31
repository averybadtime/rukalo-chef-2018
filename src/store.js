import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {

    dishesResults: [],

    queue: [],

    drinks: {
      categories: null,
      measures: [
        { display: "mililitros (mls.).", value: "MLS" },
        { display: "litro(s) (lts.)", value: "LTS" },
        { display: "centímetro(s) cúbico(s) (cc.)", value: "CC" }
      ]
    },

    dishes: {
      categories: null
    },

    cities: [
      { display: "Barranquilla", value: "BARRANQUILLA" }
    ],

    departments: [
      { display: "Atlántico", value: "ATLANTICO" }
    ], 

    genders: [
      { display: "Masculino", value: "M" },
      { display: "Feminino", value: "F" },
      { display: "Otro", value: "O"}
    ],

    rukas: null,
    
    user: null,
    userInfo: {},
    userAddresses: null,
    userTypes: [
      { display: "Usuario", value: "USER" },
      { display: "Chef", value: "CHEF" }
    ]
  },
  mutations: {
    setRukas(state, payload) {
      state.rukas = payload
    },

    setUserAddresses(state, payload) {
      state.userAddresses = []
      payload.forEach(snapshot => {
        state.userAddresses.push({
          key: snapshot.key,
          data: snapshot.val()
        })  
      })
    },

    setQueue(state, payload) {
      state.queue = payload
    },

    pushToQueue(state, payload) {
      state.queue.push(payload)
    },

    deleteQueue(state) {
      state.queue = []
    }
  },
  actions: {
    deleteQueue({ commit }) {
      return new Promise((done) => {
        commit("deleteQueue")
        done()
      })
    }
  }
})