const express = require('express')
const app = express()
const port = 3000

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp ({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs")

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/welcome', (req, res) => {
    res.render("welcome")
})

app.get('/welcome/login', (req, res) => {
  res.render("login")
})

app.get('/welcome/registersubmit', (req, res) => {
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const email = req.query.email;
  const phno = req.query.phno;
  const username = req.query.username;
  const password = req.query.password;
  const repassword = req.query.repassword;

  db.collection("users")
    .add({
      name: firstname + lastname,
      username: username,
      password: password,
    })
    .then(() => {
      res.render("login")
    });

});

app.get('/welcome/register', (req, res) => {
  res.render("register")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})