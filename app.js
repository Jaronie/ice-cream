// Import the express module

import express from 'express';

// Create an instance of an Express application

const app = express();

// Serve files from public

app.use(express.static('public'));

// Set view engine to EJS

app.set('view engine', 'ejs');


// Define the port number where our server will listen

const PORT = 3007;

// in-memory array
const form_data = [];

// Adding for EJS

app.use(express.urlencoded({ extended: true }));
 
// Define a default "route" ('/')

// req: contains information about the incoming request

// res: allows us to send back a response to the client
app.get('/', (req, res) => {

  res.render('index');

});

app.get('/admin', (req, res) => {
  res.render('admin', { form_data }); // renders admin page with form_data JSON objects
});


app.post('/submit',(req, res) =>{
  const submission = {
    name: req.body['order-name'],
    email: req.body['order-email'],
    flavor: req.body['flavor'],
    cone_type: req.body['cone-option'],
    toppings: req.body.toppings ? req.body.toppings : "none",
    comment: req.body['comments'],
    timestamp: new Date()
  };

  form_data.push(submission)
  res.render('confirm', { submission });

});

// Thank you route
app.get('/thank-you', (req, res) => {
    res.render('confirm');
});


// Start the server and listen on the specified port

app.listen(PORT, () => {

    console.log(`Server is running at http://localhost:${PORT}`);

});

