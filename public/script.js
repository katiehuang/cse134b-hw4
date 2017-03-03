// Initialize Firebase
var config = {
    apiKey: "AIzaSyDKis9ipJ3fiPgjAe3DeoXkB1waqDg2knU",
    authDomain: "cse-134b-hw4.firebaseapp.com",
    databaseURL: "https://cse-134b-hw4.firebaseio.com",
    storageBucket: "cse-134b-hw4.appspot.com",
    messagingSenderId: "47888727463"
};
firebase.initializeApp(config);
var storage = firebase.storage();
var database = firebase.database();

// Login
var loginSubmit = document.getElementById('loginSubmit');
loginSubmit.onclick = function() {
    var loginEmail = document.getElementById('loginEmail').value;
    var loginPassword = document.getElementById('loginPassword').value;
    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert(errorMessage);
    });
};

// register
var registerSubmit = document.getElementById('registerSubmit');
registerSubmit.onclick = function() {
    var registerEmail = document.getElementById('registerEmail').value;
    var registerPassword = document.getElementById('registerPassword').value;
    firebase.auth().createUserWithEmailAndPassword(registerEmail, registerPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert(errorMessage);
    });
};

// login with Google
var provider = new firebase.auth.GoogleAuthProvider();

var googleLogin = document.getElementById('googleLogin');
googleLogin.onclick = function() {
    firebase.auth().signInWithPopup(provider).then(function(result) {3
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...3
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
};

// Get 3 images
window.onload = function getImages() {
    var img1 = storage.ref("memewall.jpg");
    var img2 = storage.ref("takeaknee.jpg");
    var img3 = storage.ref("whitetiger.jpg");

    var parent = document.getElementById("homepage-container");

    img1.getDownloadURL().then(function(url) {
        creatImgTag(url, parent);
    });
    img2.getDownloadURL().then(function(url) {
        creatImgTag(url, parent);
    });
    img2.getDownloadURL().then(function(url) {
        creatImgTag(url, parent);
    });
}

// style image and put into DOM tree

function creatImgTag(img, parent) {
    var newImg = document.createElement("img");
    newImg.src = img;
    newImg.setAttribute("data-toggle", "modal");
    newImg.setAttribute("data-target", "#imageModal");
    //newImg.setAttribute("data-imgData", );

    var newDiv = document.createElement("div");
    newDiv.className = "homepage-image";
    newDiv.appendChild(newImg);
    parent.appendChild(newDiv);
}

// pass in image data into DOM tree
$('#imageModal').on('show.bs.modal', function(e) {
    var img = $(event.relatedTarget); // img that triggered modal
    var recipient = img.data('imgData'); // extract info from data-* attributes

    var modal = $(this);
});
