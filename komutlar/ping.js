// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const { Command } = require("../functions/command");
const { PingÖlçüm } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun gecikme sürelerini gösterir."),
  async execute(client, interaction) {
    return interaction.reply({ embeds: [PingÖlçüm(client.ws.ping)] });
  },
});
