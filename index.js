const http = require('http');
const express = require('express')
const path = require('path');
const app = express()
const request = require("request");
const querystring = require('querystring');
const FieldValue = require('firebase-admin').firestore.FieldValue;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");
const { name } = require('ejs');

initializeApp ({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs")

app.use(express.static("public"));

app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

app.get('/', (req, res) => {
    res.render("welcome")
})

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
              //console.log(userData);
              //console.log(name);
              res.render("mp", {userData : userData, name : name});
          });
          
        
      } else {
        res.send("<center><h1 style=\"padding-top: 50px;\">LOGIN FAILED</h1> <h1>Enter correct credentials</h1><br><h2>OR</h2><br><h1>If not registered </h1><a href = \"http://localhost:3000/register\"><h2>Register Here</h2></a></center>");
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

  if(password === repassword) {
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
    console.log(typeof(score));
  } else {
    res.send("<center><h1 style=\"padding-top: 20%\">PASSWORD AND RE-ENTER PASSWORD SHOULD BE SAME</h1></center>")
  }

  

});
app.get('/register', (req, res) => {
  res.render("register")
});

app.get('/questions', (req, res) => {
  // const que = req.query.que;
  var queData = [];
  db.collection("questions")
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        queData.push(doc.data())
      })
    })
    .then(() => {
      res.render("questions", {queData : queData});
    });
})


app.get('/questionsubmit', (req, res) => {
  que = req.query.que;
  n = req.query.name;
  db. collection("users"). where("name", "==", n)
    .get()
    .then(function(querySnapshot) {
      querySnapshot. forEach(function(doc) {
        // console.log(doc.id);
        const id = doc.id;
        db.collection("users").doc(id).update ({
          score : FieldValue.increment(5),
        })
      });
    })
  db.collection("questions")
    .add({
      que : que,
      name: n,
    })
    .then(() => {
      var x = "https://www.google.com/search?q=" + que;
      res.render("ans", {que : que, x : x});
    });
})


app.get('/rank', (req, res) => {
  var userData = [];
  db.collection("users")
  .get()
  .then((docs) => {
    docs.forEach((doc) => {
      userData.push(doc.data())
    })
  })
  .then(() => {
    res.render("rank", {userData : userData});
  });
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})