function copyToClipboard(roomId) {
  window.prompt("copy & send to your friend", window.location.hostname + "/join/" + roomId);
}