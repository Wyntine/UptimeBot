// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const { Command } = require("../functions/command");
const { İstatistik } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("istatistik")
    .setDescription("Bot istatistiklerini gösterir.")
    .setDMPermission(false),
  async execute(client, interaction) {
    return interaction.reply({ embeds: [İstatistik(interaction)] });
  },
});
