const Kahoot = require("kahoot.js-updated");
const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.sendStatus(200)
})

app.get('/:pin/:name/:bots', (req, res) => {
    //respond to http request
    res.send(`Smashing Kahoot with ${req.params.name}`)
    var i = 0
    //used for Bot(number)
    const login = () => {
        //if there are more bots then requested
        if (i >= req.params.bots) return;
        //create kahoot client
        const client = new Kahoot();
        console.log("attempting to join kahoot");
        //increase number by 1
        i++
        //attempt to join game
        client.join(req.params.pin, `${req.params.name}${i}`).catch(() => {
            console.log(`${req.params.name}${i} failed to join`)
            return;
        })
        //when successfully joined game
        client.on("Joined", () => {
            console.log(`${req.params.name}${i} joined successfully`);
            return login()
        });
        //when the kahoot is started
        client.on("QuizStart", () => {
            console.log("kahoot started");
        });
        //pick a random answer
        client.on("QuestionStart", question => {
            console.log("selecting random answer");
            question.answer(Math.floor(Math.random() * 4));
        });
        //when quiz ends
        client.on("QuizEnd", () => {
            console.log("quiz ended");
        });
    }
    login()
})

app.listen(3000, () => {
    console.log('server started successfully')
})