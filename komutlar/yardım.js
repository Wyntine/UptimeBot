// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const { Command } = require("../functions/command");
const { Yardım } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("yardım")
    .setDescription("Uptime yardım menüsü.")
    .setDMPermission(false),
  async execute(client, interaction) {
    return interaction.reply({ embeds: [Yardım()] });
  },
});
