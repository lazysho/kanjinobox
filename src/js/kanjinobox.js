
// FIRESTORE FUNCTIONS
var kanjinoboxdb;
var userdb;

function initUserFirestore() {

}

function addNewKanji(kanjiStr, meaningStr) {
    db.collection("kanjiBox").add({
        kanji: kanjiStr,
        meaning: meaningStr
    }).then(function(docRef) {
        console.log(docRef.id);
    }).catch(function(error){
        console.error(error);
    });
}

// NEW ACCOUNT
var confrimPasswordCreated = false;
function createNewBox() {
    // prepare things needed to create textbox for confirm password
    var tagName = "input";
    var id = "cpw";
    var type ="password";
    var placeholder = "Cofirm Password";
    var properties = "form-control font-sniglet mx-auto mt-2";
    var parentObj = document.getElementById("cpw-space");

    // to prevent creating multiple elements when user clicks button
    if (!confrimPasswordCreated) {
        confrimPasswordCreated = !confrimPasswordCreated;

        // create element
        createHTMLElement(tagName, id, type, placeholder, properties, parentObj);

        // animate element entrance
        animateCSS("#cpw", "animated zoomInUp", function() {
            // change button text and color
            document.getElementById("newBox").innerText = "Cancel";
            document.getElementById("openBox").innerText = "Create Box";
        });
    } else {
        confrimPasswordCreated = !confrimPasswordCreated;

        // animate element exit
        animateCSS("#cpw", "animated bounceOut", function() {
            // remove element
            removeHTMLElement(parentObj);

            // change button text and color
            document.getElementById("newBox").innerText = "Create New Box";
            document.getElementById("openBox").innerText = "Open Box";
        });   
    }
}

function logInOrNewAccount() {
    if (confrimPasswordCreated) {
        // create account
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var cpw = document.getElementById("cpw").value;

        // make sure all fields aren't blank
        if (username != "" && password != "" && cpw != "") {
            // check if password matches
            if(password == cpw) {
                // create account
                addNewUser(username, password);
            } else {
                // show error
                var parentObj = document.getElementById("alert-space");
                createHTMLElement("div", "alert", "none", "Password didn't matched.", "alert alert-warning font-sniglet", parentObj);
                animateCSS("#alert", "animated heartBeat", function() {
                    setTimeout(animateCSS("#alert", "animated fadeOut", function() {
                        // remove element
                        removeHTMLElement(parentObj);
                    }), 1000);
                });
            }
        } else {
            // show error
            var parentObj = document.getElementById("alert-space");
            createHTMLElement("div", "alert", "none", "All fields are required.", "alert alert-warning font-sniglet", parentObj);
            animateCSS("#alert", "animated bounceIn", function() {
                setTimeout(animateCSS("#alert", "animated fadeOut", function() {
                    // remove element
                    removeHTMLElement(parentObj);
                }), 1000);
            });
        }
    } else {
        // log in user
        alert("No function yet.");
    }
}

// CONNECTING USER TO HIS OWN FIRESTORE
function createFirebaseScript() {
    // variables
    var importantFirebaseConfigContent =
        ['apiKey:', 'authDomain:', 'databaseURL:', 'projectId:', 'storageBucket:', 'messagingSenderId:'];

    // get textbox and text area content
    var firebaseConfig = document.getElementById('firebaseConfig').value;
    var firebaseScript = document.getElementById('firebaseScript').value;
    
    // check if there's input or only whitespace
    if (firebaseConfig != "" && firebaseScript != null) {
        // replace all new line with space and split
        var splitConfig = firebaseConfig.split(" ");

        // look for the script tags, and important stuffs in a firebaseScript
        var configMatch = validateScript(importantFirebaseConfigContent, splitConfig);

        // if all are found in script pasted by user
        if (configMatch.length == importantFirebaseConfigContent.length) {
            firebaseConfig = splitConfig.join(" ");
            addScriptToHTML(firebaseScript, true);
            addScriptToHTML(firebaseConfig, false);
        } else {
            alert(configMatch.length + " : " + importantFirebaseConfigContent.length + "\n" + configMatch);
        }
    } else {
        
    }
}

function validateScript(scriptKeys, toValidate) {
    var matchedContent = [];

    scriptKeys.forEach(validate);
    function validate(value, index, array) {
        for (var i = 0; i < toValidate.length; i++) {
            if (value == toValidate[i]) {
                matchedContent.push(value);
                break;
            }
        }
    }

    return matchedContent;
}

var previousSrc = "";
var firebaseScriptEditable = false;
var scriptChanged = false;

function changeFirebaseScriptSrc() {
    if (!firebaseScriptEditable) {
        firebaseScriptEditable = !firebaseScriptEditable;

        // get default src
        if (previousSrc == "") {
            previousSrc = document.getElementById('firebaseScript').value;
        }

        document.getElementById('firebaseScript').removeAttribute('readonly');
        document.getElementById('changeScript').innerText = "Update Src";
    } else {
        firebaseScriptEditable = !firebaseScriptEditable;

        document.getElementById('firebaseScript').readOnly = true;
        document.getElementById('changeScript').innerText = "Change Src";

        // check if changed
        if (previousSrc != document.getElementById('firebaseScript').value) {
            scriptChanged = true;
        } else {
            scriptChanged = false;
        }
    }
    
}

function addScriptToHTML(scriptStr, isAttribute) {
    var newScript = document.createElement("script");

    if (isAttribute) {
        newScript.src = scriptStr;
    } else {
        var inlineScript = document.createTextNode(scriptStr);

        newScript.appendChild(inlineScript);
        $("html").append(newScript);

        firestoreInit();
    }
    
}

// ANIMATIONS
function animateCSS(elementId, animationName, callback) {
    const node = document.getElementById(elementId);
    $(elementId).addClass(animationName);

    function handleAnimationEnd() {
        $(elementId).removeClass(animationName);
        $(elementId).unbind("animationend", handleAnimationEnd);

        if (typeof callback == 'function') callback()
    }

    $(elementId).bind("animationend", handleAnimationEnd);
}

// CREATE NEW ELEMENTS
function createHTMLElement(tagName, id, type, placeholder, properties, parentObj) {
    var newElement = document.createElement(tagName);
    newElement.id = id;

    if (tagName == "input") {
        newElement.type = type;
        newElement.placeholder = placeholder;
    } else {
        newElement.innerText = placeholder;
    }

    newElement.setAttribute("class", properties);
    parentObj.appendChild(newElement);
}

function removeHTMLElement(parentObj) {
    parentObj.removeChild(parentObj.firstChild);
}

// ROOT
$(document).ready(function () {
    // init tooltip functions
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
});