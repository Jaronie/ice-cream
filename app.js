// Import required modules
import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

// Define the port number where our server will listen
const PORT = 3007;

// Create an instance of an Express application
const app = express();

// Serve files from public
app.use(express.static('public'));

// Adding for EJS
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');

// in-memory array
const form_data = [];

// Load the environment variables from .env file
dotenv.config();

// Create a database connection pool with multiple connections
const pool = mysql2.createPool({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT

}).promise();


// Database test route (for debugging)

app.get('/db-test', async (req, res) => {

    try {

       const orders = await pool.query('SELECT * FROM orders');

       res.send(orders[0]);

    } catch (err) {

       console.error('Database error:', err);

       res.status(500).send('Database error: ' + err.message);

    }

});
 
// Define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get('/', (req, res) => {

  res.render('index');

});

// Display all orders

app.get('/admin', async (req, res) => {

  try {

    // Fetch all orders from database, newest first
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');  

    // Render the admin page
    res.render('admin', { orders });        

  } catch (err) {

      console.error('Database error:', err);
      res.status(500).send('Error loading orders: ' + err.message);

  }

});

app.post('/submit',(req, res) =>{
  const order = {
    name: req.body['name'],
    email: req.body['email'],
    flavor: req.body['flavor'],
    cone: req.body['cone'],
    toppings: req.body.topping ? req.body.toppings : "none",
    comment: req.body['comment'],
    timestamp: new Date()
  };

  form_data.push(order);
  res.render('confirm', { order });

});

// Confirmation route - handles form submission
app.post('/thank-you', async (req, res) => {
  try {

    // Get form data from req.body
    const order = req.body;        

    // Log the order data (for debugging)
    console.log('New order submitted:', order);

    // Convert toppings array to comma-separated string 
    order.toppings = Array.isArray(order.toppings) ? order.toppings.join(", ") : ""; 

    // SQL INSERT query with placeholders to prevent SQL injection
    const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings, comment) 
                  VALUES (?, ?, ?, ?, ?, ?);`;

    // Parameters array must match the order of ? placeholders

    // Make sure your property names match your order names

    const params = [

      order.name,
      order.email,
      order.flavor,
      order.cone,
      order.toppings,
      order.comment

    ];

    // Execute the query and grab the primary key of the new row
    const result = await pool.execute(sql, params);

    console.log('Order saved with ID:', result[0].insertId);

    // Return toppings to an array for use on confirm page
    order.toppings = order.toppings.split(", "); 

    // Render confirmation page with the  data
    res.render('confirm', { order });        

  } catch (err) {

    console.error('Error saving order:', err);

    res.status(500).send('Sorry, there was an error processing your order. Please try again.');
  }

});


// Start the server and listen on the specified port

app.listen(PORT, () => {

    console.log(`Server is running at http://localhost:${PORT}`);

});

