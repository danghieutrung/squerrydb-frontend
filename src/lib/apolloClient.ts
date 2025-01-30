import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    // uri: "http://127.0.0.1:8000/graphql",
    uri: "https://squerrydb-backend-production.up.railway.app/graphql",
    cache: new InMemoryCache(),
  });


export default client;
