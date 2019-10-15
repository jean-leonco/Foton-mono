# GraphQL server

The server is where all main logic happens. The API follows [GraphQL Server Specifications](https://relay.dev/docs/en/graphql-server-specification) to provide data to [Relay](https://relay.dev/en/) based applications.

## Getting Started

### Prerequisites

Ensure you have the following resources to run properly:

- Node
- Yarn or npm
- MongoDB

> You can either have the database running in a container or directly in your machine.

### Configuration

Copy the .env.example file to the same directory and rename to .env

## Commands

### Develop

```sh
yarn start
```

### Test

```sh
yarn test
```

Or

```sh
yarn test:watch
```
