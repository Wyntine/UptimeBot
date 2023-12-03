// @ts-check

const { Client, Partials } = require("discord.js");

/** @type {Partials[]} */
// @ts-ignore
const partials = Object.values(Partials).filter((x) => typeof x === "string");
const client = new Client({ intents: 131071, partials, shards: "auto" });

module.exports = { client };
