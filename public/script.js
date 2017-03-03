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
    img3.getDownloadURL().then(function(url) {
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

//attach image of caller to modal
$("#imageModal").on('show.bs.modal', function(e) {
    var img = $(e.relatedTarget); // img that triggered modal
    //var recipient = img.data('imgData'); // extract info from data-* attributes
    var newImg = document.createElement("img");
    newImg.src = img[0].src;
    this.getElementsByClassName("modal-body")[0].appendChild(newImg);
    var modal = $(this);
});

//Empty the modal body when hidden
$("#imageModal").on('hide.bs.modal', function(){
    var body = this.getElementsByClassName("modal-body")[0];
    var children = body.children;
    while(body.hasChildNodes()){
        body.removeChild(body.lastChild);
    }
});

//Add art
var changesBtn = document.getElementById("saveChanges");
changesBtn.onclick = function() {
    //Check if someone is logged in before adding
    var user = firebase.auth().currentUser;
    if(!user){
        window.alert("You need to log in first!\n");
        return;
    }

    //Grab content of form
    var titleField = document.getElementById("title").value;
    var locField = document.getElementById("location").value;
    var sfwField = getRadioVal("SFW");
    var desField = document.getElementById("description").value;
    var tagField = document.getElementById("tags").value;
    var out = "";
    if(!titleField){
        out += "Please include a title. \n";
    }
    if(!locField){
        out += "Please include a location. \n";
    }
    if(!sfwField){
        out += "Please indicate a safety rating. \n";
    }
    if(!desField){
        out += "Please include a description.";
    }

    //Notify user of unfilled fields and stop
    if(out){
        window.alert(out);
        return;
    }

    //Push info to storage
    //var newImage = storage.ref().child(titleField + ".jpg");

    //Push info to firebase 
    var imgRef = firebase.database().ref("/images");
    imgRef = imgRef.child(titleField).set({
        "image-name": titleField,
        location: locField,
        safety: sfwField,
        description: desField,
        tags: tagField,
        storage: "no target yet"
    }).then(function(){ console.log("Push completed!"); });         
  }

function getRadioVal(radioName){
    var value = "";
    var radios = document.getElementsByName(radioName);
    for(var i = 0; i < radios.length; i++){
        if(radios[i].checked){
            value = radios[i].value;
        }
    }
    return value;        
} 
