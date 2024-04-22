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

socket.on('message', function (message) { incomingMsg(message) });

socket.on('contact_status_changed', function (contact_status_changed) {
  updateContactStatus(contact_status_changed)
});

function incomingMsg(msg) {
  const msgBox = document.createElement("li");
  msgBox.classList.add("w3-container");
  msgBox.classList.add("msg");
  console.log(msg);
  msgBox.textContent = convertTimestamp(msg.timestamp) + ": " + msg.content;
  if (msg.sender == userID) {
    msgBox.classList.add("outgoing");
  } else {
    msgBox.classList.add("incoming");
  }
  document.getElementById("chat-list").appendChild(msgBox);
}

//pulls list of contacts and populates tabs with message history
function initializeContacts() {

}
//creates and sends message JSON to server and displays it
function sendMessage() {
  console.log('sendMessage called');  // For debugging
  var input = document.getElementById("send-box");
  //messageTemplate.timestamp = Date.now();  //sender, receiver, timestamp, content
  messageTemplate.sender = userID;
  messageTemplate.receiver = activeContact;
  messageTemplate.content = input.innerText;
  var msgJSON = JSON.stringify(messageTemplate);
  console.log(messageTemplate);
  socket.emit('message', msgJSON);
  input.innerText = '';
  incomingMsg(messageTemplate);
}


//called when contact button is clicked
function assignListener(contact) {
  console.log(contact);
  return function openChatTab(evt) {
    var i, x, tablinks;
    x = document.getElementById("chat-list");
    //clear list
    while (x.firstChild) {
      x.removeChild(x.firstChild);
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" highlighted-blue", "");
    }
    //code to show chat
    //
    console.log(contact);
    contact.chatLog.forEach(msg => {
      incomingMsg(msg);
    })
    console.log(contact.name);
    activeContact = contact.name;
    evt.currentTarget.className += " highlighted-blue";
  }
}

//adds a contact button. runs for each contact in contact list. also should run when a new contact is added
function setupContact(contact) {
  const userButton = document.createElement("button");

  const dot = document.createElement('span');
  dot.className = 'status-circle';
  dot.style.backgroundColor = contact.online ? 'green' : 'red'; // Set color based on online status
  dot.style.display = 'inline-block'; // Show the dot

  userButton.className += "w3-bar-item";
  userButton.classList.add("w3-button");
  userButton.classList.add("tablink");
  console.log(userButton.className);
  userButton.addEventListener("click", assignListener(contact))  //fixed
  //userButton.innerHTML = '<span class="dot"></span>';
  userButton.textContent = contact.name;
  userButton.appendChild(dot);
  document.getElementById("sidebar").appendChild(userButton);
}

//helper function to convert time stamp
function convertTimestamp(timestamp) {
  // Create a new Date object with the epoch time
  const date = new Date(timestamp);

  // Get the individual components of the date (year, month, day, hour, minute, second)
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the date and time as a human-readable string
  const formattedDateTime = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return formattedDateTime;
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
        setupContact(contact);
      })
      // Display the name on the page
    })
    .catch(error => {
      // Handle fetch errors here
      console.error('Error fetching JSON:', error);
    });
  //console.log(users);

}
