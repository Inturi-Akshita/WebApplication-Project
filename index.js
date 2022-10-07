const express = require('express')
const app = express()
const port = 3000

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

app.get('/welcome/register', (req, res) => {
  res.render("register")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})