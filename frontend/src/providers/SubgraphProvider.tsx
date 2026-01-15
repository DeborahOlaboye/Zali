'use client';

import { ApolloProvider } from '@apollo/client';
import { graphqlClient } from '@/lib/graphqlClient';
import { ReactNode } from 'react';

interface SubgraphProviderProps {
  children: ReactNode;
}

export function SubgraphProvider({ children }: SubgraphProviderProps) {
  return <ApolloProvider client={graphqlClient}>{children}</ApolloProvider>;
}
