import 'dotenv/config';
import 'core-js';
import { createServer } from 'http';

import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import connectDatabase from '../common/database';
import { PORT, HOST } from '../common/config';

import app from './app';
import { schema } from './schema';

const runServer = async () => {
  try {
    // eslint-disable-next-line no-console
    console.log('\n🔗 Connecting to database...');
    await connectDatabase();
  } catch (error) {
    throw error;
  }

  const server = createServer(app.callback());

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.info(`\n🚀 Server started at http://${HOST}:${PORT}`);

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info(`\n🚝 GraphQL Playground available at http://${HOST}:${PORT}/playground`);
    }

    SubscriptionServer.create(
      {
        // eslint-disable-next-line no-console
        onDisconnect: () => console.info('\nClient subscription disconnected'),
        execute,
        subscribe,
        schema,

        // eslint-disable-next-line no-console
        onConnect: (connectionParams: any) => console.info('\nClient subscription connected', connectionParams),
      },
      {
        server,
        path: '/subscriptions',
      },
    );
  });
};

(async () => {
  // eslint-disable-next-line no-console
  console.log('\n📡 Server starting...');
  await runServer();
})();
