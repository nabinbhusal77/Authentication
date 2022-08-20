const express = require('express')
const { exit } = require('process')
const fs = require('fs')
const { render } = require('ejs')


const app = express()

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

const user = []

app.get('/', (req, res) => {
    res.render('index.ejs', {name: "Henry"})
})

app.get('/login', (req, res) => {
    res.render('login.ejs', {error: null})
})

app.get('/signup', (req, res) => {
    res.render('signup.ejs')
})

app.post('/login', (req, res) => {
    let email = req.body.email;
    let pass = req.body.pass;

    let userData = JSON.parse(fs.readFileSync('./user.json'))

    //Authenticating User
    let isEmailCorrect = false;
    let isPassCorrect = false;
    let error;
    for (const data of userData) {

        if (data.email === email) {
            isEmailCorrect = true
            
            if(data.password === pass) {
                isPassCorrect = true
            }
        }
    }

    if (!isEmailCorrect) {
        error = `No user with email: ${email}`
        res.render('login.ejs', {error: error})
    } else if (isEmailCorrect) {
        if(!isPassCorrect) {
            error = "Password doesn't match"
            res.render('login.ejs', {error: error})
        } else {
            res.render('index.ejs', {userEmail: email})
        }
    }


})
app.post('/signup', (req, res) => {
    user.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.pass
    })

    //Read file from user.json
    let userData = JSON.parse(fs.readFileSync('./user.json'))

    user.forEach(data => {
        userData.push(data)
        fs.writeFileSync('./user.json', JSON.stringify(userData))
    })
    
    res.redirect('/login')
})

app.listen(3000, () => {
    console.log("Connection Successfull")
})
