var socket = io.connect('http://localhost:5000');


socket.on('connect', function () {
  console.log('Websocket connected!');
});

socket.on('message', function (msg) {
  var li = document.createElement("li");
  li.textContent = msg;
  document.getElementById("chat").appendChild(li);
});


//pulls list of contacts and populates tabs with message history
function initializeContacts() {

}

function sendMessage() {
  console.log('sendMessage called');  // For debugging
  var input = document.getElementById("messageInput");
  var message = input.value;
  socket.emit('message', message);
  input.value = '';
}

function openChat(evt, userID) {
  var i, x, tablinks;
  x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
  }
  //code to show chat
  //
  evt.currentTarget.className += " w3-red";
}

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
      console.log(users.contacts[0].name);
      tablinks = document.getElementsByClassName("tablink");
      users.contacts.forEach(contact => {
        const userButton = document.createElement("button");
        userButton.className += "w3-bar-item";
        userButton.classList.add("w3-button");
        userButton.classList.add("tablink");
        userButton.addEventListener("click", function () { openChat("click", contact.name); })  //needs work. try reorganizing args or inserting html code directly
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
