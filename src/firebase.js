import firebase from "firebase"

const config = {
  apiKey: "AIzaSyCcPAAVm3HHzIe10Ui3qdOzaO9bdO1zitU",
  authDomain: "rukalo-chef.firebaseapp.com",
  databaseURL: "https://rukalo-chef.firebaseio.com",
  projectId: "rukalo-chef",
  storageBucket: "rukalo-chef.appspot.com",
  messagingSenderId: "95083075362"
}

firebase.initializeApp(config)

/* database reference */
export const DB = firebase.database()
/* auth reference */
export const AUTH = firebase.auth()
/* firestore reference */
export const STORAGE = firebase.storage()