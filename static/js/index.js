var socket = io.connect('http://localhost:5000');


        socket.on('connect', function() {
            console.log('Websocket connected!');
        });

        socket.on('message', function(msg) {
            var li = document.createElement("li");
            li.textContent = msg;
            document.getElementById("chat").appendChild(li);
        });

        function sendMessage() {
            console.log('sendMessage called');  // For debugging
            var input = document.getElementById("messageInput");
            var message = input.value;
            socket.emit('message', message);
            input.value = '';
        }

        function openChat(evt, userID) {  var i, x, tablinks;
            x = document.getElementsByClassName("city");
            for (i = 0; i < x.length; i++) {
              x[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tablink");
            for (i = 0; i < x.length; i++) {
              tablinks[i].className = tablinks[i].className.replace(" w3-red", ""); 
            }
            document.getElementById(userID).style.display = "block";
            evt.currentTarget.className += " w3-red";
          }
        