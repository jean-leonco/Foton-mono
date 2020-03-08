import { Environment, Network, RecordSource, Store, Variables } from 'relay-runtime';
import RelayQueryResponseCache from 'relay-runtime/lib/network/RelayQueryResponseCache';

import { GRAPHQL_URL } from '../common/config';

const oneMinute = 60 * 1000;
const cache = new RelayQueryResponseCache({ size: 250, ttl: oneMinute });

let token: string;

export function setToken(storageToken: string) {
  token = storageToken;
}

async function fetchQuery(operation: any, variables: Variables, cacheConfig?: any): Promise<{}> {
  const queryID = operation.text;
  const isMutation = operation.operationKind === 'mutation';
  const isQuery = operation.operationKind === 'query';
  const forceFetch = cacheConfig && cacheConfig.force;

  const fromCache = cache.get(queryID, variables);

  if (isQuery && fromCache !== null && !forceFetch) {
    return fromCache;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  const json = await response.json();

  if (isQuery && json) {
    cache.set(queryID, variables, json);
  }

  if (isMutation) {
    cache.clear();
  }

  return json;
}

const modernEnvironment: Environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default modernEnvironment;
