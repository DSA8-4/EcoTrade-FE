var socket = new SockJS("http://localhost:8090/chat-websocket");
var stompClient = Stomp.over(socket);
var currentRoom = null;
var userEntered = false;

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8090/chat/rooms")
    .then((response) => response.json())
    .then((roomList) => {
      roomList.forEach((room) => {
        addRoom(room);
      });
    })
    .catch((error) => {
      console.error("Error fetching rooms:", error);
    });
});

function addRoom(room) {
  const roomsDiv = document.getElementById("rooms");
  const roomElement = document.createElement("div");
  roomElement.innerHTML = `<button onclick='joinRoom(${JSON.stringify(
    room
  )})'>${room.name}</button>`;
  roomsDiv.appendChild(roomElement);
}

stompClient.connect({}, function (frame) {
  console.log("Connected: " + frame);
  stompClient.subscribe("/sub/rooms", function () {});
});

function createRoom() {
  var roomName = document.getElementById("room-name").value;
  stompClient.send("/pub/chat/createRoom", {}, roomName);
  // joinRoom(roomName);
}

function joinRoom(room) {
  if (currentRoom !== null) {
    stompClient.unsubscribe(currentRoom);
  }
  currentRoom = room.name;
  document.getElementById("chat-box").innerHTML = "";
  /*
    여러번 클릭 시 여러명이 방을 구독한게 되서 채팅이 여러번 뜨는 것으로 추정
    로그인과의 연동하게 될 때 같은 이름으로 여러번 구독되는 것을 막으면 될듯?
  */

  fetch(`http://localhost:8090/chat/messages/${room.id}`)
    .then((response) => response.json())
    .then((chatMessages) => {
      chatMessages.forEach((chatMessage) => showMessage(chatMessage));
    });
  stompClient.subscribe("/sub/" + room.name, function (messageOutput) {
    showMessage(JSON.parse(messageOutput.body));
  });
}

function sendMessage() {
  var sender = document.getElementById("sender").value;
  var content = document.getElementById("message").value;
  if (!userEntered) {
    userEntered = true; // Mark the user as entered
  }
  stompClient.send(
    "/pub/chat/send/" + currentRoom,
    {},
    JSON.stringify({ sender: sender, content: content })
  );
  document.getElementById("message").value = "";
}

function showMessage(message) {
  var chatBox = document.getElementById("chat-box");
  var messageElement = document.createElement("div");

  messageElement.className = "message";
  var userName = document.getElementById("sender").value;
  if (userName === message.sender) {
    messageElement.classList.add("right");
  } else {
    messageElement.classList.add("left");
  }

  // 현재 시간 구하기
  var date = new Date(message.timestamp);
  var hours = date.getHours();
  var period = hours >= 12 ? "오후" : "오전";
  hours = hours % 12 || 12;
  var minutes = date.getMinutes();
  var formattedTime =
    period + " " + hours + ":" + (minutes < 10 ? "0" + minutes : minutes);

  messageElement.innerHTML =
    "<strong>" +
    message.sender +
    "</strong>: " +
    message.content +
    " <span class='time'>" +
    formattedTime +
    "</span>";
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
