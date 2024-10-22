// Import the 'pg' module
const { Client } = require('pg');

// Set up the PostgreSQL client
const client = new Client({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost', // Your database host (localhost if running locally)
  database: 'mydb', // Your database name
  password: '123', // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => {
    console.log('Connected to the PostgreSQL database');

    // Query the database for all rows in the 'persons' table
    return client.query('SELECT * FROM persons');
  })
  .then((result) => {
    console.log('Data from persons table:');
    console.table(result.rows); // Display the data in table format
  })
  .catch((err) => {
    console.error('Error executing query:', err);
  })
  .finally(() => {
    // Close the database connection
    client.end();
  });
