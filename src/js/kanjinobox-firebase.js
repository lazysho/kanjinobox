
var kanjinoboxdb;
function initKanjiNoBoxApp() {

    var defaultConfig = {
        apiKey: "AIzaSyD674A6gzN4nZVeVDOCNs0_Q9RCQ2bweNE",
        authDomain: "kanjinobox.firebaseapp.com",
        databaseURL: "https://kanjinobox.firebaseio.com",
        projectId: "kanjinobox",
        storageBucket: "kanjinobox.appspot.com",
        messagingSenderId: "604413915788" 
        };

    firebase.initializeApp(defaultConfig);
}

function initKanjiNoBoxFirestore() {
    kanjinoboxdb = firebase.firestore();
}

function getKanjiNoBoxFirestore() {
    return kanjinoboxdb;
}

function addNewUser(username, password) {
    firebase.auth().createUserWithEmailAndPassword(username, password).catch(function(error) {
        // handle errors here
        console.log(error.code);
        console.log(error.message);
    });
}

function signInWithTwitter() {
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var secret = result.credential.secret;

        var user = result.user;
        
    }).catch(function(error) {
        alert(error.message);
    });

    var user = firebase.auth().currentUser;

    if (user) {
        alert(user.displayName);
    } else {
    // No user is signed in.
    }
}

function checkIfUserNameExists(username) {
    // get all users
    kanjinoboxdb.collection("users").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if(username == doc.data().username) {
                return true;
            }
        });
    });
}

// ROOT
$(document).ready(function () {
    // init app and app's firestore
    initKanjiNoBoxApp();
    initKanjiNoBoxFirestore();
});
