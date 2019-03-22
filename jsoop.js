/**
 * Using ES6-style classes
 * See below for an alternative ES5-prototype solution setup
 */

class User {
  constructor(name) {
    
  }
  isLoggedIn() {}
  getLastLoggedInAt() {}
  logIn() {}
  logOut() {}
  getName() {}
  setName(name) {}
  canEdit(comment) {}
  canDelete(comment) {}
}

class Moderator extends User{
  
}

class Admin extends Moderator{}

class Comment {
  constructor(author, message, repliedTo) {}
  getMessage() {}
  setMessage(message) {}
  getCreatedAt() {}
  getAuthor() {}
  getRepliedTo() {}
  toString() {}
}

/** Object Creation **/








/**************************
 * Alternative using ES5 prototypes
 * Or feel free to choose your own solution format
 **************************
 
function User(name) {}
User.prototype = {
  isLoggedIn: function() {}
  getLastLoggedInAt: function() {}
  logIn: function() {}
  logOut: function() {}
  getName: function() {}
  setName: function(name) {}
  canEdit: function(comment) {}
  canDelete: function(comment) {}
}

var Admin = ???

var Moderator = ???

function Comment(author, message, repliedTo) {}
Comment.prototype = {
  getMessage: function() {}
  setMessage: function(message) {}
  getCreatedAt: function() {}
  getAuthor: function() {}
  getRepliedTo: function() {}
  toString: function() {}
}
***************************/