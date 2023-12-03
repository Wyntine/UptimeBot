// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const { Command } = require("../functions/command");
const { Say } = require("../views/embeds");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("link-say")
    .setDescription("Sistemdeki linklerin sayısını gösterir.")
    .setDMPermission(false),
  async execute(client, interaction) {
    return interaction.reply({ embeds: [Say(interaction.user.id)] });
  },
});
