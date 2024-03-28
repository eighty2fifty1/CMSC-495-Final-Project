var socket = io.connect('http://localhost:5000');
var userID;
var activeContact;
var messageTemplate = new Object();

/*****************************
 * 
 * Handling incoming signals
 * 
 *****************************/

socket.on('connect', function () {
  console.log('Websocket connected!');
});

socket.on('message', incomingMsg(message));

function incomingMsg(msg){
  const msgBox = document.createElement("li");
  msgBox.classList.add("w3-container");
  msgBox.classList.add("msg");
  console.log(msg);
  msgBox.textContent = msg.timestamp + " " + msg.content;
  if(msg.sender == userID){
    msgBox.classList.add("outgoing");
  } else{
    msgBox.classList.add("incoming");
  }
  document.getElementById("chat-list").appendChild(msgBox);
}

//pulls list of contacts and populates tabs with message history
function initializeContacts() {

}

function sendMessage() {
  console.log('sendMessage called');  // For debugging
  var input = document.getElementById("send-box");
  messageTemplate.timestamp = Date.now();  //sender, receiver, timestamp, content
  messageTemplate.sender = userID;
  messageTemplate.receiver = activeContact;
  messageTemplate.content = input.innerText;
  var msgJSON = JSON.stringify(messageTemplate);
  console.log(messageTemplate);
  socket.emit('message', messageTemplate);
  input.innerText = '';
  incomingMsg(messageTemplate);
}


//called when contact button is clicked
function openChatTab(evt, contact) {  var i, x, tablinks;
    x = document.getElementById("chat-list");
    //clear list
    while(x.firstChild){
      x.removeChild(x.firstChild);
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" w3-red", ""); 
    }
    //code to show chat
    //
                                    
    contact.chatLog.forEach(msg => {
      incomingMsg(msg);
    })                               
    console.log(contact.name);
    activeContact = contact.name;
    evt.currentTarget.className += " w3-red";
  }

/******************************************
 * 
 *  pulls json data for front end testing
 * 
 ******************************************/

async function fetchDummyChat() {
  fetch('http://localhost:5000/json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();  // Parse the JSON response
    })
    .then(data => {
      // Extract the 'name' from the 'data' object
      const users = JSON.parse(data);
      userID = users.username;
      console.log(users.contacts[0].name);
      tablinks = document.getElementsByClassName("tablink");
      users.contacts.forEach(contact => {
        const userButton = document.createElement("button");
        userButton.className += "w3-bar-item";
        userButton.classList.add("w3-button");
        userButton.classList.add("tablink");
        userButton.addEventListener("click", function () { openChatTab("click", contact); })  //needs work. try reorganizing args or inserting html code directly
        userButton.textContent = contact.name;
        document.getElementById("sidebar").appendChild(userButton);
      })
      // Display the name on the page
    })
    .catch(error => {
      // Handle fetch errors here
      console.error('Error fetching JSON:', error);
    });
  //console.log(users);

}
