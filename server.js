const { ApolloServer } = require("apollo-server");
const { sequelize } = require("./models");

// A map of functions which return data for the schema.
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  sequelize
    .authenticate()
    .then(() => console.log("Successfully connected to MYSQL Database "))
    .catch((err) => console.log(err));
});
