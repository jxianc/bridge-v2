require("dotenv").config();

module.exports = [
  {
    type: "postgres",
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: process.env.PG_SYNC,
    logging: process.env.PG_LOG,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  },
];
