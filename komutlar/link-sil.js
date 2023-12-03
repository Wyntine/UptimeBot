// @ts-check

const { SlashCommandBuilder } = require("discord.js");
const { LinkSilmeFormu } = require("../views/forms");
const { Command } = require("../functions/command");

module.exports = new Command({
  slash: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("link-sil")
    .setDescription("Sistemden link silersiniz.")
    .setDMPermission(false),
  async execute(client, interaction) {
    return interaction.showModal(LinkSilmeFormu);
  },
});
