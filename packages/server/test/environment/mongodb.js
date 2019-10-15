/* eslint-disable */
const MongodbMemoryServer = require('mongodb-memory-server');
const NodeEnvironment = require('jest-environment-node');

class MongoDbEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.mongod = new MongodbMemoryServer.default({
      binary: {
        version: '4.0.10',
      },
      autoStart: false,
    });
  }

  async setup() {
    await super.setup();
    await this.mongod.start();
    this.global.__MONGO_URI__ = await this.mongod.getConnectionString();
    this.global.__MONGO_DB_NAME__ = await this.mongod.getDbName();
    this.global.__COUNTERS__ = {
      user: 0,
      product: 0,
    };
  }

  async teardown() {
    await super.teardown();
    await this.mongod.stop();
    this.mongod = null;
    this.global = {};
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = MongoDbEnvironment;
