const express=require("express");
const bodyParser=require("body-parser");
const mysql=require("mysql");
const app=express();
const port=3000;

app.use(express.static(__dirname + '/public'));


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

const connection= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'1234',
    database:'edisup'
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database with threadId: ' + connection.threadId);
});

app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post('/submit-form',function(req,res){
    const email=req.body.email;
    const passw=req.body.pass;

    connection.query("Insert into luser(email, passw) values(?,?)",[email, passw],function(error, results, fields){
        if (error) {
            console.error('Error submitting form: ' + error.stack);
            res.status(500).send('Error submitting form');
        } else {
            console.log('Form submitted successfully with id: ' + results.insertId);
            app.get("/submit-try", function(req,res){
                res.sendFile(__dirname + "/new.html");
            });
            res.send('Form submitted successfully');
        }
    });
});

app.get('/jobp', (req, res) => {
    // Define a SQL query to select all users
    const sql = 'SELECT * FROM luser';

    // Execute the query using the connection
    connection.query(sql, (err, results) => {
        if (err) {
            throw err;
        }

        // Render the results on the web page
        res.send(`
            <h1>Users</h1>
            <ul>
                ${results.map(user => `<li>${user.email}</li>`).join('')}
            </ul>
        `);
    });
});



app.listen(port, function() {
    console.log(`Server listening on port ${port}`);
});
