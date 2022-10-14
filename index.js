const http = require('http');
const express = require('express')
const path = require('path');
const app = express()
const request = require("request");
const querystring = require('querystring');

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp ({
  credential: cert(serviceAccount),
});

const db = getFirestore();

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
              res.render("mp", {userData : userData, name : name, username : username});
          })
        
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
  } else {
    res.send("<center><h1 style=\"padding-top: 20%\">PASSWORD AND RE-ENTER PASSWORD SHOULD BE SAME</h1></center>")
  }

  

});
app.get('/register', (req, res) => {
  res.render("register")
});
app.get('/questionsubmit', (req, res) => {
  const que = req.query.que;
  db.collection("users")
    .add({
      que : que,
    })
    .then(() => {
      //res.render("quesubmit", {que});
    });
      //const name = req.query.name;
  /*var userData = [];
    db.collection("users")
      .where("name", "==", name)
      .then({
        
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
      })*/
});

app.get('/rank', (req, res) => {
  const name = req.query.name;
  const username = req.query.username;
  const userData = req.query.array;
  //const userData = JSON.parse(req.query['userData']);
  res.render("rank", {name : name, username : username, userData : userData});
})

app.post('/update', async(req, res) => {
  try {
      const name = req.body.name;
      const s = 5;
      const userRef = await db.collection("users").doc(name)
      .update({
        score: s,
      });
      const response = await userRef.get();
      res.send(userRef);
  } catch(error) {
      res.send(error);
  }
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})