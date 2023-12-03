// @ts-check

const { token } = require("./ayarlar.json");
const { client } = require("./client");

require("moment-duration-format");
require("./slash")(client);

process
  .on("uncaughtException", console.error)
  .on("unhandledRejection", console.error);
client.login(token);
