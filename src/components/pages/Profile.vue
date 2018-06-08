<template lang="pug">
  main


    modal
      template(slot="title") Añadir dirección
      template(slot="body")
        form
          .row
            .col.s12
              label(for="name") Nombre
              input(type="text", name="name", id="name", placeholder="Nombre", v-model="address.name")
            .col.s12
              label(for="address") Dirección
              input(type="text", name="address", id="address", placeholder="Dirección", v-model="address.address")
            .col.s12
              label(for="phoneNumber") Número telefónico
              input(type="number", name="phoneNumber", id="phoneNumber", placeholder="Número telefónico"
                v-model="address.phoneNumber")
      template(slot="buttons")
        a.btn.red.lighten-1.modal-close Cancelar
        a.btn(@click.prevent="addAddress") Añadir


    .container.center
      picture
        img.avatar(:src="$store.state.userInfo.imgUrl || 'http://via.placeholder.com/350x350'")
      .row
        a(@click="showFileUploader = !showFileUploader") Cambiar foto de perfil
      file-uploader(v-if="showFileUploader", :reference="reference")
      h5 {{ $store.state.userInfo.name }}
      .user-type {{ userType }}
    .container
      .row(v-if="userType ==='USER'")
        h5 Mis direcciones
        .divider
        .row
          .col.s12
            div(v-if="addresses && addresses.length > 0")
              div(v-for="address in addresses")
                address-card(:address="address")
            div(v-else)
              p No has guardado direcciones aún.
            .row
              a.btn.btn-block(@click="openModal")
                i.material-icons.left home
                | Añadir dirección
</template>

<script>
  import { STORAGE, DB } from "@/firebase"
  import { store } from "@/store"
  import AddressCard from "@/components/user/AddressCard.vue"
  import Modal from "@/components/Modal.vue"
  export default {
    components: {
      AddressCard,
      Modal
    },
    data() {
      return {
        showFileUploader: false,
        address: {
          name: null,
          address: null,
          phoneNumber: null
        }
      }
    },
    computed: {
      reference() {
        const uid = store.state.user.uid
        return this.userType === "USER" ? `/users/${ uid }/info` : `/chefs/${ uid }/info`
      },
      addresses() {
        return store.state.userAddresses
      },
      userType() {
        return store.state.userInfo.userType
      }
    },
    methods: {
      openModal() {
        $("#modal").modal("open")
      },
      closeModal() {
        $('#modal').modal("close")
      },
      addAddress() {
        for (const prop in this.address) {
          if (this.address.hasOwnProperty(prop)) {
            if (this.address[prop] === null || this.address[prop].trim() === "") {
              console.error("No has rellenado todos los campos.")
              return
            }
          }
        }
        const uid = store.state.user.uid
        DB.ref(`/users/${ uid }/addresses`)
          .push(this.address)
          .then(() => {
            this.address = {
              name: null,
              address: null,
              phoneNumber: null
            }
            this.closeModal()
            console.info("Añadida nueva dirección.")
          })
          .catch(err => console.error(err))
      }
    }
  }
</script>

<style lang="scss" scoped>
  i.material-icons {
    margin-right: 0;
  }
  .avatar {
    border-radius: 50%;
    max-width: 125px;
  }
  .user-type {
    display: inline-block;
    background: #ee6e73;
    color: white;
    padding: 2px 10px;
    border-radius: 3px;
    margin-bottom: 10px;
  }
</style>