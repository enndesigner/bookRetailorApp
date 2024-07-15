const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {  
  const {username, password} = req.body;
  console.log(isValid(username));
  if(username && password && isValid(username)){
    const id = "id" + Math.random().toString(16).slice(2)
    users.push({username: username, password: password, id: id})
    return res.send("User successfully registered");
    
  }
  return res.status(400).json({message: "User already exists or input data is invalid. Please, check the spell."})
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  return await res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const arrISBN = await Object.keys(books)
  const foundBook =  await arrISBN.filter(isbn => isbn == req.params.isbn)
  if(foundBook) {
    return await res.send(JSON.stringify(books[foundBook[0]]));
  }
  return await res.status(404).json({message: "Book not found. Please, check the ISBN or try to find different book."})
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const foundBooks = await Object.values(books).filter(book=>book.author === req.params.author)
  if(foundBooks[0]) {
    return await res.send(JSON.stringify(foundBooks));
  }
  return await res.status(404).json({message: "Book not found. Please, check the spell or try to find different book."});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const foundBooks = await Object.values(books).filter(book=>book.title === req.params.title)
  if(foundBooks[0]) {
    return await res.send(JSON.stringify(foundBooks));
  }
  return await res.status(404).json({message: "Book not found. Please, check the spell or try to find different book."})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book =  books[req.params.isbn]
  if (book) {
    return res.send(JSON.stringify(books[req.params.isbn].reviews));
  }
  res.status(404).json({message: "Book not found."})
});

module.exports.general = public_users;
