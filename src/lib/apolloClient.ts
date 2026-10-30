import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_URL ??
      "https://squerrydb-backend-production.up.railway.app/graphql",
    cache: new InMemoryCache(),
  });


export default client;
