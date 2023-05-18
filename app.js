const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'edi'
});



//const twilio = require('twilio')(accountSid, authToken);



connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database with threadId: ' + connection.threadId);
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/sign-in", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/signin', function(req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const phone = req.body.phone;
    const address = req.body.address;
    const passw = req.body.passw;
    const usertype = req.body.usertype;

    connection.query("INSERT INTO user(firstname, lastname, phone, address, passw, usertype) VALUES (?, ?, ?, ?, ?, ?)", [firstname, lastname, phone, address, passw, usertype], function(error, results, fields) {
        if (error) {
            console.error('Error submitting form: ' + error.stack);
            res.status(500).send('Error submitting form');
        } else {
            console.log('Form submitted successfully with id: ' + results.insertId);
            res.redirect("/submit-try");
        }
    });
});

app.post('/submit-form', function(req, res) {
    const email = req.body.email;
    const passw = req.body.pass;

    connection.query("INSERT INTO luser(email, passw) VALUES (?, ?)", [email, passw], function(error, results, fields) {
        if (error) {
            console.error('Error submitting form: ' + error.stack);
            res.status(500).send('Error submitting form');
        } else {
            console.log('Form submitted successfully with id: ' + results.insertId);
            res.redirect("/submit-try");
        }
    });
});

app.get('/jobp', (req, res) => {
    const sql = 'SELECT * FROM user';

    connection.query(sql, (err, results) => {
        if (err) {
            throw err;
        }

        res.send(`
            <h1>Users</h1>
            <ul>
                ${results.map(user => `
                    <li>
                        ${user.firstname}
                        <form action="/checkout" method="GET">
                            <input type="hidden" name="userId" value="${user.id}">
                            <button type="submit">Checkout</button>
                        </form>
                    </li>
                `).join('')}
            </ul>
        `);
    });
});

app.get('/checkout', (req, res) => {
    const userId = req.query.userId;

    res.send(`Checkout for user with ID: ${userId}`);
});


// Twilio credentials
/*const accountSid = 'AC69d87e182d88a9ad4c770522c07f7013';
const authToken = 'd0b6e4473aa1a2469da887a0c3b6279c';
const twilioPhoneNumber = '+12525019277';
app.get("/send-sms", function(req, res) {
    res.sendFile(__dirname + "/sms.html");
});*/
// Send SMS using Twilio
/*app.post('/send-sms', function(req, res) {
    const phoneNumber = req.body.phoneNumber;
    const message = req.body.message;

    twilio.messages
        .create({
            body: message,
            from: twilioPhoneNumber,
            to: 8767896477
        })
        .then(message => {
            console.log('SMS sent successfully');
            res.send('SMS sent successfully');
        })
        .catch(error => {
            console.error('Error sending SMS:', error);
            res.status(500).send('Error sending SMS');
        });
});

*/

app.listen(port, function() {
    console.log(`Server listening on port ${port}`);
});
