const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Define the schema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Define the root resolver
const root = {
  hello: () => 'Hello, GraphQL!',
};

// Set up Express server
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enables the GraphiQL UI for testing queries
}));

app.listen(4000, () => console.log('GraphQL server running on http://localhost:4000/graphql'));
