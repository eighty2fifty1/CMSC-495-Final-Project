var socket = io.connect('http://localhost:5000');


function login(){
    console.log("Login called");
}

//checks db for user ID in use
//if not already in, loads signup page
function signUp(userID){
    if (userID != null){
        document.write("User ID in use");
    }
    else{
        //navigate to signup page
    }
}