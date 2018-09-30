const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)
const ref = admin.database().ref()

exports.newUserAccount = functions.auth.user().onCreate(e =>{
    const uid = e.uid
    const name = e.displayName
    const email = e.email
    const dp = e.photoURL || 'https://firebasestorage.googleapis.com/v0/b/pk-home.appspot.com/o/user.png?alt=media&token=76b4b8b1-bef3-4774-b236-4ff0f7ea6ea2'

    const userRef = ref.child(`/users/assets/${uid}`)
    return userRef.set({
        name : name || 'Guest',
        email : email,
        dp : dp,
        role : 'user'
    })
})

exports.deleteUserAccount = functions.auth.user().onDelete(e =>{
    const uid = e.uid
    const userRef = ref.child(`/users/assets/${uid}`)
    return userRef.remove()
})