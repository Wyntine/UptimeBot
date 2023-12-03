// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const { Command } = require("../functions/command");
const { DavetEmbed } = require("../views/embeds");
const { Davet } = require("../views/rows");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("davet")
    .setDescription("Botun linklerini gösterir.")
    .setDMPermission(false),
  async execute(client, interaction) {
    return interaction.reply({ embeds: [DavetEmbed], components: [Davet] });
  },
});
