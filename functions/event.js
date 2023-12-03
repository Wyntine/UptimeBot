// @ts-check

const { Client } = require("discord.js");

/**
 * @template {keyof import("discord.js").ClientEvents} Category
 */
class Event {
  /**
   * @param {{
   *  name: Category
   *  execute: (...args: [...import("discord.js").ClientEvents[Category], client: Client<true>]) => any | Promise<any>
   * }} options
   */
  constructor(options) {
    const { name, execute } = options;
    this.name = name;
    this.execute = execute;
  }
}

module.exports = { Event };
