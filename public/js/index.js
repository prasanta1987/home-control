
//DOM Elements

const gLogin = document.getElementById('glogin')
const gLogOut = document.getElementById('glogout')
const uname = document.getElementById('user')
const uLogo = document.getElementById('ulogo')



//logIN EVENTS
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().useDeviceLanguage();

glogin.addEventListener('click', e => {

    firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
})


gLogOut.addEventListener('click', e => {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
})

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        uname.innerHTML = user.displayName;
        userlogo = user.photoURL;
        uLogo.src = userlogo;
        gLogin.classList.add('hide')
        gLogOut.classList.remove('hide');
    } else {
        uname.innerHTML = 'Welcome';
        uLogo.src = './img/user.png';
        gLogOut.classList.add('hide');
        gLogin.classList.remove('hide');
    }
});