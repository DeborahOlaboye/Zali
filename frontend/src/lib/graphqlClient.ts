import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// The Graph Studio endpoint (update after deployment)
const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
  'https://api.studio.thegraph.com/query/your-subgraph-id/zali-trivia/v1.0.0';

const httpLink = new HttpLink({
  uri: SUBGRAPH_URL,
});

export const graphqlClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Player: {
        keyFields: ['id'],
      },
      Question: {
        keyFields: ['id'],
      },
      Answer: {
        keyFields: ['id'],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});
