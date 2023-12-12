// @ts-check

const fetch = require("node-fetch");
const { Event } = require("../functions/event");
const { getAllLinks, removeEmptyData } = require("../functions/general");
const { botName } = require("../functions/config").getConfig();

module.exports = new Event({
  name: "ready",
  async execute(client) {
    console.log(`Bot Aktif`);
    presence(client);
    uptime();
  },
});

/**
 * @param {import("discord.js").Client<true>} client
 */
async function presence(client) {
  client.user.setActivity(`/yardım • ${botName}`);
  return setTimeout(() => presence(client), 30 * 1000);
}

async function uptime() {
  removeEmptyData();
  const links = getAllLinks();

  if (links.length) {
    links.forEach((link) => {
      try {
        // @ts-ignore
        fetch(link);
      } catch (e) {
        console.error("Hata: ", e);
      }
    });
    console.log("Uptime başarılı");
  }

  return setTimeout(uptime, 120 * 1000);
}
