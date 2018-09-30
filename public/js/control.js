
// Initialize Firebase with your credentials
// var config = {
//     apiKey: "",
//     authDomain: "",
//     databaseURL: "",
//     projectId: "",
//     storageBucket: "",
//     messagingSenderId: ""
// };
// firebase.initializeApp(config);


//Get Dom Element
const relayContainer = document.querySelector('#relay')
const temphumiContainer = document.querySelector('#dht')
const routerContainer = document.querySelector('#router')
const uname = document.getElementById('user');
const uLogo = document.getElementById('ulogo');
const gLogin = document.getElementById('glogin');
const gLogOut = document.getElementById('glogout');



// Database Reference
const dbRefObject = firebase.database().ref();
const getTemHumi = dbRefObject.child('/sensors/dht11');
const getRelay = dbRefObject.child('/sensors/switches');
const getRouter = dbRefObject.child('/sensors/jiofi');
const users = dbRefObject.child('/uid');


//logIN EVENTS
var provider = new firebase.auth.GoogleAuthProvider();

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
        //console.log(user)
        gLogin.classList.add('hide')
        gLogOut.classList.remove('hide');
        userDb(user);
    } else {
        uname.innerHTML = 'Welcome';
        uLogo.src = './img/user.png';
        gLogOut.classList.add('hide');
        gLogin.classList.remove('hide');
    }
});

function userDb(user) {
    users.on('child_added', snap => {
        userUid = user.uid;
        if (snap.key != userUid) {
            firebase.database().ref('uid/'+userUid).set({
                name: user.displayName,
                role: 'user'
            });
        }
    });
}

getRouter.on('child_added', snap => {
    var data = snap.val();
    var key = snap.key;
    routerStatUpdate(key, data);
})

getRouter.on('child_changed', snap => {
    var data = snap.val();
    var key = snap.key;
    routerStatUpdate(key, data);
})

function routerStatUpdate(key, data) {
    if (!document.getElementById(key + 'rou')) {
        li = document.createElement('li')
        li.id = key + 'rou'
        if (key == 'battlevel') {
            li.className = 'list-group-item list-group-item-primary'
            li.innerHTML = 'Battery Level '
            li.innerHTML += `<span id="${key}">${data}</span`
            li.innerHTML += '<span>%</span>'
        }

        if (key == 'battstat') {
            li.className = 'list-group-item list-group-item-warning'
            li.innerHTML = 'Battery is '
            li.innerHTML += `<span id="${key}">${data}</span`
        }
        routerContainer.appendChild(li)
    } else {
        document.getElementById(key).innerHTML = data
    }
}



getTemHumi.on('child_added', snap => {
    var data = snap.val();
    var key = snap.key;
    tempHumiUpdate(key, data);
    // console.log(key, data);
});

getTemHumi.on('child_changed', snap => {
    var data = snap.val();
    var key = snap.key;
    tempHumiUpdate(key, data);
    // console.log(key, data);
});

function tempHumiUpdate(key, data) {
    if (!document.getElementById(key + 'th')) {
        li = document.createElement('li')
        li.id = key + 'th'
        if (key == 'temp') {
            li.className = 'list-group-item list-group-item-info'
            li.innerHTML = 'Temperature '
            li.innerHTML += `<span id="${key}">${data}</span`
            li.innerHTML += '<span>&deg;C</span>'
        }

        if (key == 'humi') {
            li.className = 'list-group-item list-group-item-warning'
            li.innerHTML = 'Humidity '
            li.innerHTML += `<span id="${key}">${data}</span`
            li.innerHTML += '<span>%</span>'
        }
        temphumiContainer.appendChild(li)
    } else {
        document.getElementById(key).innerHTML = data
    }
}

getRelay.on('child_added', snap => {
    var data = snap.val();
    var key = snap.key;
    relayDataUpdate(data, key);
});

getRelay.on('child_changed', snap => {
    var data = snap.val();
    var key = snap.key;
    relayDataUpdate(data, key);
});

getRelay.on('child_removed', snap => {
    var data = snap.val();
    var key = snap.key;
    console.log(key + 'tr');
    document.getElementById(key + 'tr').remove(key + 'tr');
});



// Relay DOM Section

function relayDataUpdate(data, key) {
    htmlBtnOn = `<button onClick="toggleRelay('${key}','${data}')" class="btn col-sm-4 btn-success">ON</button>`
    htmlBtnOff = `<button onClick="toggleRelay('${key}','${data}')" class="btn col-sm-4 btn-danger">OFF</button>`
    htmlBtnErr = `<button onClick="toggleRelay('${key}','${data}')" class="btn col-sm-4 btn-muted">ERROR</button>`

    if (document.getElementById(key + 'tr')) {
        td = document.getElementById(key)
        if (data == 1) {
            td.innerHTML = htmlBtnOn
        } else if (data == 0) {
            td.innerHTML = htmlBtnOff
        } else {
            td.innerHTML = htmlBtnErr
        }
    } else {
        const tr = document.createElement('tr');
        tr.id = key + 'tr'
        tr.innerHTML = `<td>${key}</td>`;
        if (data == 1) {
            tr.innerHTML += `<td id="${key}">${htmlBtnOn}</td>`
        } else if (data == 0) {
            tr.innerHTML += `<td id="${key}">${htmlBtnOff}</td>`
        } else {
            tr.innerHTML += `<td id="${key}">${htmlBtnErr}</td>`
        }

        relayContainer.appendChild(tr)
    }
}

function toggleRelay(relayName, relayValue) {
    if (relayValue == 1 || relayValue == '1') {
        relayValue = 0;
    } else {
        relayValue = 1;
    }
    updateData = {};
    updateData[relayName] = relayValue;
    getRelay.update(updateData);
}
