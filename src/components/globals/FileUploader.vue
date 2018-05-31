<template lang="pug">
  div
    input(type="file", accept="image/*", @change="detectFiles($event.target.files)")
</template>
<script>
  import { STORAGE, DB } from "@/firebase"
  export default {
    props: {
      reference: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        file: File,
        uploadTask: "",
        downloadUrl: ""
      }
    },
    methods: {
      detectFiles(fileList) {
        Array.from(Array(fileList.length).keys()).map(x => {
          this.upload(fileList[x])
        })
      },
      upload(file) {
        const uid = this.$store.state.user.uid
        this.uploadTask = STORAGE.ref(this.reference).put(file)
        this.uploadTask.then(snapshot => {
          DB.ref(this.reference)
            .update({ imgUrl: snapshot.downloadURL })
            .then(() => console.log("done!"))
        })
      }
    }
  }
</script>