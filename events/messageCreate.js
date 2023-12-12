// @ts-check

const { Collection } = require("discord.js");
const pcooldown = new Collection();
const { prefix } = require("../functions/config").getConfig();
const db = require("croxydb");
const {
  Bakımda,
  Kullanamazsın,
  YetkiHata,
  BotYetkiHata,
  ZamanHata,
} = require("../views/embeds");
const { checkAdmin, replacePermText } = require("../functions/general");
const { Destek } = require("../views/rows");
const { Event } = require("../functions/event");

module.exports = new Event({
  name: "messageCreate",
  execute(message, client) {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const command = message.content.split(" ")[0].slice(prefix.length);
    const args = message.content.split(" ").slice(1);
    // @ts-ignore
    const cmd = client.commands.get(command);

    if (!cmd) return;

    if (db.fetch(`Bakım`) && !checkAdmin(message.author.id))
      return message.reply({
        embeds: [Bakımda()],
        components: [Destek],
      });

    if (db.fetch(`Karaliste_${message.author.id}`))
      return message.reply({ embeds: [Kullanamazsın], components: [Destek] });

    if (!checkAdmin(message.author.id)) {
      if (!pcooldown.has(cmd.name[0]))
        pcooldown.set(cmd.name[0], new Collection());

      const now = Date.now();
      const timestampt = pcooldown.get(cmd.name[0]);
      const cooldownAmount = cmd.cooldown * 1000;

      if (timestampt.has(message.author.id)) {
        const expiration = timestampt.get(message.author.id) + cooldownAmount;

        if (now < expiration) {
          const timeleft = Math.round((expiration - now) / 1000);

          return message.channel
            .send({ embeds: [ZamanHata(timeleft)] })
            .then((msg) => setTimeout(() => msg.delete(), expiration - now));
        }
      } else {
        timestampt.set(message.author.id, now);
        setTimeout(() => timestampt.delete(message.author.id), cooldownAmount);
      }
    }

    if (cmd.yetki) {
      const yetki = replacePermText(cmd.yetki);

      if (!message.member?.permissions.has(`${cmd.yetki}`))
        return message.channel.send({ embeds: [YetkiHata(yetki)] });
    }

    if (cmd.botyetki) {
      const botyetki = replacePermText(cmd.botyetki);

      if (!message.guild?.members.me?.permissions.has(`${cmd.botyetki}`))
        return message.channel.send({ embeds: [BotYetkiHata(botyetki)] });
    }

    cmd.execute(client, message, args);
  },
});
