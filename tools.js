module.exports = {
  makeId: function(length, alpha) {
    var text = "";
    var possible = "";
  
    if (alpha) {
      possible = "abcdefghijklmnopqrstuvwxyz";
    } else {
      possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    }
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
}