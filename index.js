const express = require('express')
const app = express()
const port = 3000
const request = require("request");

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp ({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render("welcome")
})

const score = 0;

app.get('/loginsubmit', (req, res) => {
  const name = req.query.name;
  const username = req.query.username;
  const password = req.query.password;
  db.collection("users")
    .where("name", "==", name)
    .where("username", "==", username)
    .where("password", "==", password)
    .get()
    .then((docs) => {
      if(docs.size > 0) {
        var userData = [];
        db.collection("users")
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              userData.push(doc.data())
            })
          })
          .then(() => {
              res.render("mp", {userData : userData});
          })
        
      } else {
        res.send("Login failed");
      }
    });
});
app.get('/login', (req, res) => {
  res.render("login")
})

app.get('/registersubmit', (req, res) => {
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const email = req.query.email;
  const phno = req.query.phno;
  const username = req.query.username;
  const password = req.query.password;
  const repassword = req.query.repassword;

  db.collection("users")
    .add({
      name: firstname + " " + lastname,
      username: username,
      password: password,
      score: 0,
    })
    .then(() => {
      res.render("login")
    });

});
app.get('/register', (req, res) => {
  res.render("register")
});
app.get('/questionsubmit', (req, res) => {
  const name = req.query.name;
  const que = req.query.question;
  var userData = [];
    db.collection("users")
      .where("name", "==", name)
      .then({
        
        .add({

        })
      })
      // .add({
      //   que : que,
      //   score : score + 5,
      // })
      .get()
      //.then((docs) => {
        //docs.forEach((doc) => {
          //userData.push(doc.data())
        
        //})
      

      .then(() => {
        res.render("quesubmit", {userData : userData});
      })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})