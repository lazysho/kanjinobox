
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

function addNewUser(emailStr, passwordStr) {
    firebase.auth().createUserWithEmailAndPassword(emailStr, passwordStr).then(function(result) {
        // create user document and add to collection
        var temp = emailStr.split("@");
        var usernameStr = temp[0];
        kanjinoboxdb.collection("users").doc(result.user.uid).set({
            userId: result.user.uid,
            email: emailStr,
            username: usernameStr,
            firebaseConfig: ""
        }).catch(function(error) {
            
        });

        // redirect to dashboard
        window.location.href = "pages/setup.html"
    }).catch(function(error) {
        // show error
        var parentObj = document.getElementById("alert-space");
        createHTMLElement("div", "alert", "none", error.message, "alert alert-warning font-sniglet", parentObj);
        animateCSS("#alert", "animated bounceIn", function() {
            setTimeout(animateCSS("#alert", "animated fadeOut", function() {
                // remove element
                removeHTMLElement(parentObj);
            }), 3000);
        });
    });
}

function signInWithTwitter() {
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // create user document and add to collection
        var twitterUser = result.user;
        var firebaseUser = firebase.auth().currentUser;0
        
        kanjinoboxdb.collection("users").doc(firebaseUser.uid).set({
            userId: firebaseUser.uid,
            email: twitterUser.providerData.profile.email,
            username: twitterUser.providerData.profile.displayName,
            firebaseConfig: ""
        }).catch(function(error) {
            console.log(error.message);
        });

        // redirect to dashboard
        window.location.href = "pages/setup.html"
    }).catch(function(error) {
        // show error
    });

    var user = firebase.auth().currentUser;

    if (user != null) {
    user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
    });
    } else {
        alert("null");
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
