const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { id: 1, username: "username1", password: "password" },
  { id: 2, username: "username2", password: "password" },
  { id: 3, username: "username3", password: "password" }
];

const isValid = (username) => { //returns boolean
  if (username && !users.find(item => item.username === username)) {
    return true
  }
  return false
}

const authenticatedUser = (username, password) => { //returns boolean
  const isAuthenticated = users.find(user => user.username == username && user.password == password)
  if (isAuthenticated) {
    return true
  }
  return false
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  console.log(authenticatedUser(req.body.username, req.body.password));
  if (req.body.username && req.body.password && authenticatedUser(req.body.username, req.body.password)) {
    const user = users.find(u => u.username === req.body.username);
    req.session.userID = user.id
    return res.send("User is successfully authenticated!")
  }
  return res.status(400).json({ message: "user is not found or invalid data input, check the spell" })

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const input_isbn = req.params.isbn
  const arrISBN = Object.keys(books)
  const foundBook = arrISBN.filter(isbn => isbn == input_isbn)
  if (!foundBook[0]) {
    return res.status(404).json({ message: "book is not found, try different isbn" })
  }
  if (req.body.content) {
    const reviewExist = books[input_isbn].reviews.find(r => r.userId === req.session.userID)
    if (reviewExist) {
      const modifiedArray = books[input_isbn].reviews.reduce((acc, obj) => {
        if (obj.userId === req, session.userID) {
          const modifiedObj = { ...obj, content: req.body.content };
          acc.push(modifiedObj);
        } else {
          acc.push(obj);
        }
        return acc;
      }, []);
      books[input_isbn].reviews = [...modifiedArray]
    } else {
      books[input_isbn].reviews.push({ userId: req.session.userID, content: req.body.content });
    }
    return res.send(JSON.stringify(books[input_isbn].reviews))
  }
  return res.status(400).json({ message: "Review can't be empty" })
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const input_isbn = req.params.isbn
  const filtredBooks = books[input_isbn].reviews.filter(r => r.userId !== req.session.userID)
  books[input_isbn].reviews = [...filtredBooks];
  return res.status(200).json({message: "Your review is deleted", payload: JSON.stringify(books[input_isbn].reviews)})
})

module.exports.authenticated = regd_users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.isValid = isValid;
module.exports.users = users;
