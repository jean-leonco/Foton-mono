import 'dotenv/config';
import path from 'path';

import dotenvSafe from 'dotenv-safe';

const cwd = process.cwd();

const root = path.join.bind(cwd);

if (!process.env.NOW_REGION) {
  dotenvSafe.config({
    allowEmptyValues: process.env.NODE_ENV !== 'production',
    path: root('.env'),
    sample: root('.env.example'),
  });
}

export const HOST = process.env.HOST || 'localhost';
export const PORT = process.env.PORT || '5001';

export const MONGO_URL = process.env.MONGO_URL;

export const APP_KEY = process.env.APP_KEY;

export const PROJECT = {
  GRAPHQL_SCHEMA_FILE: process.env.GRAPHQL_SCHEMA_FILE || './schemas/graphql/schema.graphql',

  // web, app
  GRAPHQL: process.env.GRAPHQL || 'graphql',
};
