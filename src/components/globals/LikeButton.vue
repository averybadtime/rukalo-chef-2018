<template lang="pug">
  a.like-button(@click="toggleLike", :class="{ like: like, 'no-like': !like }")
    i.material-icons favorite
    span(v-if="!like") &nbsp;Me gusta
    span(v-if="like") &nbsp;Ya no me gusta
</template>
<script>
  import { DB } from "@/firebase"
  import moment from "moment"
  export default {
    created() {
      this.startListenLike()
    },
    props: {
      sender: {
        type: String,
        required: true
      },
      senderRef: {
        type: String,
        required: true
      },
      target: {
        type: String,
        required: true
      },
      targetRef: {
        type: String,
        required: true
      },
      /* Only usen when targetRef is "dishes" */
      chefKey: {
        type: String,
        default: null
      },
      /* ==================================== */
      additionalData: {
        type: Object,
        default: null
      }
    },
    data: () => {
      return {
        like: null
      }
    },
    methods: {
      startListenLike() {
        const favoriteRef = this.setReference()
        favoriteRef.on("child_added", snapshot => this.like = true)
        favoriteRef.on("child_removed", snapshot => this.like = false)
      },
      toggleLike() {
        const favoriteRef = this.setReference()
        var refExists
        favoriteRef.once("value", snapshot => refExists = snapshot.exists())

        if (refExists) favoriteRef.set(null)
        else {
          const now = moment().locale("es").format("L")
          var data = { from: now }
          
          if (this.additionalData === null) console.info("Has no additional data...")
          else data = Object.assign(this.additionalData, data)
          
          favoriteRef.set(data)
        }
      },
      setReference() {
        const a = this.senderRef,
              b = this.sender,
              c = this.targetRef,
              d = this.chefKey,
              e = this.target

        const regularRef = DB.ref(`/${ a }/${ b }/likes/${ c }/${ e }`)
        const refForDish = DB.ref(`/${ a }/${ b }/likes/${ c }/${ d }/${ e }`)

        return c === "dishes" ? refForDish : regularRef
      }
    }
  }
</script>
<style lang="scss" scoped>
  .like-button {
    cursor: pointer !important;
    transition: all .25s;
    display: flex;
    align-items: center;
    font-weight: bold;
  }
  .like-button > i.material-icons {
    font-size: 18px;
  }
  .like {
    color: red;
    animation: pulse .4s 1;
  }
  .no-like {
    color: blue;
  }

  @keyframes pulse {
    0% {
      font-size: 1em;
    }
    25% {
      font-size: 1.15em;
    }
    50% {
      font-size: 1em;
    }
    75% {
      font-size: 1.15em;
    }
    100% {
      font-size: 1em;
    }
  }

</style>