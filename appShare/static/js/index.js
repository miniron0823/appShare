const btnCreateRoom = document.getElementById("createRoom");
const btnJoinRoom = document.getElementById("joinRoom");

btnCreateRoom.addEventListener("click", (e) => {
  location.href = "https://localhost:8080/" + randomToken();
});

btnJoinRoom.addEventListener("click", (e) => {
  var room = prompt("입장할 방을 입력하세요.");
  if (room) {
    location.href = "https://localhost:8080/" + room;
  }
});

/****************************************************************************
 * User Functions
 ****************************************************************************/
function randomToken() {
  return Math.floor((1 + Math.random()) * 1e16)
    .toString(16)
    .substring(1);
}
