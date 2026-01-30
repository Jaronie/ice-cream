// Import the express module

import express from 'express';


// Create an instance of an Express application

const app = express();


// Define the port number where our server will listen

const PORT = 3000;



 app.use(express.static('public'));
 
// Define a default "route" ('/')

// req: contains information about the incoming request

// res: allows us to send back a response to the client
app.get('/', (req, res) => {

  res.sendFile(`${import.meta.dirname}/views/home.html`);

});


// Start the server and listen on the specified port

app.listen(PORT, () => {

    console.log(`Server is running at http://localhost:${PORT}`);

});

