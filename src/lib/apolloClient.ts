import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://squerrydb-backend-production-1.up.railway.app/graphql",
    cache: new InMemoryCache(),
  });


export default client;
