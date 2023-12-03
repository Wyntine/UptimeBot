// @ts-check

const { Collection } = require("discord.js");
const icooldown = new Collection();
const db = require("croxydb");
const {
  Bakımda,
  Kullanamazsın,
  ZamanHata,
  YetkiHata,
  BotYetkiHata,
} = require("../views/embeds");
const { checkAdmin, replacePermText } = require("../functions/general");
const { Destek } = require("../views/rows");
const { Event } = require("../functions/event");

module.exports = new Event({
  name: "interactionCreate",
  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    // @ts-ignore
    const command = client.slashcommands.get(interaction.commandName);

    if (!command) return;
    if (db.fetch(`Bakım`) && !checkAdmin(interaction.user.id))
      return interaction.reply({
        embeds: [Bakımda()],
        components: [Destek],
        ephemeral: true,
      });
    if (db.fetch(`Karaliste_${interaction.user.id}`))
      return interaction.reply({
        embeds: [Kullanamazsın],
        components: [Destek],
        ephemeral: true,
      });

    if (!checkAdmin(interaction.user.id)) {
      if (!icooldown.has(interaction.commandName))
        icooldown.set(interaction.commandName, new Collection());

      const now = Date.now();
      const timestampt = icooldown.get(interaction.commandName);
      const cooldownAmount = command.cooldown * 1000;

      if (timestampt.has(interaction.user.id)) {
        const expiration = timestampt.get(interaction.user.id) + cooldownAmount;

        if (now < expiration) {
          const timeleft = Math.round((expiration - now) / 1000);

          interaction.reply({ embeds: [ZamanHata(timeleft)] });
          return setTimeout(() => interaction.deleteReply(), expiration - now);
        }
      } else {
        timestampt.set(interaction.user.id, now);
        setTimeout(
          () => timestampt.delete(interaction.user.id),
          cooldownAmount
        );
      }
    }

    if (command.yetki) {
      const yetki = replacePermText(command.yetki);

      // @ts-ignore
      if (!interaction.member?.permissions.has(`${command.yetki}`))
        return interaction.reply({ embeds: [YetkiHata(yetki)] });
    }

    if (command.botyetki) {
      const botyetki = replacePermText(command.botyetki);

      if (
        !interaction.guild?.members.me?.permissions.has(`${command.botyetki}`)
      )
        return interaction.reply({ embeds: [BotYetkiHata(botyetki)] });
    }

    try {
      command.execute(client, interaction);
    } catch (error) {
      console.error(error);
    }
  },
});
