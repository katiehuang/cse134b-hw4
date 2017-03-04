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
    }).then( function(){ $("#loginModal").modal('hide'); });
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
    var parent = document.getElementById("homepage-container");
    var startRef = database.ref("/images");

    startRef.on('value', function(snapshot){
    	while(parent.hasChildNodes()){
    		parent.removeChild(parent.lastChild);
    	}

    	snapshot.forEach(function(childSC){
			creatImgTag(childSC.val(), parent);    		
    	})
    });
}

// style image and put into DOM tree
function creatImgTag(value, parent) {
    var newImg = document.createElement("img");
    var link = storage.ref(value.storageLink);
    link.getDownloadURL().then(function(url){
    	newImg.src = url;
    	newImg.setAttribute("data-toggle", "modal");
    	newImg.setAttribute("data-target", "#imageModal");
    	newImg.setAttribute("data-imgData", value.imageName);

    	var newDiv = document.createElement("div");
    	newDiv.className = "homepage-image";
   	 	newDiv.appendChild(newImg);
    	parent.appendChild(newDiv);
    });
    //newImg.src = img;
    
}

//Image Modal Behaviors (view/delete/edit)
$("#imageModal").on('show.bs.modal', function(e) {
    var img = $(e.relatedTarget); // img that triggered modal
    var newImg = document.createElement("img");

    var imgInfo;
    var imageData = img[0].dataset.imgdata;
    var imgModal = this;
    var modalBody = imgModal.getElementsByClassName("modal-body")[0];
    var aye = database.ref("/images").child(imageData).once('value').then(function(snapshot){
    		imgInfo = snapshot.val();
    		var newDiv = document.createElement("div");
		    newDiv.insertAdjacentHTML('beforeend', genTemplate(imgInfo));
		    modalBody.appendChild(newImg);
		    modalBody.appendChild(newDiv);
    });

    //Add hidden edit view 
    modalBody.insertAdjacentHTML('beforeend', addHiddenEdit());

    //Delete an image
	var delBtn = document.getElementById("deleteImgBtn");
	delBtn.onclick = function(){
		var link = imgInfo.storageLink;
		database.ref("/images").child(imageData).remove();
		storage.ref(link).delete();
		$("#imageModal").modal('hide');
	}

	//Edit an image
	var editBtn = document.getElementById("editImgBtn");
	var confirmBtn = document.getElementById("confirmEditsBtn");
	editBtn.onclick = function(){
		document.getElementById("editView").classList.remove("hidden");
		confirmBtn.classList.remove("hidden");
		database.ref("/images").child(imageData).remove();
		//console.log("Deleted the old " + imageData);
		
	}
	
	confirmBtn.onclick = function() {
		var titleField = document.getElementById("editTitle").value;
	    var locField = document.getElementById("editLocation").value;
	    var sfwField = getRadioVal("editSFW");
	    var desField = document.getElementById("editDescription").value;
	    var tagField = document.getElementById("editTags").value;
	    
	    //If nothing was filled let the user know!
	    if(!titleField){
	        titleField = imgInfo.imageName;
	    }
	    if(!locField){
	        locField = imgInfo.location;
	    }
	    if(!sfwField){
			sfwField = imgInfo.safety;
		}
	    if(!desField){
	        desField = imgInfo.description;
	    }
	    if(!tagField){
	    	tagField = imgInfo.tags;
	    }

	    var theButton = this;
	    var editView = document.getElementById("editView");

	    //Cool, we can edit now
	    var imgRef = firebase.database().ref("/images"); 
		imgRef.child(titleField).set({
	        imageName: titleField,
	        location: locField,
	        safety: sfwField,
	        description: desField,
	        tags: tagField,
	        storageLink: imgInfo.storageLink
		}).then(function(){ 
			editView.classList.add("hidden");
			theButton.classList.add("hidden");			
		});
	}
});

//Empty the modal body when hidden
$("#imageModal").on('hide.bs.modal', function(){
    var body = this.getElementsByClassName("modal-body")[0];
    var children = body.children;
    while(body.hasChildNodes()){
        body.removeChild(body.lastChild);
    }
});

//Empty login modal fields when hidden
$("#loginModal").on('hide.bs.modal', function(){
	var inputs = this.getElementsByTagName("input");
	console.log(inputs);
	for(var i = 0; i < inputs.length; i++){
		inputs[i].value = "";
	}
});

//Empty addArt modal fields when hidden
$("#addArtModal").on('hide.bs.modal', function(){
	var inputs = this.getElementsByTagName("input");
	console.log(inputs);
	for(var i = 0; i < inputs.length; i++){
		inputs[i].value = "";
	}
})

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
    var fileField = document.getElementById("file").files[0];
    var storageLinkName = ""
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
    //Also check if file is an image (later)
    if(!fileField){
    	out += "Please attach an image";
    }

    //Notify user of unfilled fields and stop
    if(out){
        window.alert(out);
        return;
    }

    //Push info to storage
    if(fileField){
    	var newImage = storage.ref().child(fileField.name);
    	newImage.put(fileField).then(function(snapshot){
    		storageLinkName = snapshot.a.fullPath;

    		//Push info to firebase only after storage
		    var imgRef = firebase.database().ref("/images");
		    imgRef = imgRef.child(titleField).set({
		        imageName: titleField,
		        location: locField,
		        safety: sfwField,
		        description: desField,
		        tags: tagField,
		        storageLink: storageLinkName
		    });
		}).then( function(){ $("#addArtModal").modal('hide'); });
	}
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

function genTemplate(childSCval){
	var returnString = "";
	for(var key in childSCval){
		returnString += "<h3>" + key + "</h3><br/>";
		returnString += "<p>" + childSCval[key] + "</p><br/><br/>";
	}
	return returnString;
}

function addHiddenEdit(){
	var content = "<div id=\"editView\" class=\"hidden\">" +
               	  "<p>Title:</p><input type=\"text\" id=\"editTitle\"><br/><br/>" +
                  "<p>Location:</p><input type=\"text\" id=\"editLocation\"><br/><br/>" +
                  "<p>Safe for work:</p><input type=\"radio\" name=\"editSFW\" value=\"Yes\">Yes<input type=\"radio\" name=\"SFW\" value=\"No\">No<br/><br/>" +
                  "<p>Description:</p><input type=\"text\" id=\"editDescription\"><br/><br/>" +
	              "<p>Tags:</p><input type=\"text\" id=\"editTags\"><br/><br/>" +
	              "</div>";

    return content;
}