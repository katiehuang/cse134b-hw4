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

// Get 3 images
 window.onload = function getImages(){
    var img1 = storage.ref("memewall.jpg");
    var img2 = storage.ref("takeaknee.jpg");
    var img3 = storage.ref("whitetiger.jpg");

    var parent = document.getElementById("container");

    img1.getDownloadURL().then(function(url){
        creatImgTag(url, parent);
    });
    img2.getDownloadURL().then(function(url){
        creatImgTag(url, parent);
    });
    img2.getDownloadURL().then(function(url){
        creatImgTag(url, parent);
    });
 }

 //

 function creatImgTag(img, parent){
    var newImg = document.createElement("IMG");
    newImg.src = img;
    newImg.className = "mainImg";
    parent.appendChild(newImg);
 }
