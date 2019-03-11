
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
    if (firebase.auth().currentUser != null) {
        var ref = kanjinoboxdb.collection("users").doc(currentUser.uid);
        ref.get().then(function(doc) {
            if (doc.exists) {
                if (doc.firebaseConfig == "") {
                    // redirect to database setup
                    if (window.location.href != "index.html") {
                        window.location.href = "pages/setup.html";
                    }
                } else {
                    // redirect to dashboard
                    console.log("To dashboard.");
                }
            } else {
                // show error
                console.log("User document doesn't exist.");
            }
        }).catch(function(error) {
            console.log(error);
        });
    } else {
        var provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // create user document and add to collection
            var twitterUser = result.user;
            var firebaseUser = firebase.auth().currentUser;
            
            if(!checkIfUserExists(firebaseUser.uid)) {
                console.log("Creating user document....");
                kanjinoboxdb.collection("users").doc(firebaseUser.uid).set({
                    userId: firebaseUser.uid,
                    email: twitterUser.providerData.profile.email,
                    username: twitterUser.providerData.profile.displayName,
                    firebaseConfig: ""
                }).catch(function(error) {
                    console.log(error.message);
                });
            }
            
        }).catch(function(error) {
            // show error
            console.log(error.message);
        });
    }
    
}

function checkIfUserExists(userId) {
    // get all users
    kanjinoboxdb.collection("users").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if(userId == doc.data().userId) {
                return true;
            }
        });
    });
}

// ROOT
$(document).ready(function () {
    
});
